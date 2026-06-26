import { render, screen } from "../../utils/test-utils";
import { MainLayout } from "../MainLayout";
import { vi } from "vitest";

// Mock TopBar to isolate layout test
vi.mock("../TopBar", () => ({
  TopBar: () => <div data-testid="mock-topbar">TopBar</div>,
}));

// Mock react-router-dom outlet
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useOutlet: () => <div data-testid="mock-outlet">Outlet Content</div>,
  };
});

describe("MainLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the layout correctly including TopBar, outlet, and Footer", () => {
    render(<MainLayout />);

    // Check TopBar
    expect(screen.getByTestId("mock-topbar")).toBeInTheDocument();

    // Check Outlet content
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();

    // Check Footer content
    expect(screen.getByText("MATHGRAPH")).toBeInTheDocument();

    // Check Footer links using translation keys
    expect(screen.getByText("footer.about")).toBeInTheDocument();
    expect(screen.getByText("footer.contribute")).toBeInTheDocument();
    expect(screen.getByText("footer.support")).toBeInTheDocument();
    expect(
      screen.getByText("footer.rights", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText("footer.tagline")).toBeInTheDocument();

    // Check Github link
    const links = screen.getAllByRole("link");
    const githubHref = links.find(
      (l) => l.getAttribute("href") === "https://github.com",
    );
    expect(githubHref).toBeInTheDocument();
  });
});
