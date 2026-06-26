import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "../../utils/test-utils";
import { GlobalSearchBar } from "../GlobalSearchBar";
import { vi } from "vitest";
import { nodeApi } from "../../services/api";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../services/api", () => ({
  nodeApi: {
    quickSearch: vi.fn(),
  },
}));

describe("GlobalSearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders correctly", () => {
    render(<GlobalSearchBar />);
    expect(
      screen.getByPlaceholderText("search.placeholder"),
    ).toBeInTheDocument();
  });

  it("calls nodeApi.quickSearch and displays results after typing", async () => {
    const mockResults = [
      { id: 1, nom: "Test Concept", entity_type: "concept" },
      { id: 2, nom: "Test Math", entity_type: "mathematicien" },
    ];
    // @ts-expect-error mock
    nodeApi.quickSearch.mockResolvedValue(mockResults);

    render(<GlobalSearchBar />);

    const input = screen.getByPlaceholderText("search.placeholder");
    fireEvent.change(input, { target: { value: "tes" } });

    // Should call quickSearch after 300ms debounce
    await waitFor(
      () => {
        expect(nodeApi.quickSearch).toHaveBeenCalledWith("tes");
      },
      { timeout: 1000 },
    );

    // Should display the options
    expect(await screen.findByText("Test Concept")).toBeInTheDocument();
    expect(await screen.findByText("Test Math")).toBeInTheDocument();
  });

  it("navigates to /search on Enter key", async () => {
    render(<GlobalSearchBar />);

    const input = screen.getByPlaceholderText("search.placeholder");
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockNavigate).toHaveBeenCalledWith("/search?q=hello");
  });

  it("does not call API if input is less than 2 characters", async () => {
    render(<GlobalSearchBar />);

    const input = screen.getByPlaceholderText("search.placeholder");
    fireEvent.change(input, { target: { value: "a" } });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(nodeApi.quickSearch).not.toHaveBeenCalled();
  });
});
