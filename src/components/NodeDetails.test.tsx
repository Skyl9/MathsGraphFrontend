import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NodeDetails from "./NodeDetails";
import { useGraphData } from "../hooks/useGraphData";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";

// Mocks
vi.mock("../hooks/useGraphData");
vi.mock("../stores/useUIStore");
vi.mock("../stores/useGraphStore");
vi.mock("./MathMarkdown", () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="math-markdown">{content}</div>
  ),
}));
vi.mock("focus-trap-react", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("NodeDetails Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useUIStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = { darkMode: false, currentView: "grille" };
        return selector(state);
      },
    );

    (useGraphStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setSelectedNodeId: vi.fn(),
      setTargetPosition: vi.fn(),
    });

    const mockNodes = [
      {
        id: 1,
        nom: "Théorème de Pythagore",
        typeMath: "théorème",
        enonce: "a^2 + b^2 = c^2",
      },
      { id: 2, nom: "Triangle rectangle", typeMath: "concept" },
    ];

    const mockNodesMap = new Map();
    mockNodes.forEach((node) => mockNodesMap.set(node.id, node));

    (useGraphData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      graphData: {
        nodes: mockNodes,
        edges: [{ start: 1, end: 2, type: "utilise" }],
      },
      nodesMap: mockNodesMap,
    });
  });

  it("renders nothing if concept is not found", () => {
    const { container } = render(
      <NodeDetails id={999} onClose={mockOnClose} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the node title and math type correctly", () => {
    render(<NodeDetails id={1} onClose={mockOnClose} />);

    expect(screen.getByText("Théorème de Pythagore")).toBeInTheDocument();
    expect(screen.getByText("théorème")).toBeInTheDocument();
    expect(screen.getByTestId("math-markdown")).toHaveTextContent(
      "a^2 + b^2 = c^2",
    );
  });

  it("renders neighbors correctly", () => {
    render(<NodeDetails id={1} onClose={mockOnClose} />);

    expect(
      screen.getByText("node_details.linked_concepts"),
    ).toBeInTheDocument();
    expect(screen.getByText("Triangle rectangle")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const { container } = render(<NodeDetails id={1} onClose={mockOnClose} />);

    const closeButton = container.querySelector(".sidebar-close-btn");
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
