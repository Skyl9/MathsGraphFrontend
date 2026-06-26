import { render } from "../../utils/test-utils";
import { SEOMeta } from "../SEOMeta";
import { waitFor } from "@testing-library/react";

describe("SEOMeta", () => {
  it("renders the title and description correctly in the document head", async () => {
    render(
      <SEOMeta title="Test Title" description="This is a test description." />,
    );

    await waitFor(() => {
      expect(document.title).toBe("Test Title | MathGraph");

      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      expect(metaDescription).toHaveAttribute(
        "content",
        "This is a test description.",
      );

      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle).toHaveAttribute("content", "Test Title | MathGraph");
    });
  });

  it("renders the canonical URL if provided", async () => {
    render(
      <SEOMeta
        title="Test"
        description="Desc"
        canonicalUrl="https://example.com/test"
      />,
    );

    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeInTheDocument();
      expect(canonical).toHaveAttribute("href", "https://example.com/test");
    });
  });
});
