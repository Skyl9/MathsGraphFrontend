import { useCallback, useState, useMemo } from "react";
import { MathJaxContext } from "better-react-mathjax";
import { DataGrid, GridColDef, GridRowHeightParams, GridRowModel, GridRenderCellParams } from "@mui/x-data-grid";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import "../../styles/AdminPanel.css";
import {AllNodeData, NomEtranger} from "../../types/types";
import { nodeApi } from "../../services/api";
import {Source} from "../../types/ApiTypes/source";

export default function AdminPanel() {
    const queryClient = useQueryClient();

    const [filterType, setFilterType] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isRecalculating, setIsRecalculating] = useState(false);

    const handleRecalculate = async () => {
        setIsRecalculating(true);
        try {
            await nodeApi.recalculateGraph();
            alert("Recalcul terminé ! Les nouvelles positions seront visibles après un rechargement.");
            queryClient.invalidateQueries({ queryKey: ['adminNodes'] });
        } catch (e) {
            alert("Erreur lors du recalcul : " + String(e));
        } finally {
            setIsRecalculating(false);
        }
    };

    const { data, isLoading: loading, error: queryError } = useQuery<AllNodeData[]>({
        queryKey: ['adminNodes'],
        queryFn: async () => {
            const backendLink = import.meta.env.VITE_BACKEND_LINK || "";
            const response = await fetch(backendLink + '/getAlldatabaseInfo');
            if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
            return response.json();
        }
    });

    const error = queryError instanceof Error ? queryError.message : (queryError ? String(queryError) : null);

    const updateNodeMutation = useMutation({
        mutationFn: async ({ id, rowToUpdate }: { id: number, rowToUpdate: Partial<AllNodeData> }) => {
            const response = await fetch(import.meta.env.VITE_BACKEND_LINK + `/updateNodes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowToUpdate)
            });
            if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminNodes'] });
        }
    });

    const saveChanges = (id: number) => {
        if (!data) return;
        const rowToUpdate = data.find((row) => row.id === id);
        if (!rowToUpdate) return;
        updateNodeMutation.mutate({ id, rowToUpdate });
    };

    const getRowHeight = useCallback((params: GridRowHeightParams) => {
        const lineHeight = 1.5;
        const minHeight = 50;
        const headerHeight = 48;
        const contentHeight = params.model.enonce ? Math.ceil(params.model.enonce.length / 100 * lineHeight * 16) : minHeight;
        return Math.max(minHeight, contentHeight) + headerHeight;
    }, []);

    const uniqueTypes = useMemo(() => {
        return data ? Array.from(new Set(data.map(node => node.type))) : [];
    }, [data]);

    const filteredAndSortedData = useMemo(() => {
        if (!data) return [];

        let result = [...data];

        if (filterType) {
            result = result.filter(node => node.type === filterType);
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(node =>
                node.nom.toLowerCase().includes(lowerSearch) ||
                node.enonce.toLowerCase().includes(lowerSearch)
            );
        }

        return result;
    }, [data, filterType, searchTerm]);

    const renderCenteredCell = (params: GridRenderCellParams) => (
        <div className="cell-wrapper">
            {params.value as string}
        </div>
    );

    const columns: GridColDef<AllNodeData>[] = useMemo(() => [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            renderCell: (params: GridRenderCellParams<AllNodeData>) => {
                return (
                    <a href={`/concept/${params.row.id}`} target="_blank" rel="noopener noreferrer" className="cell-wrapper">
                        {params.row.id}
                    </a>
                );
            }
        },
        { field: 'nom', headerName: 'Nom', width: 200, editable: true, cellClassName: 'enonce-cell', renderCell: renderCenteredCell },
        { field: 'type', headerName: 'Type', width: 100, editable: true, renderCell: renderCenteredCell },
        { field: 'enonce', headerName: 'Énoncé', width: 600, editable: true, cellClassName: 'enonce-cell', renderCell: renderCenteredCell },
        { field: 'categorie', headerName: 'Catégorie', editable: true, renderCell: (params: GridRenderCellParams<AllNodeData>) => {
            const val = params.value;
            const categoryName = (typeof val === 'object' && val !== null && 'category' in val) ? (val as { category: string }).category : String(val || '');
            return <div className="cell-wrapper">{categoryName}</div>;
        } },
        {
            field: 'aliases',
            headerName: 'Alias',
            editable: true,
            cellClassName: 'enonce-cell',
            renderCell: (params: GridRenderCellParams<AllNodeData>) => {
                const aliases = params.row.aliases || [];
                return (
                    <div className="cell-wrapper">
                        {aliases.length > 0 ? (
                            aliases.map((alias: string, index: number) => <div key={index}>{alias}</div>)
                        ) : (
                            <span>Aucun alias</span>
                        )}
                    </div>
                );
            }
        },
        { field: 'date_ajout', headerName: 'Date d\'ajout', editable: true, renderCell: renderCenteredCell },
        { field: 'demonstration', headerName: 'Démonstration', editable: true, cellClassName: 'enonce-cell', width: 400, renderCell: renderCenteredCell },
        { field: 'relations', headerName: 'Relations', editable: true, cellClassName: 'enonce-cell', renderCell: renderCenteredCell },
        { field: "verification", headerName: "Vérification", editable: true , renderCell:(params: GridRenderCellParams<AllNodeData>) => {
                const verif = !!params.row.verification
            return (
                <div key={params.row.id}>
                    {(verif ? '✅' : '❌')}
                </div>
            )
            }
        },
        {
            field: 'sources',
            headerName: 'Sources',
            editable: true,
            cellClassName: 'enonce-cell',
            width: 300,
            renderCell: (params: GridRenderCellParams<AllNodeData>) => {
                const sources = params.row.sources || [];
                return (
                    <div className="cell-wrapper">
                        {sources.length > 0 ? (
                            sources.map((source: Source, index: number) => <div key={index}>{source.titre}</div>)
                        ) : (
                            <span>Aucune source</span>
                        )}
                    </div>
                );
            }
        },
        {
            field: "noms_etrangers",
            headerName: "Noms étrangers",
            editable: true,
            cellClassName: 'enonce-cell',
            width : 300,
            renderCell: (params: GridRenderCellParams<AllNodeData>) => {
                const noms = params.row.noms_etrangers || [];
                return (
                    <div className={"cell-lang"}  >
                        {noms.length > 0 ? (
                            noms.map((nom: NomEtranger, index: number) => (
                                <div key={index} className={"cell-wrapper"}>
                                    {nom.Nom_étranger} ({nom.langue})
                                </div>
                            ))
                        ) : (
                            <span>Aucun nom étranger</span>
                        )}
                    </div>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params: GridRenderCellParams<AllNodeData>) => (
                <button onClick={() => saveChanges(params.row.id)}>Sauvegarder</button>
            ),
        },
    ], [data]);

    const rows = useMemo(() => filteredAndSortedData.map(row => ({
        ...row,
        id: row.id,
    })), [filteredAndSortedData]);

    const handleProcessRowUpdate = useCallback(
        (newRow: GridRowModel<AllNodeData>) => {
            const updatedRow = { ...newRow } as AllNodeData;
            queryClient.setQueryData(['adminNodes'], (oldData: AllNodeData[] | undefined) =>
                oldData ? oldData.map((row) => (row.id === updatedRow.id ? updatedRow : row)) : []
            );
            return updatedRow;
        },
        [queryClient]
    );

    return (
        <div className="admin-container">
            <MathJaxContext>
                <h1 className="admin-title">🔧 Panel d'administration</h1>

                <div className="admin-global-actions" style={{ marginBottom: "20px" }}>
                    <button 
                        className="admin-btn-action" 
                        onClick={handleRecalculate} 
                        disabled={isRecalculating}
                        style={{ padding: "10px 20px", background: "#f44336", color: "white", border: "none", borderRadius: "5px", cursor: isRecalculating ? "not-allowed" : "pointer" }}
                    >
                        {isRecalculating ? "⏳ Recalcul en cours..." : "🔄 Recalculer les positions du graphe"}
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Rechercher un théorème..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />

                <select
                    value={filterType || ""}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    className="filter-select"
                >
                    <option value="">Tous les types</option>
                    {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <h2 className="admin-subtitle">📋 Liste des nœuds :</h2>

                {error && <div className="error-message">⚠ {error}</div>}
                {loading && <div className="loading-message">⏳ Chargement des données...</div>}
                {data && (
                    <div className={"table-container"}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            processRowUpdate={handleProcessRowUpdate}
                            onProcessRowUpdateError={(err) => console.error(err)}
                            getRowHeight={getRowHeight}
                        />
                    </div>
                )}
            </MathJaxContext>
        </div>
    );
}

