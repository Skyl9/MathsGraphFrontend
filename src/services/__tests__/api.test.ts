import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { nodeApi, isApiError } from "../api";
import Token from "../token";
import { toast } from "react-toastify";
import { captureException } from "../logger";

// Mock dependencies
vi.mock("react-toastify", () => ({
  toast: {
    loading: vi.fn(),
    dismiss: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("../logger", () => ({
  captureException: vi.fn(),
}));

vi.mock("../token", () => ({
  default: {
    clearToken: vi.fn(),
    getUsernameFromToken: vi.fn(() => "testuser"),
    getUserIdFromToken: vi.fn(() => 123),
  },
}));

describe("api.ts", () => {
  const originalFetch = globalThis.fetch;
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();

    // Mock window.location
    delete (window as any).location;
    window.location = { ...originalLocation, href: "", pathname: "/" } as any;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    window.location = originalLocation as any;
  });

  describe("isApiError", () => {
    it("should return true for valid ApiError objects", () => {
      expect(isApiError({ status: 404, message: "Not found" })).toBe(true);
      expect(isApiError({ status: 500, message: "Error", code: "ERR" })).toBe(
        true,
      );
    });

    it("should return false for invalid objects", () => {
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
      expect(isApiError("Error")).toBe(false);
      expect(isApiError({ status: "404", message: "Not found" })).toBe(false); // status is string
      expect(isApiError({ status: 404 })).toBe(false); // missing message
    });
  });

  describe("request (internal wrapper via nodeApi)", () => {
    it("should return data on successful request", async () => {
      const mockData = { id: 1, nom: "Concept Test" };
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockData }),
      });

      const result = await nodeApi.getConcept("1");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/concepts/1"),
        expect.objectContaining({
          credentials: "include",
        }),
      );
      expect(result).toEqual(mockData);
    });

    it("should throw ApiError and show toast on API failure (success: false)", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ success: false, error: "Bad Request" }),
      });

      // Need to test a mutation to see the toast
      await expect(
        nodeApi.updateConcept("1", "nom", "val", "user"),
      ).rejects.toEqual({
        status: 400,
        message: "Bad Request",
        code: undefined,
      });

      expect(toast.error).toHaveBeenCalledWith("Bad Request");
      expect(captureException).toHaveBeenCalled();
    });

    it("should handle 401 Unauthorized, clear token and redirect", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: "Unauthorized" }),
      });

      window.location.pathname = "/some-page";

      await expect(
        nodeApi.updateConcept("1", "nom", "val", "user"),
      ).rejects.toMatchObject({
        status: 401,
      });

      expect(Token.clearToken).toHaveBeenCalled();
      expect(toast.info).toHaveBeenCalledWith(
        "Veuillez vous connecter pour accéder à cette fonctionnalité.",
      );
      expect(window.location.href).toBe("/login?session_expired=true");
    });

    it("should not redirect on 401 if already on /login", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ success: false, error: "Unauthorized" }),
      });

      window.location.pathname = "/login";

      await expect(
        nodeApi.updateConcept("1", "nom", "val", "user"),
      ).rejects.toMatchObject({
        status: 401,
      });

      expect(Token.clearToken).toHaveBeenCalled();
      expect(window.location.href).not.toBe("/login?session_expired=true");
    });

    it("should handle AbortError and show specific toast", async () => {
      const abortError = new DOMException(
        "The user aborted a request.",
        "AbortError",
      );
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        abortError,
      );

      await expect(nodeApi.getConcept("1")).rejects.toEqual({
        status: 408,
        message: "La requête a expiré.",
      });

      expect(toast.error).toHaveBeenCalledWith(
        "La requête a expiré. Veuillez vérifier votre connexion.",
      );
    });

    it("should handle generic network error and show toast for mutations", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Network Error"),
      );

      await expect(
        nodeApi.updateConcept("1", "nom", "val", "user"),
      ).rejects.toThrow("Network Error");

      expect(toast.error).toHaveBeenCalledWith(
        "Erreur réseau ou serveur injoignable.",
      );
      expect(captureException).toHaveBeenCalled();
    });

    it("should trigger slow toast for slow mutations", async () => {
      vi.useFakeTimers();

      // Simulate a pending promise
      let resolveRequest: any;
      const mockPromise = new Promise((resolve) => {
        resolveRequest = resolve;
      });

      (globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
        mockPromise,
      );

      const requestPromise = nodeApi.updateConcept("1", "nom", "val", "user");

      // Advance time past the 3000ms threshold
      vi.advanceTimersByTime(3100);

      expect(toast.loading).toHaveBeenCalledWith(
        "Chargement long en cours...",
        expect.any(Object),
      );

      // Resolve the request
      resolveRequest({
        ok: true,
        json: async () => ({ success: true, data: null }),
      });

      await requestPromise;

      expect(toast.dismiss).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe("API Endpoints Configuration", () => {
    it("should correctly configure GET endpoint", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

      await nodeApi.getAllUsers();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/admin/users"),
        expect.objectContaining({ credentials: "include" }),
      );
    });

    it("should correctly configure POST endpoint", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: null }),
      });

      await nodeApi.createCategory("New Category");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ value: "New Category" }),
        }),
      );
    });

    it("should correctly configure PATCH endpoint", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: null }),
      });

      await nodeApi.updateConcept("1", "nom", "New Name", "user");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/concepts/1"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            field: "nom",
            value: "New Name",
            username: "user",
          }),
        }),
      );
    });

    it("should correctly configure DELETE endpoint", async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: null }),
      });

      await nodeApi.deleteComment("5");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/comments/5"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });
});
