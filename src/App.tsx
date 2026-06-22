import { useMemo, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Scene from "./scene/Scene";
import Menu from "./components/Menu";
import NodeDetails from "./components/NodeDetails";
import { GraphHUD } from "./components/GraphHUD";
import { AnimatePresence } from "framer-motion";
import { useGraphStore } from "./stores/useGraphStore";
const ConceptPage = lazy(() => import("./pages/NodePage"));
const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const SupportPage = lazy(() =>
  import("./pages/SupportPage").then((m) => ({ default: m.SupportPage })),
);
const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const LostPage = lazy(() =>
  import("./pages/LostPage").then((m) => ({ default: m.LostPage })),
);
const Login = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
  import("./pages/Register").then((m) => ({ default: m.Register })),
);
const MathematicienPage = lazy(() => import("./pages/MathematicienPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const TypePage = lazy(() => import("./pages/TypePage"));
const CategoryList = lazy(() => import("./pages/CategoryList"));
const MathematicienList = lazy(() => import("./pages/MathematicienList"));
const TypeList = lazy(() => import("./pages/TypeList"));
const ConceptList = lazy(() => import("./pages/ConceptList"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const PasswordResetVerification = lazy(
  () => import("./pages/PasswordResetVerification"),
);
const UserRedirect = lazy(() => import("./Redirection/UserRedirect"));
const CategoryRedirect = lazy(() =>
  import("./Redirection/CategoryRedirect").then((m) => ({
    default: m.CategoryRedirect,
  })),
);
const TypeRedirect = lazy(() =>
  import("./Redirection/TypeRedirect").then((m) => ({
    default: m.TypeRedirect,
  })),
);
const MathematicienRedirect = lazy(() =>
  import("./Redirection/MathematicienRedirect").then((m) => ({
    default: m.MathematicienRedirect,
  })),
);
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const ContentsPage = lazy(() => import("./pages/admin/ContentsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsManagement"));
const ContributionPage = lazy(() => import("./pages/ContributionPage"));
const RecentChangesPage = lazy(() =>
  import("./pages/RecentChangesPage").then((m) => ({
    default: m.RecentChangesPage,
  })),
);
const SearchPage = lazy(() =>
  import("./pages/SearchPage.tsx").then((m) => ({ default: m.SearchPage })),
);
const NewContentPage = lazy(() => import("./pages/admin/NewContentPage.tsx"));
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./contexts/Authprovider";
import { getTheme } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { useGraphData } from "./hooks/useGraphData";
import { useUrlSync } from "./hooks/useUrlSync";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";

import { Box, Alert, useTheme } from "@mui/material";
import ErrorBoundary from "./ErrorBoundary";
import { GraphSkeleton } from "./components/GraphSkeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUIStore } from "./stores/useUIStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MainLayout } from "./components/MainLayout";

// QueryClient instancié UNE SEULE FOIS en dehors du composant
// pour éviter de perdre le cache React Query à chaque re-render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Les données restent en cache pendant 5 minutes
      refetchOnWindowFocus: false, // Évite de recharger si l'utilisateur change d'onglet
      retry: (failureCount, error: unknown) => {
        // Ne pas retenter si c'est une erreur 404
        const err = error as {
          status?: number;
          response?: { status?: number };
        };
        if (err && (err.status === 404 || err.response?.status === 404)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const GlobalGraph = () => {
  const location = useLocation();
  const isGraph = location.pathname === "/graph";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        opacity: isGraph ? 1 : 0,
        visibility: isGraph ? "visible" : "hidden",
        pointerEvents: isGraph ? "auto" : "none",
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      <AppContent />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor="transparent"
        >
          <GraphSkeleton />
        </Box>
      }
    >
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/graph" element={<></>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="contents" element={<ContentsPage />} />
          <Route path="contents/new" element={<NewContentPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recent-changes" element={<RecentChangesPage />} />
          <Route path="/concept/:id" element={<ConceptPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/mathematicien/:id" element={<MathematicienPage />} />
          <Route path={"/category/:id"} element={<CategoryPage />} />
          <Route path={"/type/:id"} element={<TypePage />} />
          <Route path={"/category"} element={<CategoryList />} />
          <Route path={"/type"} element={<TypeList />} />
          <Route path={"/mathematicien"} element={<MathematicienList />} />
          <Route path={"/concept"} element={<ConceptList />} />
          <Route path={"/user/:id"} element={<UserProfilePage />} />
          <Route path={"/reset-password"} element={<PasswordReset />} />
          <Route
            path={"/reset-password-verification/:token"}
            element={<PasswordResetVerification />}
          />
          <Route path={"/username/:username"} element={<UserRedirect />} />
          <Route
            path={"/category/redirect/:categoryName"}
            element={<CategoryRedirect />}
          />
          <Route path={"/type/redirect/:typeName"} element={<TypeRedirect />} />
          <Route
            path={"/mathematicien/redirect/:mathematicienName"}
            element={<MathematicienRedirect />}
          />
          <Route path={"/contribution"} element={<ContributionPage />} />
          <Route path={"/search"} element={<SearchPage />} />
          <Route path="*" element={<LostPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

const App = () => {
  const darkMode = useUIStore((state) => state.darkMode);

  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme={darkMode ? "dark" : "light"}
          />
          <ErrorBoundary>
            <Router>
              <GlobalGraph />
              <div style={{ position: "relative", zIndex: 1 }}>
                <AnimatedRoutes />
              </div>
            </Router>
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isGraphRoute = location.pathname === "/graph";

  // Synchronisation de l'URL avec les stores
  useUrlSync();
  // Gestion globale des raccourcis clavier
  useGlobalShortcuts();

  const { loading, error, graphData } = useGraphData();
  const darkMode = useUIStore((s) => s.darkMode);
  const graphTheme = useUIStore((s) => s.graphTheme);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const isSearchActive = useGraphStore((s) => s.isSearchActive);

  const theme = useTheme();

  const getBackground = () => {
    if (graphTheme === "neon") {
      return theme.gradients.background.neon;
    }
    return theme.gradients.background.default;
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          background: getBackground(),
        }}
      >
        <GraphSkeleton />
      </div>
    );
  }
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">
          Erreur lors du chargement du graphe : {error}
        </Alert>
      </Box>
    );
  }
  if (!graphData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="info">Graphique non disponible ou introuvable.</Alert>
      </Box>
    );
  }

  console.log(
    "GraphData reçu par AppContent (avant de passer à Scene/Menu):",
    graphData,
  );

  const handleCloseNodeDetails = () => {
    setSelectedNodeId(null);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: getBackground(),
        transition: "background 0.3s ease",
      }}
      className={darkMode ? "dark-mode" : ""}
    >
      <Canvas
        frameloop={isGraphRoute ? "always" : "demand"}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene graphData={graphData} />
      </Canvas>

      {isGraphRoute && (
        <>
          <Menu graphData={graphData} />
          <GraphHUD graphData={graphData} />

          <AnimatePresence>
            {selectedNodeId !== null && !isSearchActive && (
              <NodeDetails
                id={selectedNodeId}
                onClose={handleCloseNodeDetails}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default App;
