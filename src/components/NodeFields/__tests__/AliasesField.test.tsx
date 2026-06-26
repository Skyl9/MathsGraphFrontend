import { render, screen } from "../../../utils/test-utils";
import AliasesField from "../AliasesField";

describe("AliasesField", () => {
  it("renders a list of aliases when provided", () => {
    const aliases = ["Alias 1", "Alias 2"];
    render(<AliasesField aliases={aliases} />);

    expect(screen.getByText("alias.title :")).toBeInTheDocument();
    expect(screen.getByText("Alias 1")).toBeInTheDocument();
    expect(screen.getByText("Alias 2")).toBeInTheDocument();
  });

  it("renders a placeholder when aliases array is empty", () => {
    render(<AliasesField aliases={[]} />);

    expect(screen.getByText("alias.title :")).toBeInTheDocument();
    expect(screen.getByText("alias.placeholder")).toBeInTheDocument();
  });
});
