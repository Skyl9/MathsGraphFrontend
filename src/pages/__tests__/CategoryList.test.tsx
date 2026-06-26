import { render, screen, waitFor } from "../../utils/test-utils";
import CategoryList from "../CategoryList";
import { vi } from "vitest";
import { nodeApi } from "../../services/api";

vi.mock("../../services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/api")>();
  return {
    ...actual,
    nodeApi: {
      ...actual.nodeApi,
      getAllCategories: vi.fn(),
    },
  };
});

// Mock framer-motion to avoid animation delays
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      div: ({
        children,
        ...props
      }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <div {...props}>{children}</div>
      ),
      main: ({
        children,
        ...props
      }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <main {...props}>{children}</main>
      ),
      section: ({
        children,
        ...props
      }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <section {...props}>{children}</section>
      ),
      article: ({
        children,
        ...props
      }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <article {...props}>{children}</article>
      ),
    },
  };
});

// Mock react-window because it virtualization requires layout which jsdom doesn't provide natively
vi.mock("react-window", () => ({
  FixedSizeList: ({
    children,
    itemCount,
  }: {
    children: (props: {
      index: number;
      style: React.CSSProperties;
    }) => React.ReactNode;
    itemCount: number;
  }) => {
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      items.push(<div key={i}>{children({ index: i, style: {} })}</div>);
    }
    return <div>{items}</div>;
  },
}));

describe("CategoryList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a skeleton/loading state initially", async () => {
    let resolvePromise: (v: unknown) => void;
    // @ts-expect-error mock
    nodeApi.getAllCategories.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    render(<CategoryList />);
    expect(screen.getByText("entities.categories_title")).toBeInTheDocument();

    resolvePromise!([]);
  });

  it("renders empty state", async () => {
    // @ts-expect-error mock
    nodeApi.getAllCategories.mockResolvedValue([]);

    render(<CategoryList />);

    await waitFor(() => {
      expect(
        screen.getByText("entities.no_category_found"),
      ).toBeInTheDocument();
    });
  });

  it("renders categories in a tree and shows chips for children", async () => {
    const mockCategories = [
      {
        id: 1,
        nom: "Maths Pures",
        description: "Desc Maths Pures",
        parent_id: null,
      },
      { id: 2, nom: "Algèbre", description: "", parent_id: 1 },
      { id: 3, nom: "Maths Appliquées", description: "", parent_id: null },
    ];
    // @ts-expect-error mock
    nodeApi.getAllCategories.mockResolvedValue(mockCategories);

    render(<CategoryList />);

    await waitFor(() => {
      expect(screen.getAllByText("Maths Pures").length).toBeGreaterThan(0);
    });

    // Check parent
    expect(screen.getAllByText("Desc Maths Pures").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Maths Appliquées").length).toBeGreaterThan(0);

    // Check child (should be rendered inside the chip/link)
    const childLinks = screen.getAllByText("Algèbre");
    const childLink = childLinks.find(
      (el) => el.closest("a")?.getAttribute("href") === "/category/2",
    );
    expect(childLink).toBeDefined();
  });

  it("handles errors", async () => {
    // @ts-expect-error mock
    nodeApi.getAllCategories.mockRejectedValue(new Error("API Error"));

    render(<CategoryList />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });
});
