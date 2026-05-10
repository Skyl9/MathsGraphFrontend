import { useState, useEffect, useCallback } from "react";
import { Graph } from "../types/ApiTypes/graph";
import { nodeApi } from "../services/api";

export const useGraphData = () => {
    const [graphData, setGraphData] = useState<Graph | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGraphData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await nodeApi.getGraph();
            console.log("Réponse de l'API /graph (après traitement par la fonction request):", response);
            setGraphData(response);
            console.log("Données du graphe définies dans useGraphData:", response);
        } catch (err: unknown) {
            setError(`Erreur : ${err instanceof Error ? err.message : "Erreur inconnue"}`);
            console.error("Erreur lors de la récupération du graphe:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGraphData();
    }, [fetchGraphData]);

    return { graphData, loading, error, refetchGraphData: fetchGraphData };
};