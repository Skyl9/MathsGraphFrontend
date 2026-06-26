import { render, screen } from "../../../utils/test-utils";
import { EntityListLayout } from "../EntityListLayout";
import { vi } from "vitest";

// Mock SEOMeta since it modifies document head
vi.mock("../../SEOMeta", () => ({
  SEOMeta: () => <div data-testid="mock-seo-meta" />,
}));

// Mock Skeletons
vi.mock("../../Skeletons", () => ({
  ListSkeleton: () => <div data-testid="mock-list-skeleton" />,
}));

// Mock ReportIssueButton
vi.mock("../../Issue", () => ({
  ReportIssueButton: () => <div data-testid="mock-issue-button" />,
}));

const defaultProps = {
  title: "List Title",
  seoTitle: "SEO Title",
  seoDescription: "SEO Desc",
  loading: false,
  error: null,
  errorMessage: "Error fallback",
  isEmpty: false,
  emptyMessage: "List is empty",
  seoFallback: <div data-testid="mock-seo-fallback">SEO Fallback</div>,
};

describe("EntityListLayout", () => {
  it("renders loading state", () => {
    render(
      <EntityListLayout {...defaultProps} loading={true}>
        <div>Children</div>
      </EntityListLayout>,
    );
    expect(screen.getByTestId("mock-list-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("Children")).not.toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <EntityListLayout {...defaultProps} error={new Error("Test Error")}>
        <div>Children</div>
      </EntityListLayout>,
    );
    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.queryByText("Children")).not.toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <EntityListLayout {...defaultProps} isEmpty={true}>
        <div>Children</div>
      </EntityListLayout>,
    );
    expect(screen.getByText("List is empty")).toBeInTheDocument();
    expect(screen.queryByText("Children")).not.toBeInTheDocument();
  });

  it("renders children and seo fallback when loaded and not empty", () => {
    render(
      <EntityListLayout {...defaultProps}>
        <div data-testid="test-children">List Children</div>
      </EntityListLayout>,
    );

    expect(screen.getByText("List Title")).toBeInTheDocument();
    expect(screen.getByTestId("mock-seo-meta")).toBeInTheDocument();
    expect(screen.getByTestId("mock-issue-button")).toBeInTheDocument();
    expect(screen.getByTestId("test-children")).toBeInTheDocument();
    expect(screen.getByTestId("mock-seo-fallback")).toBeInTheDocument();
  });
});
