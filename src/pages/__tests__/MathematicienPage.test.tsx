import { render, screen, waitFor } from "../../utils/test-utils";
import MathematicienPage from "../MathematicienPage";
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
      getOneMathematicien: vi.fn(),
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

describe("MathematicienPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRoute = (
    ui: React.ReactElement,
    route = "/mathematicien/1",
  ) => {
    window.history.pushState({}, "Test page", route);
    return render(
      <Routes>
        <Route path="/mathematicien/:id" element={ui} />
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
    nodeApi.getOneMathematicien.mockReturnValue(promise);

    renderWithRoute(<MathematicienPage />);

    // Skeleton should be visible
    expect(document.querySelector(".MuiSkeleton-root")).toBeInTheDocument();

    // Resolve with mock data
    const mockData = {
      id: 1,
      nom: "Euclide",
      biographie: "Père de la géométrie",
    };
    resolvePromise!(mockData);

    await waitFor(() => {
      // The skeleton disappears and the title appears
      expect(screen.getByText("Euclide")).toBeInTheDocument();
      expect(screen.getByText("Père de la géométrie")).toBeInTheDocument();
    });
  });

  it("redirects to 404 on error", async () => {
    // @ts-expect-error - mock
    nodeApi.getOneMathematicien.mockRejectedValue(new Error("Not found"));
    renderWithRoute(<MathematicienPage />);

    await waitFor(() => {
      expect(screen.getByText("404 Page Not Found")).toBeInTheDocument();
    });
  });

  it("shows edit toggle if user is connected", async () => {
    // @ts-expect-error - mock
    Token.isUserConnected.mockReturnValue(true);

    const mockData = {
      id: 1,
      nom: "Euclide",
      biographie: "Père de la géométrie",
    };
    // @ts-expect-error - mock
    nodeApi.getOneMathematicien.mockResolvedValue(mockData);

    renderWithRoute(<MathematicienPage />);

    await waitFor(() => {
      expect(screen.getByText("Euclide")).toBeInTheDocument();
    });

    // "Mode Édition" toggle should be visible
    expect(screen.getByText("node.edit_mode")).toBeInTheDocument();
  });
});
