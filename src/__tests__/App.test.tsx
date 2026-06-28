import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { describe, it, expect, vi } from "vitest";

// Mocks to avoid rendering canvas and complex 3D logic in tests
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
}));

vi.mock("../scene/Scene", () => ({
  default: () => <div data-testid="scene" />,
}));

vi.mock("../hooks/useGraphData", () => ({
  useGraphData: () => ({
    loading: false,
    error: null,
    graphData: { nodes: [], edges: [] },
  }),
}));

vi.mock("../hooks/useUrlSync", () => ({
  useUrlSync: vi.fn(),
}));

vi.mock("../hooks/useGlobalShortcuts", () => ({
  useGlobalShortcuts: vi.fn(),
}));

// Mock ResizeObserver for some MUI/Third-party components
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("App", () => {
  it("renders the app successfully without crashing", async () => {
    render(<App />);

    // Le routeur va charger la route par défaut ("/") qui correspond à HomePage
    // ou tout du moins, l'AppContent sera monté, donc la scène 3D globale aussi.
    await waitFor(() => {
      // Vérifier que la div "GlobalGraph" (ou le container principal) est présent
      // Ici on vérifie le mock de la scène
      expect(screen.getByTestId("scene")).toBeInTheDocument();
    });
  });
});
