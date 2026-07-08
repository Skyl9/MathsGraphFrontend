import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import WantedPages from "../WantedPages";
import { nodeApi } from "../../services/api";
import { ThemeProvider, createTheme } from "@mui/material";

// Mock de l'API
vi.mock("../../services/api", () => ({
  nodeApi: {
    getWantedConcepts: vi.fn(),
  },
}));

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const theme = createTheme();

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <WantedPages />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe("WantedPages Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche un indicateur de chargement initialement", () => {
    vi.mocked(nodeApi.getWantedConcepts).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("affiche la liste des concepts incomplets", async () => {
    const mockData = [
      {
        id: 1,
        nom: "Concept Incomplet 1",
        categorie: "Algèbre",
        missing_fields: ["demonstration", "sources"],
      },
      {
        id: 2,
        nom: "Concept Incomplet 2",
        categorie: "Topologie",
        missing_fields: ["sources"],
      },
    ];
    vi.mocked(nodeApi.getWantedConcepts).mockResolvedValue(mockData);

    renderComponent();

    // Attendre la fin du chargement
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Vérifier la présence des éléments
    expect(screen.getByText("Appel à Contributions")).toBeInTheDocument();
    expect(screen.getByText("Concept Incomplet 1")).toBeInTheDocument();
    expect(screen.getByText("Concept Incomplet 2")).toBeInTheDocument();
    expect(screen.getByText("Algèbre")).toBeInTheDocument();
    expect(screen.getByText("Topologie")).toBeInTheDocument();
  });

  it("filtre les concepts par domaine", async () => {
    const mockData = [
      {
        id: 1,
        nom: "Concept Incomplet 1",
        categorie: "Algèbre",
        missing_fields: ["demonstration"],
      },
      {
        id: 2,
        nom: "Concept Incomplet 2",
        categorie: "Topologie",
        missing_fields: ["sources"],
      },
    ];
    vi.mocked(nodeApi.getWantedConcepts).mockResolvedValue(mockData);
    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Ouvrir le select
    const select = screen.getByLabelText(/Filtrer par domaine/i);
    await user.click(select);

    // Sélectionner "Algèbre"
    const option = screen.getByRole("option", { name: "Algèbre" });
    await user.click(option);

    // Vérifier que seul le concept 1 est affiché
    expect(screen.getByText("Concept Incomplet 1")).toBeInTheDocument();
    expect(screen.queryByText("Concept Incomplet 2")).not.toBeInTheDocument();
  });

  it("redirige vers la page d'édition au clic sur 'Contribuer'", async () => {
    const mockData = [
      {
        id: 1,
        nom: "Concept Incomplet",
        categorie: "Algèbre",
        missing_fields: ["demonstration"],
      },
    ];
    vi.mocked(nodeApi.getWantedConcepts).mockResolvedValue(mockData);
    const user = userEvent.setup();

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: /Contribuer/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/concept/1");
  });
});
