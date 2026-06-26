import { render, screen } from "../../../utils/test-utils";
import { EntityGlassCard } from "../EntityGlassCard";
import CodeIcon from "@mui/icons-material/Code";

describe("EntityGlassCard", () => {
  it("renders correctly with given props", () => {
    render(
      <EntityGlassCard
        title="Test Title"
        icon={<CodeIcon data-testid="test-icon" />}
        actionTo="/test-action"
        actionText="Click Me"
      />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();

    const button = screen.getByRole("link", { name: /Click Me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/test-action");
  });

  it("renders children when provided", () => {
    render(
      <EntityGlassCard
        title="Title"
        icon={<CodeIcon />}
        actionTo="/"
        actionText="Action"
      >
        <div data-testid="child-element">Child content</div>
      </EntityGlassCard>,
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
