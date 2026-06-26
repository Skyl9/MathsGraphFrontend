import { render, screen, fireEvent, waitFor } from "../../utils/test-utils";
import Menu from "../Menu";
import React from "react";
import { vi } from "vitest";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => (
      <>{children}</>
    ),
    motion: {
      div: ({
        children,
        ...props
      }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <div {...props}>{children}</div>
      ),
    },
  };
});

vi.mock("focus-trap-react", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-focus-trap">{children}</div>
  ),
}));

// Mock the child components to simplify the test
vi.mock("../MenuSettings/MenuLayoutSettings", () => ({
  default: () => <div data-testid="menu-layout-settings" />,
}));

vi.mock("../MenuSettings/MenuColorsSettings", () => ({
  default: () => <div data-testid="menu-colors-settings" />,
}));

vi.mock("../MenuSettings/MenuSearchResults", () => ({
  default: () => <div data-testid="menu-search-results" />,
}));

vi.mock("../SearchBar", () => ({
  default: () => <div data-testid="search-bar" />,
}));

const mockGraphData = {
  nodes: [],
  links: [],
  edges: [],
};

describe("Menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the closed menu initially and the search bar", () => {
    render(<Menu graphData={mockGraphData} />);

    // Should render the open button
    expect(
      screen.getByRole("button", { name: /menu.open/i }),
    ).toBeInTheDocument();

    // Should render the search bar and results container
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("menu-search-results")).toBeInTheDocument();

    // Should not render the inner menu components
    expect(
      screen.queryByTestId("menu-layout-settings"),
    ).not.toBeInTheDocument();
  });

  it("opens the menu when the toggle button is clicked", async () => {
    render(<Menu graphData={mockGraphData} />);

    const openBtn = screen.getByRole("button", { name: /menu.open/i });
    fireEvent.click(openBtn);

    // The inner menu should now be visible
    expect(screen.getByTestId("menu-layout-settings")).toBeInTheDocument();
    expect(screen.getByTestId("menu-colors-settings")).toBeInTheDocument();
    expect(screen.getByText("menu.configuration")).toBeInTheDocument();
  });

  it("closes the menu when the close button is clicked", async () => {
    render(<Menu graphData={mockGraphData} />);

    // Open it
    fireEvent.click(screen.getByRole("button", { name: /menu.open/i }));
    expect(screen.getByText("menu.configuration")).toBeInTheDocument();

    // Close it
    const closeBtn = screen.getByRole("button", { name: /common.close/i });
    fireEvent.click(closeBtn);

    // Wait for it to be removed
    await waitFor(() => {
      expect(screen.queryByText("menu.configuration")).not.toBeInTheDocument();
    });
  });

  it("closes the menu when Escape is pressed", async () => {
    render(<Menu graphData={mockGraphData} />);

    // Open it
    fireEvent.click(screen.getByRole("button", { name: /menu.open/i }));
    expect(screen.getByText("menu.configuration")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    // Wait for it to be removed
    await waitFor(() => {
      expect(screen.queryByText("menu.configuration")).not.toBeInTheDocument();
    });
  });
});
