import { render, screen, waitFor, fireEvent } from "../../utils/test-utils";
import NodePage from "../NodePage";
import { vi } from "vitest";
import { nodeApi } from "../../services/api";
import Token from "../../services/token";
import { Route, Routes } from "react-router-dom";

vi.mock("../../services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/api")>();
  return {
    ...actual,
    nodeApi: {
      ...actual.nodeApi,
      getConcept: vi.fn(),
      recordConceptView: vi.fn().mockResolvedValue(true),
    },
  };
});

vi.mock("../../services/token", () => ({
  default: {
    isUserConnected: vi.fn(),
    getUserIdFromToken: vi.fn(),
    getUserRoleFromToken: vi.fn(),
  },
}));

describe("NodePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRoute = (ui: React.ReactElement, route = "/concept/1") => {
    window.history.pushState({}, "Test page", route);
    return render(
      <Routes>
        <Route path="/concept/:id" element={ui} />
        <Route path="/404" element={<div>404 Page Not Found</div>} />
      </Routes>,
    );
  };

  it("renders a skeleton while loading, then data", async () => {
    // @ts-expect-error - mock
    Token.isUserConnected.mockReturnValue(false);

    // Simulate a delayed response
    let resolvePromise: (v: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    // @ts-expect-error - mock
    nodeApi.getConcept.mockReturnValue(promise);

    renderWithRoute(<NodePage />);

    // Skeleton should be visible
    expect(document.querySelector(".MuiSkeleton-root")).toBeInTheDocument();

    // Resolve with mock data
    const mockData = {
      id: 1,
      nom: "Théorème de Pythagore",
      enonce: "Dans un triangle rectangle...",
      demonstration: "Soit un triangle abc...",
      verification: true,
      aliases: [],
      relations: [],
      sources: [],
    };
    resolvePromise!(mockData);

    await waitFor(() => {
      // The skeleton disappears and the title appears
      expect(screen.getByText("Théorème de Pythagore")).toBeInTheDocument();
      // enonce is rendered
      expect(
        screen.getByText("Dans un triangle rectangle..."),
      ).toBeInTheDocument();
    });
  });

  it("redirects to 404 on error", async () => {
    // @ts-expect-error - mock
    nodeApi.getConcept.mockRejectedValue(new Error("Not found"));
    renderWithRoute(<NodePage />);

    await waitFor(() => {
      expect(screen.getByText("404 Page Not Found")).toBeInTheDocument();
    });
  });

  it("shows edit menu options if user is connected", async () => {
    // @ts-expect-error - mock
    Token.isUserConnected.mockReturnValue(true);

    const mockData = {
      id: 1,
      nom: "Théorème Test",
      enonce: "Test",
      aliases: [],
      relations: [],
      sources: [],
    };
    // @ts-expect-error - mock
    nodeApi.getConcept.mockResolvedValue(mockData);

    renderWithRoute(<NodePage />);

    await waitFor(() => {
      expect(screen.getByText("Théorème Test")).toBeInTheDocument();
    });

    // Open menu
    const menuButton = screen.getByRole("button", { name: /Plus d'actions/i });
    fireEvent.click(menuButton);

    await waitFor(() => {
      // "Mode Édition" should be visible in the menu
      expect(screen.getByText("concept.enable_edit_mode")).toBeInTheDocument();
    });
  });
});
