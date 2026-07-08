import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserProfilePage from "../UserProfilePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mocks
const mockGetUserInfo = vi.fn();
const mockPatchUser = vi.fn();

vi.mock("../../services/api", () => ({
  nodeApi: {
    getUserInfo: (...args: unknown[]) => mockGetUserInfo(...args),
    patchUser: (...args: unknown[]) => mockPatchUser(...args),
  },
}));

vi.mock("../../services/token", () => ({
  default: {
    getUserInfo: () => ({ sub: "testuser" }),
  },
}));

vi.mock("../../components/Skeletons", () => ({
  ProfileSkeleton: () => <div data-testid="profile-skeleton" />,
}));

vi.mock("../../components/AvatarEditModal", () => ({
  AvatarEditModal: () => <div data-testid="avatar-edit-modal" />,
}));

vi.mock("../../components/FavoriteList", () => ({
  default: () => <div data-testid="favorite-list" />,
}));

vi.mock("../../components/UserContributions.tsx", () => ({
  default: () => <div data-testid="user-contributions" />,
}));

vi.mock("../../components/Profile/DraftsPanel", () => ({
  DraftsPanel: () => <div data-testid="drafts-panel" />,
}));

vi.mock("../../components/Issue", () => ({
  ReportIssueButton: () => <div data-testid="report-issue" />,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
const theme = createTheme();

const renderComponent = (userId = "123") => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[`/user/${userId}`]}>
          <Routes>
            <Route path="/user/:id" element={<UserProfilePage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("UserProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("doit afficher le skeleton pendant le chargement", () => {
    // Simuler un chargement infini
    mockGetUserInfo.mockReturnValue(new Promise(() => {}));

    renderComponent();
    expect(screen.getByTestId("profile-skeleton")).toBeInTheDocument();
  });

  it("doit afficher les informations de l'utilisateur après chargement", async () => {
    mockGetUserInfo.mockResolvedValue({
      id: "123",
      username: "testuser",
      email: "test@example.com",
      preferred_language: "fr",
      bio: "Hello world",
      avatar_url: null,
    });

    renderComponent();

    await waitFor(() => {
      // Les infos de base s'affichent
      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    // Puisque le token mocké renvoie "testuser", nous sommes sur notre propre profil
    expect(screen.getByText("Bac à Sable LaTeX")).toBeInTheDocument();
    expect(screen.getByText("Mes Brouillons")).toBeInTheDocument();
  });

  it("ne doit pas afficher le bac à sable ni les brouillons sur le profil d'un autre utilisateur", async () => {
    mockGetUserInfo.mockResolvedValue({
      id: "456",
      username: "otheruser", // Différent de "testuser" du token
      email: "other@example.com",
      preferred_language: "en",
      bio: "Another user",
    });

    renderComponent("456");

    await waitFor(() => {
      expect(screen.getByText("otheruser")).toBeInTheDocument();
    });

    // Les sections privées ne doivent pas être rendues
    expect(screen.queryByText("Bac à Sable LaTeX")).not.toBeInTheDocument();
    expect(screen.queryByText("Mes Brouillons")).not.toBeInTheDocument();
  });
});
