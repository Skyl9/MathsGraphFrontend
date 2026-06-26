import { render, screen, waitFor, fireEvent } from "../../utils/test-utils";
import { Login } from "../Login";
import { vi } from "vitest";
import { nodeApi } from "../../services/api";
import Token from "../../services/token";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/api")>();
  return {
    ...actual,
    nodeApi: {
      ...actual.nodeApi,
      getToken: vi.fn(),
    },
  };
});

vi.mock("../../services/token", () => ({
  default: {
    decodeToken: vi.fn(),
    saveUserInfo: vi.fn(),
    getUsernameFromToken: vi.fn(),
  },
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form correctly", () => {
    render(<Login />);

    expect(screen.getByText("auth.login_title")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.username")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "auth.login_btn" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<Login />);

    const submitBtn = screen.getByRole("button", { name: "auth.login_btn" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("auth.username_req")).toBeInTheDocument();
      expect(screen.getByText("auth.password_req")).toBeInTheDocument();
    });

    // Ensure API was not called
    expect(nodeApi.getToken).not.toHaveBeenCalled();
  });

  it("submits the form successfully and redirects", async () => {
    const mockTokenResponse = { access_token: "fake-jwt-token" };
    const mockDecodedToken = { sub: "testuser", role: "admin" };

    // @ts-expect-error - mock
    nodeApi.getToken.mockResolvedValue(mockTokenResponse);
    // @ts-expect-error - mock
    Token.decodeToken.mockReturnValue(mockDecodedToken);

    render(<Login />);

    fireEvent.change(screen.getByLabelText("auth.username"), {
      target: { value: "myusername" },
    });
    fireEvent.blur(screen.getByLabelText("auth.username"));

    fireEvent.change(screen.getByLabelText("auth.password"), {
      target: { value: "mypassword" },
    });
    fireEvent.blur(screen.getByLabelText("auth.password"));

    const submitBtn = screen.getByRole("button", { name: "auth.login_btn" });
    fireEvent.submit(submitBtn.closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(nodeApi.getToken).toHaveBeenCalled();
    });

    // Check that formData is passed correctly
    // @ts-expect-error - mock
    const callArgs = nodeApi.getToken.mock.calls[0][0] as URLSearchParams;
    expect(callArgs.get("username")).toBe("myusername");
    expect(callArgs.get("password")).toBe("mypassword");

    expect(Token.decodeToken).toHaveBeenCalledWith("fake-jwt-token");
    expect(Token.saveUserInfo).toHaveBeenCalledWith(mockDecodedToken);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("displays an error message when API call fails", async () => {
    // @ts-expect-error - mock
    nodeApi.getToken.mockRejectedValue(new Error("Invalid credentials"));

    render(<Login />);

    fireEvent.change(screen.getByLabelText("auth.username"), {
      target: { value: "wronguser" },
    });
    fireEvent.blur(screen.getByLabelText("auth.username"));

    fireEvent.change(screen.getByLabelText("auth.password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.blur(screen.getByLabelText("auth.password"));

    const submitBtn = screen.getByRole("button", { name: "auth.login_btn" });
    fireEvent.submit(submitBtn.closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(Token.saveUserInfo).not.toHaveBeenCalled();
  });
});
