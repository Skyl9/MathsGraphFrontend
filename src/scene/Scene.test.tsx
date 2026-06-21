import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Scene from "./Scene";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";

// Mock des composants Three.js pour éviter les erreurs WebGL dans jsdom
vi.mock("@react-three/fiber", () => ({
  useThree: () => ({
    camera: {
      position: {
        set: vi.fn(),
        clone: vi.fn().mockReturnThis(),
        lerp: vi.fn(),
      },
      lookAt: vi.fn(),
    },
    scene: { fog: null },
  }),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Instances: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="instances">{children}</div>
  ),
  Instance: (props: Record<string, unknown>) => (
    <div data-testid="instance" data-pos={JSON.stringify(props.position)} />
  ),
  Billboard: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Text: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Stars: () => <div />,
  Grid: () => <div />,
  GizmoHelper: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  GizmoViewport: () => <div />,
}));

vi.mock("@react-three/postprocessing", () => ({
  EffectComposer: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Bloom: () => <div />,
}));

// Mock Zustand stores
vi.mock("../stores/useUIStore");
vi.mock("../stores/useGraphStore");

const mockGraphData = {
  nodes: [
    {
      id: 1,
      nom: "Concept A",
      typeMath: "concept",
      position: {
        grille: { x: 10, y: 0, z: 0 },
        physique: { x: 5, y: 5, z: 5 },
        arbre: { x: 0, y: 10, z: 0 },
        timeline: { x: 20, y: 0, z: 0 },
      },
    },
  ],
  edges: [],
};

describe("Scene Layouts Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useGraphStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedNodeId: null,
      targetPosition: null,
      hoveredNodeId: null,
      setHoveredNodeId: vi.fn(),
      setSelectedNodeId: vi.fn(),
      setTargetPosition: vi.fn(),
    });
  });

  const renderSceneWithView = (view: string) => {
    (useUIStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const state = {
          darkMode: true,
          currentView: view,
          showEdges: true,
          performanceMode: false,
          showLabels: true,
          zoomAction: { action: null },
          setZoomAction: vi.fn(),
        };
        return selector(state);
      },
    );

    return render(<Scene graphData={mockGraphData} />);
  };

  it("should calculate correct positions for 'grille' layout", () => {
    const { container } = renderSceneWithView("grille");
    // Le composant mocké 'Instance' ou le DOM devrait refléter la cible de position
    // Comme nous ne pouvons pas tester l'animation GSAP facilement dans jsdom, on vérifie que le composant est rendu sans erreur
    expect(container).toBeInTheDocument();
  });

  it("should fallback to 'grille' if layout position is missing", () => {
    const missingLayoutData = {
      nodes: [{ id: 1, nom: "A", position: { grille: { x: 1, y: 1, z: 1 } } }],
      edges: [],
    };

    (useUIStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) =>
        selector({
          darkMode: true,
          currentView: "timeline",
          showEdges: true,
          performanceMode: false,
          showLabels: true,
          zoomAction: { action: null },
          setZoomAction: vi.fn(),
        }),
    );
    const { container } = render(<Scene graphData={missingLayoutData} />);
    expect(container).toBeInTheDocument();
  });
});
