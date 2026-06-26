import { renderHook, waitFor, act } from "@testing-library/react";
import { useEntityData } from "../useEntityData";
import { nodeApi } from "../../services/api";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { GetConcept } from "../../types/ApiTypes/concept";

vi.mock("../../services/api", () => ({
  nodeApi: {
    getConcept: vi.fn(),
    updateConcept: vi.fn(),
    createCategory: vi.fn(),
  },
}));

vi.mock("../../services/token", () => ({
  default: {
    getUsernameFromToken: vi.fn().mockReturnValue("testuser"),
  },
}));

describe("useEntityData", () => {
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

  it("fetches entity data correctly", async () => {
    const mockData = { id: 1, nom: "Test Concept" };
    // @ts-expect-error mock
    nodeApi.getConcept.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useEntityData<GetConcept>("concept", "1"),
      {
        wrapper,
      },
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(nodeApi.getConcept).toHaveBeenCalledWith("1");
    expect(result.current.data).toEqual(mockData);
  });

  it("updates field optimistically and calls API", async () => {
    let mockData = { id: 1, nom: "Test Concept" };
    // @ts-expect-error mock
    nodeApi.getConcept.mockImplementation(() => Promise.resolve(mockData));
    // @ts-expect-error mock
    nodeApi.updateConcept.mockImplementation((id, field, value) => {
      mockData = { ...mockData, [field]: value };
      return Promise.resolve(true);
    });

    const { result } = renderHook(
      () => useEntityData<GetConcept>("concept", "1"),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call updateField
    let success = false;
    await act(async () => {
      success = await result.current.updateField("nom", "Updated Concept");
    });

    expect(success).toBe(true);
    expect(nodeApi.updateConcept).toHaveBeenCalledWith(
      "1",
      "nom",
      "Updated Concept",
      "testuser",
    );

    // The query should be invalidated and refetched eventually
    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1, nom: "Updated Concept" });
    });
  });

  it("creates a field (e.g. category) via createField", async () => {
    // @ts-expect-error mock
    nodeApi.createCategory.mockResolvedValue(true);
    // @ts-expect-error mock
    nodeApi.getConcept.mockResolvedValue({ id: 1 });

    const { result } = renderHook(
      () => useEntityData<GetConcept>("concept", "1"),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createField("categorie", "New Category");
    });

    expect(nodeApi.createCategory).toHaveBeenCalledWith("New Category");
  });
});
