import { render, screen, fireEvent, within } from "../../../utils/test-utils";
import { RelationEdit } from "../RelationEdit";
import { vi } from "vitest";
import { Relations } from "../../../types/ApiTypes/Relations";

const mockRelation: Relations = {
  id: 1,
  type_relation: "utilise",
  description: "Initial description",
  concept_source: { id: 10, nom: "Source Concept" },
  concept_cible: { id: 20, nom: "Target Concept" },
};

describe("RelationEdit", () => {
  it("renders the concepts and initial values correctly", () => {
    render(<RelationEdit relation={mockRelation} onChange={vi.fn()} />);

    expect(screen.getByText("Source Concept")).toBeInTheDocument();
    expect(screen.getByText("Target Concept")).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    expect(select).toHaveTextContent("utilise");

    const descriptionInput = screen.getByDisplayValue("Initial description");
    expect(descriptionInput).toBeInTheDocument();
  });

  it("calls onChange when the relation type is changed", () => {
    const handleChange = vi.fn();
    render(<RelationEdit relation={mockRelation} onChange={handleChange} />);

    const select = screen.getByRole("combobox");

    // Open the select
    fireEvent.mouseDown(select);

    // Click on another option
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("implication"));

    expect(handleChange).toHaveBeenCalledWith({
      ...mockRelation,
      type_relation: "implication",
    });
  });

  it("calls onChange when the description is changed", () => {
    const handleChange = vi.fn();
    render(<RelationEdit relation={mockRelation} onChange={handleChange} />);

    const descriptionInput = screen.getByDisplayValue("Initial description");
    fireEvent.change(descriptionInput, {
      target: { value: "New description" },
    });

    expect(handleChange).toHaveBeenCalledWith({
      ...mockRelation,
      description: "New description",
    });
  });
});
