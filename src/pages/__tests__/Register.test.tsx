import { render, screen, waitFor, fireEvent } from "../../utils/test-utils";
import { Register } from "../Register";
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

vi.mock("../../services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/api")>();
  return {
    ...actual,
    nodeApi: {
      ...actual.nodeApi,
      register: vi.fn(),
    },
  };
});

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renders the register form correctly", () => {
    render(<Register />);

    expect(screen.getByText("auth.register_form_title")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.username")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.email")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "auth.register_btn" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty or invalid", async () => {
    render(<Register />);

    const usernameInput = screen.getByLabelText("auth.username");
    const emailInput = screen.getByLabelText("auth.email");
    const passwordInput = screen.getByLabelText("auth.password");

    fireEvent.change(usernameInput, { target: { value: "a" } });
    fireEvent.blur(usernameInput);

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.blur(passwordInput);

    await screen.findByText("auth.username_min_length");
    expect(screen.getByText("auth.email_invalid")).toBeInTheDocument();
    expect(screen.getByText("auth.password_min_length")).toBeInTheDocument();

    // Ensure API was not called
    expect(nodeApi.register).not.toHaveBeenCalled();
  });

  it("submits the form successfully and displays success message", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // @ts-expect-error - mock
    nodeApi.register.mockResolvedValue({ message: "Success" });

    render(<Register />);

    fireEvent.change(screen.getByLabelText("auth.username"), {
      target: { value: "testuser" },
    });
    fireEvent.blur(screen.getByLabelText("auth.username"));

    fireEvent.change(screen.getByLabelText("auth.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.blur(screen.getByLabelText("auth.email"));

    fireEvent.change(screen.getByLabelText("auth.password"), {
      target: { value: "StrongPass123" },
    });
    fireEvent.blur(screen.getByLabelText("auth.password"));

    const submitBtn = screen.getByRole("button", { name: "auth.register_btn" });
    fireEvent.submit(submitBtn.closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(nodeApi.register).toHaveBeenCalledWith(
        "testuser",
        "test@example.com",
        "StrongPass123",
      );
    });

    // Check for success alert
    expect(screen.getByText("auth.register_success")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 4000 },
    );

    vi.useRealTimers();
  });

  it("displays an error message when API call fails", async () => {
    // @ts-expect-error - mock
    nodeApi.register.mockRejectedValue(new Error("Email already in use"));

    render(<Register />);

    fireEvent.change(screen.getByLabelText("auth.username"), {
      target: { value: "testuser" },
    });
    fireEvent.blur(screen.getByLabelText("auth.username"));

    fireEvent.change(screen.getByLabelText("auth.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.blur(screen.getByLabelText("auth.email"));

    fireEvent.change(screen.getByLabelText("auth.password"), {
      target: { value: "StrongPass123" },
    });
    fireEvent.blur(screen.getByLabelText("auth.password"));

    const submitBtn = screen.getByRole("button", { name: "auth.register_btn" });
    fireEvent.submit(submitBtn.closest("form") as HTMLFormElement);

    await screen.findByText("Email already in use");

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
