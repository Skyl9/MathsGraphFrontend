import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";

export const useGraphData = () => {
    const {
        data: graphData,
        isLoading: loading,
        error,
        refetch
    } = useQuery({
        queryKey: ['graphData'],
        queryFn: async () => {
            console.log("Fetch réel du graphe via l'API !");
            return await nodeApi.getGraph();
        },
    });

    return {
        graphData: graphData || null,
        loading,
        error: error ? error.message : null,
        refetchGraphData: refetch
    };
};