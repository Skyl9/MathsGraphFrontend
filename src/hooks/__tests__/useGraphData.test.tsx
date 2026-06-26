import { renderHook, waitFor } from "@testing-library/react";
import { useGraphData } from "../useGraphData";
import { nodeApi } from "../../services/api";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("../../services/api", () => ({
  nodeApi: {
    getGraph: vi.fn(),
  },
}));

describe("useGraphData", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("fetches graph data and creates a nodes map", async () => {
    const mockGraph = {
      nodes: [
        { id: 1, nom: "Node 1" },
        { id: 2, nom: "Node 2" },
      ],
      links: [],
    };
    // @ts-expect-error mock
    nodeApi.getGraph.mockResolvedValue(mockGraph);

    const { result } = renderHook(() => useGraphData(), { wrapper });

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(nodeApi.getGraph).toHaveBeenCalledTimes(1);
    expect(result.current.graphData).toEqual(mockGraph);

    // Check nodesMap
    expect(result.current.nodesMap.size).toBe(2);
    expect(result.current.nodesMap.get(1)).toEqual({ id: 1, nom: "Node 1" });
    expect(result.current.nodesMap.get(2)).toEqual({ id: 2, nom: "Node 2" });
  });

  it("handles errors when fetching graph data", async () => {
    // @ts-expect-error mock
    nodeApi.getGraph.mockRejectedValue(new Error("Failed to fetch"));

    const { result } = renderHook(() => useGraphData(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to fetch");
    expect(result.current.graphData).toBeNull();
    expect(result.current.nodesMap.size).toBe(0);
  });
});
