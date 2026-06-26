import { render, screen, waitFor } from "../../utils/test-utils";
import ConceptList from "../ConceptList";
import { vi } from "vitest";
import { nodeApi } from "../../services/api";

// On mock nodeApi pour simuler les réponses réseau
vi.mock("../../services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/api")>();
  return {
    ...actual,
    nodeApi: {
      ...actual.nodeApi,
      getAllConceptNames: vi.fn(),
    },
  };
});

describe("ConceptList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a loading skeleton initially", () => {
    // La promesse ne se résout pas tout de suite
    // @ts-expect-error - mock
    nodeApi.getAllConceptNames.mockImplementation(() => new Promise(() => {}));

    render(<ConceptList />);

    // L'EntityListLayout affiche un ListSkeleton si loading=true.
    // On peut vérifier par le testId ou un élément visuel du skeleton.
    // Le ListSkeleton de Skeletons.tsx a des "skeleton-item" par défaut.
    expect(document.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("renders an error message when the API fails", async () => {
    // @ts-expect-error - mock
    nodeApi.getAllConceptNames.mockRejectedValue(
      new Error("Erreur de chargement réseau"),
    );

    render(<ConceptList />);

    await waitFor(() => {
      // L'Alert de MUI affiche le message d'erreur
      expect(
        screen.getByText("Erreur de chargement réseau"),
      ).toBeInTheDocument();
    });
  });

  it("renders the empty state when no concepts are found", async () => {
    // @ts-expect-error - mock
    nodeApi.getAllConceptNames.mockResolvedValue([]);

    render(<ConceptList />);

    await waitFor(() => {
      expect(screen.getByText("entities.no_concept_found")).toBeInTheDocument();
    });
  });

  it("renders the concepts in EntityGlassCards", async () => {
    const mockConcepts = [
      { id: 1, nom: "Addition" },
      { id: 2, nom: "Soustraction" },
    ];
    // @ts-expect-error - mock
    nodeApi.getAllConceptNames.mockResolvedValue(mockConcepts);

    render(<ConceptList />);

    await waitFor(() => {
      // React-window va rendre les div avec les cartes, plus le fallback SEO
      const additionElements = screen.getAllByText(/Addition/i);
      expect(additionElements.length).toBeGreaterThan(0);

      const soustractionElements = screen.getAllByText(/Soustraction/i);
      expect(soustractionElements.length).toBeGreaterThan(0);
    });

    // Le bouton "Voir" de la carte doit avoir un attribut href ou lier vers le bon lien
    // Dans react-router-dom Link, c'est un <a href="...">.
    const buttons = screen.getAllByRole("link", { name: "entities.view" });
    expect(buttons[0]).toHaveAttribute("href", "/concept/1");
    expect(buttons[1]).toHaveAttribute("href", "/concept/2");
  });
});
