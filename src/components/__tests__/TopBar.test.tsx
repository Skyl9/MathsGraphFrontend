import { render, screen, fireEvent } from "../../utils/test-utils";
import { TopBar } from "../TopBar";
import { vi } from "vitest";
import Token from "../../services/token";

// Mock token service to control authentication state
vi.mock("../../services/token", () => ({
  default: {
    getUsernameFromToken: vi.fn(),
  },
}));

export const mockChangeLanguage = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: mockChangeLanguage, language: "fr" },
  }),
}));

describe("TopBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly for guest users", () => {
    // @ts-expect-error mock
    Token.getUsernameFromToken.mockReturnValue(null);

    render(<TopBar />);

    expect(screen.getByText("MATHGRAPH")).toBeInTheDocument();

    // Check buttons using a more robust selector
    expect(
      screen.getByRole("link", { name: /app.login/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /app.register/i }),
    ).toBeInTheDocument();

    // Should not show logout
    expect(screen.queryByTestId("logout-btn")).not.toBeInTheDocument();
  });

  it("renders correctly for authenticated users", () => {
    // @ts-expect-error mock
    Token.getUsernameFromToken.mockReturnValue("testuser");

    render(<TopBar />);

    expect(screen.getByText(/app.hello/i)).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.queryByText("app.login")).not.toBeInTheDocument();
    expect(screen.queryByText("app.register")).not.toBeInTheDocument();
  });

  it("toggles language", () => {
    // @ts-expect-error mock
    Token.getUsernameFromToken.mockReturnValue(null);

    render(<TopBar />);

    const langBtn = screen.getByRole("button", { name: /EN/i });
    expect(langBtn).toBeInTheDocument();

    fireEvent.click(langBtn);

    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });
});
