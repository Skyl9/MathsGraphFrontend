import { useQuery } from "@tanstack/react-query";
import { nodeApi, GraphData } from "../services/api";
import { useMemo } from "react";
import { NodeData } from "../types/ApiTypes/graph";
import { computeDomainsLayout } from "../utils/layoutUtils";

export const useGraphData = () => {
  const {
    data: graphData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<GraphData>({
    queryKey: ["graphData"],
    queryFn: async () => {
      console.log("Fetch réel du graphe via l'API !");
      const data = await nodeApi.getGraph();
      if (data && data.nodes) {
        computeDomainsLayout(data.nodes);
      }
      return data;
    },
  });

  const nodesMap = useMemo(() => {
    const map = new Map<number, NodeData>();
    if (graphData?.nodes) {
      graphData.nodes.forEach((n) => map.set(n.id, n));
    }
    return map;
  }, [graphData]);

  return {
    graphData: graphData || null,
    nodesMap,
    loading,
    error: error ? error.message : null,
    refetchGraphData: refetch,
  };
};
