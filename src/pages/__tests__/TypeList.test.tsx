import { render, screen, waitFor } from "../../utils/test-utils";
import TypeList from "../TypeList";
import { vi } from "vitest";
import { nodeApi } from "../../services/api";

vi.mock("../../services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/api")>();
  return {
    ...actual,
    nodeApi: {
      ...actual.nodeApi,
      getAllTypeNames: vi.fn(),
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

// Mock react-window
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

describe("TypeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a skeleton/loading state initially", async () => {
    let resolvePromise: (v: unknown) => void;
    // @ts-expect-error mock
    nodeApi.getAllTypeNames.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    render(<TypeList />);
    expect(screen.getByText("entities.types_title")).toBeInTheDocument();

    resolvePromise!([]);
  });

  it("renders empty state", async () => {
    // @ts-expect-error mock
    nodeApi.getAllTypeNames.mockResolvedValue([]);

    render(<TypeList />);

    await waitFor(() => {
      expect(screen.getByText("entities.no_type_found")).toBeInTheDocument();
    });
  });

  it("renders types", async () => {
    const mockTypes = [
      { id: 1, nom: "Théorème" },
      { id: 2, nom: "Définition" },
    ];
    // @ts-expect-error mock
    nodeApi.getAllTypeNames.mockResolvedValue(mockTypes);

    render(<TypeList />);

    await waitFor(() => {
      expect(screen.getAllByText("Théorème").length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText("Définition").length).toBeGreaterThan(0);
  });

  it("handles errors", async () => {
    // @ts-expect-error mock
    nodeApi.getAllTypeNames.mockRejectedValue(new Error("API Error"));

    render(<TypeList />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });
});
