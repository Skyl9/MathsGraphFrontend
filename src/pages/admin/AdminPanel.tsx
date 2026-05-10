import React, { useCallback, useEffect, useState, useMemo } from "react";
import { MathJaxContext } from "better-react-mathjax";
import { DataGrid, GridColDef, GridRowHeightParams, GridRowId, GridRowModel } from "@mui/x-data-grid";
import "../../styles/AdminPanel.css";
import {AllNodeData, NomEtranger} from "../../types/types";
import {Source} from "../../types/ApiTypes/source";

export default function AdminPanel() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AllNodeData[] | null>(null);
    const [editData, setEditData] = useState<{ [key: number]: Partial<AllNodeData> }>({});

    const [filterType, setFilterType] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const backendLink = import.meta.env.VITE_BACKEND_LINK|| "";
        if (!backendLink) {
            setError("Lien du backend non défini");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(backendLink + '/getAlldatabaseInfo');
            if (!response.ok) {
                setError(`Erreur serveur: ${response.status}`);
                return;
            }

            const fetchedData: AllNodeData[] = await response.json();
            setData(fetchedData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err);
                setError(`Erreur : ${err.message}`);
            } else {
                console.error("Erreur inconnue", err);
                setError("Erreur inconnue");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData().catch((err) => console.error("Erreur dans useEffect:", err));
    }, [fetchData]);

    const handleEdit = (id: GridRowId, field: keyof AllNodeData, value: string) => {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id; // Conversion de id en nombre

        setEditData(prev => ({
            ...prev,
            [numericId]: { ...prev[numericId], [field]: value }
        }));
    };

    const saveChanges = async (id: number) => {
        console.log("id ", id, "  editData: ", editData);

        if (!data) return;
        const rowToUpdate = data.find(row => row.id === id);
        if (!rowToUpdate) return;
        try {
            console.log("id Intérieur", id, "  data: ", rowToUpdate);

            const response = await fetch(import.meta.env.VITE_BACKEND_LINK + `/updateNodes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowToUpdate)
            });
            if (!response.ok) {
                setError(`Erreur serveur: ${response.status}`);
            }
        } catch (err) {
            console.error("Erreur lors de l'enregistrement :", err);
        }
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    const getRowHeight = useCallback((params: GridRowHeightParams) => {
        const lineHeight = 1.5;
        const minHeight = 50;
        const headerHeight = 48; // Hauteur de l'en-tête
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

    const renderCenteredCell = (params: any) => (
        <div className="cell-wrapper">
            {params.value}
        </div>
    );

    const columns: GridColDef[] = useMemo(() => [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            renderCell: (params: { row: AllNodeData }) => {
                return (
                    <a href={`/concept/${params.row.id}`} target="_blank" rel="noopener noreferrer" className="cell-wrapper">
                        {params.row.id}
                    </a>
                );
            }
        },
        { field: 'nom', headerName: 'Nom', width: 200, editable: true, cellClassName: 'enonce-cell', renderCell: renderCenteredCell },
        { field: 'type', headerName: 'Type', width: 100, editable: true, renderCell: renderCenteredCell },
        { field: 'enonce', headerName: 'Énoncé', width: 600, editable: true, autoHeight: true, cellClassName: 'enonce-cell', renderCell: renderCenteredCell },
        { field: 'categorie', headerName: 'Catégorie', editable: true, renderCell: renderCenteredCell },

        {
            field: 'aliases',
            headerName: 'Alias',
            editable: true,
            cellClassName: 'enonce-cell',
            renderCell: (params: { row: AllNodeData }) => {
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
        { field: "verification", headerName: "Vérification", editable: true , renderCell:(params:{row:AllNodeData}) => {
                const verif:boolean = params.row.verification
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
            renderCell: (params: { row: AllNodeData }) => {
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
            renderCell: (params: { row: AllNodeData }) => {
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
            renderCell: (params: { row: AllNodeData }) => (
                <button onClick={() => saveChanges(params.row.id)}>Sauvegarder</button>
            ),
        },
    ], []);


    const rows = useMemo(() => filteredAndSortedData.map(row => ({
        ...row,
        id: row.id,
    })), [filteredAndSortedData]);

    const handleProcessRowUpdate = useCallback(
        (newRow: GridRowModel<AllNodeData>) => {
            const id = newRow.id as number;
            const updatedRow = { ...newRow } as AllNodeData;

            setData((prevData) =>
                prevData
                    ? prevData.map((row) => (row.id === id ? updatedRow : row))
                    : []
            );
            return newRow;
        },
        [setData]
    );

    return (
        <div className="admin-container">
            <MathJaxContext>
                <h1 className="admin-title">🔧 Panel d'administration</h1>

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
                            onProcessRowUpdateError={(error) => console.error(error)}
                            getRowHeight={getRowHeight}
                        />
                    </div>
                )}
            </MathJaxContext>
        </div>
    );
}
