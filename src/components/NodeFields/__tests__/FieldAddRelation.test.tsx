import { render, screen, fireEvent, waitFor } from "../../../utils/test-utils";
import FieldAddRelation from "../FieldAddRelation";
import { vi } from "vitest";
import { nodeApi } from "../../../services/api";

vi.mock("../../../services/api", () => ({
  nodeApi: {
    getAllConceptNames: vi.fn(),
  },
}));

describe("FieldAddRelation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for all tests to prevent undefined .map() errors
    // @ts-expect-error - mock
    nodeApi.getAllConceptNames.mockResolvedValue([]);
  });

  it("renders the 'Ajouter une Relation' button initially", () => {
    render(
      <FieldAddRelation
        nodeName="Théorème A"
        createField={vi.fn()}
        id={1}
        value={[]}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Ajouter une Relation" }),
    ).toBeInTheDocument();
  });

  it("fetches concepts on mount and allows adding a relation", async () => {
    const mockConcepts = [
      { id: 10, nom: "Théorème B" },
      { id: 11, nom: "Lemme C" },
    ];
    // @ts-expect-error - mock
    nodeApi.getAllConceptNames.mockResolvedValue(mockConcepts);

    const mockCreateField = vi.fn();

    render(
      <FieldAddRelation
        nodeName="Théorème A"
        createField={mockCreateField}
        id={1}
        value={[]}
      />,
    );

    // 1. Click on "Ajouter une Relation"
    const addButton = screen.getByRole("button", {
      name: "Ajouter une Relation",
    });
    fireEvent.click(addButton);

    // 2. Form is displayed
    expect(screen.getByText("Théorème A")).toBeInTheDocument();

    // Check if fetch was called
    expect(nodeApi.getAllConceptNames).toHaveBeenCalled();

    // 3. Select a relation type
    // In MUI, Select is a combobox but Autocomplete is also one.
    // The Select doesn't have an aria-label, but its content is "Relation" before selection.
    const comboboxes = screen.getAllByRole("combobox");
    // Usually the Select is the first one, Autocomplete is the second.
    const selectButton = comboboxes[0];
    fireEvent.mouseDown(selectButton); // Opens the dropdown

    // Select "implique"
    const optionImplique = await screen.findByRole("option", {
      name: "implique",
    });
    fireEvent.click(optionImplique);

    // 4. Autocomplete the target theorem
    const autocompleteInput = screen.getByLabelText(
      "relation.fields.target_node",
    );
    fireEvent.change(autocompleteInput, { target: { value: "Théorème" } });

    const autocompleteOption = await screen.findByRole("option", {
      name: "Théorème B",
    });
    fireEvent.click(autocompleteOption);

    // 5. Add description
    const descInput = screen.getByLabelText("relation.fields.description");
    fireEvent.change(descInput, {
      target: { value: "Ceci est une description" },
    });

    // 6. Submit
    const validateButton = screen.getByRole("button", { name: "Valider" });
    expect(validateButton).not.toBeDisabled();
    fireEvent.click(validateButton);

    // 7. Verify createField was called with correct data
    await waitFor(() => {
      expect(mockCreateField).toHaveBeenCalledWith("relations", {
        théo1: "Théorème A",
        théo2: "Théorème B",
        relation: "implique",
        desc: "Ceci est une description",
      });
    });
  });

  it("can cancel the form", () => {
    render(
      <FieldAddRelation
        nodeName="Node A"
        createField={vi.fn()}
        id={1}
        value={[]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Ajouter une Relation" }),
    );

    const cancelButton = screen.getByRole("button", { name: "Annuler" });
    fireEvent.click(cancelButton);

    expect(
      screen.getByRole("button", { name: "Ajouter une Relation" }),
    ).toBeInTheDocument();
  });
});
