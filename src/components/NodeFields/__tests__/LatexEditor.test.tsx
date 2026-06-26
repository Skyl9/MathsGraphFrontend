import { render, screen, fireEvent } from "../../../utils/test-utils";
import LatexEditor from "../LatexEditor";
import { vi } from "vitest";

// Mocker MathMarkdown car nous ne testons pas son fonctionnement interne ici
vi.mock("../../MathMarkdown", () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => (
    <div data-testid="math-markdown">{content}</div>
  ),
}));

describe("LatexEditor", () => {
  it("renders properly with text and updates correctly", () => {
    const handleChange = vi.fn();
    render(<LatexEditor text="test math" onChange={handleChange} />);

    expect(screen.getByText("Prévisualisation :")).toBeInTheDocument();

    // Le composant mocké doit afficher le texte passé
    expect(screen.getByTestId("math-markdown")).toHaveTextContent("test math");

    // L'input textarea
    const textbox = screen.getByRole("textbox");
    expect(textbox).toBeInTheDocument();

    // Simuler un changement
    fireEvent.change(textbox, { target: { value: "nouveau texte" } });
    expect(handleChange).toHaveBeenCalledWith("nouveau texte");
  });

  it("shows an error message when error prop is provided", () => {
    render(
      <LatexEditor
        text=""
        onChange={vi.fn()}
        error="Texte d'erreur spécifique"
      />,
    );
    expect(screen.getByText("Texte d'erreur spécifique")).toBeInTheDocument();
  });

  it("toggles fullscreen mode when the button is clicked", () => {
    render(<LatexEditor text="" onChange={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Toggle Fullscreen" });
    expect(button).toBeInTheDocument();

    // Au départ, on a l'icône Fullscreen (et non Exit)
    expect(screen.getByTestId("FullscreenIcon")).toBeInTheDocument();

    // On clique pour passer en plein écran
    fireEvent.click(button);
    expect(screen.getByTestId("FullscreenExitIcon")).toBeInTheDocument();

    // On clique pour revenir
    fireEvent.click(button);
    expect(screen.getByTestId("FullscreenIcon")).toBeInTheDocument();
  });
});
