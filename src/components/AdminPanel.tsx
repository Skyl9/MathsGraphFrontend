import React, { useCallback, useEffect, useState, useMemo } from "react";
import { MathJaxContext } from "better-react-mathjax";
import Table from "./Table";
import { AllNodeData } from "../type";
import "./AdminPanel.css"; // Assure-toi que les styles sont adaptés

export default function AdminPanel() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AllNodeData[] | null>(null);
    const [editData, setEditData] = useState<{ [key: number]: Partial<AllNodeData> }>({});

    // États pour tri, filtre et recherche
    const [sortColumn, setSortColumn] = useState<keyof AllNodeData | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterType, setFilterType] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // 📌 Récupération des données depuis l'API
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const backendLink = process.env.REACT_APP_BACKEND_LINK || "";
        const port = process.env.REACT_APP_PORT || "8000";
        if (!backendLink) {
            setError("Lien du backend non défini");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendLink + port}/getAlldatabaseInfo/`);
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

    // 📌 Gestion des modifications locales avant envoi à l'API
    const handleEdit = (id: number, field: keyof AllNodeData, value: string) => {
        setEditData(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    // 📌 Envoi des modifications au serveur
    const saveChanges = async (id: number) => {
        if (!editData[id]) return;
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_LINK + `/updateNodes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData[id])
            });
            if (!response.ok) {
                setError(`Erreur serveur: ${response.status}`)
            }

            // Mise à jour locale des données après validation du serveur
            setData(prev => prev ? prev.map(node => node.id === id ? { ...node, ...editData[id] } : node) : prev);
            setEditData(prev => ({ ...prev, [id]: {} }));
        } catch (err) {
            console.error("Erreur lors de l'enregistrement :", err);
        }
    };

    // 📌 Tri des colonnes
    const handleSort = (column: keyof AllNodeData) => {
        setSortOrder(prevOrder => (sortColumn === column && prevOrder === "asc" ? "desc" : "asc"));
        setSortColumn(column);
    };

    // 📌 Liste des types uniques pour le filtre
    const uniqueTypes = useMemo(() => {
        return data ? Array.from(new Set(data.map(node => node.type))) : [];
    }, [data]);

    // 📌 Filtrage, tri et recherche des données
    const filteredAndSortedData = useMemo(() => {
        if (!data) return [];

        let result = [...data];

        // Filtrage par type
        if (filterType) {
            result = result.filter(node => node.type === filterType);
        }

        // Recherche textuelle
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(node =>
                node.nom.toLowerCase().includes(lowerSearch) ||
                node.enonce.toLowerCase().includes(lowerSearch)
            );
        }
        // Tri des colonnes

        if (sortColumn) {
            console.log(sortColumn);
            result.sort((a, b) => {
                const valueA = a[sortColumn];
                const valueB = b[sortColumn];

                // Vérification du type de la colonne pour choisir la bonne méthode de tri
                if (typeof valueA === "number" && typeof valueB === "number") {
                    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
                } else {
                    const strA = String(valueA || ""); // Convertit en string si nécessaire
                    const strB = String(valueB || "");
                    return sortOrder === "asc"
                        ? strA.localeCompare(strB)
                        : strB.localeCompare(strA);
                }
            });
        }


        return result;
    }, [data, sortColumn, sortOrder, filterType, searchTerm]);

    return (
        <div className="admin-container">
            <MathJaxContext>
                <h1 className="admin-title">🔧 Panel d'administration</h1>

                {/* Barre de recherche */}
                <input
                    type="text"
                    placeholder="Rechercher un théorème..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />

                {/* Filtre par type */}
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
                    <Table
                        data={filteredAndSortedData}
                        editData={editData}
                        handleEdit={handleEdit}
                        saveChanges={saveChanges}
                        handleSort={handleSort}
                        sortColumn={sortColumn}
                        sortOrder={sortOrder}
                    />
                )}
            </MathJaxContext>
        </div>
    );
}
