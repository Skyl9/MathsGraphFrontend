import { useMemo } from "react";
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
import ConceptPage from "./pages/NodePage";
import { ThemeProvider } from "@mui/material";
import { AboutPage } from "./pages/AboutPage";
import { SupportPage } from "./pages/SupportPage";
import { HomePage } from "./pages/HomePage";
import { LostPage } from "./pages/LostPage";
import { AuthProvider } from "./contexts/Authprovider";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import MathematicienPage from "./pages/MathematicienPage";
import CategoryPage from "./pages/CategoryPage";
import TypePage from "./pages/TypePage";
import CategoryList from "./pages/CategoryList";
import MathematicienList from "./pages/MathematicienList";
import TypeList from "./pages/TypeList";
import ConceptList from "./pages/ConceptList";
import UserProfilePage from "./pages/UserProfilePage";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetVerification from "./pages/PasswordResetVerification";
import UserRedirect from "./Redirection/UserRedirect";
import { CategoryRedirect } from "./Redirection/CategoryRedirect";
import { TypeRedirect } from "./Redirection/TypeRedirect";
import { MathematicienRedirect } from "./Redirection/MathematicienRedirect";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import ContentsPage from "./pages/admin/ContentsPage";
import SettingsPage from "./pages/SettingsManagement";
import ContributionPage from "./pages/ContributionPage";
import { RecentChangesPage } from "./pages/RecentChangesPage";
import { getTheme } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { useGraphData } from "./hooks/useGraphData";
import { useUrlSync } from "./hooks/useUrlSync";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";

import { Box, Alert } from "@mui/material";
import ErrorBoundary from "./ErrorBoundary";
import { GraphSkeleton } from "./components/GraphSkeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchPage } from "./pages/SearchPage.tsx";
import { useUIStore } from "./stores/useUIStore";
import NewContentPage from "./pages/admin/NewContentPage.tsx";
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
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        opacity: isGraph ? 1 : 0,
        pointerEvents: isGraph ? "auto" : "none",
        transition: "opacity 0.4s ease-in-out",
      }}
    >
      <AppContent />
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
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
    </>
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

  const getBackground = () => {
    if (graphTheme === "neon") {
      return "radial-gradient(circle at center, #0B0B1E 0%, #03030A 100%)";
    }
    return darkMode
      ? "radial-gradient(circle at center, #0F172A 0%, #020617 100%)"
      : "radial-gradient(circle at center, #F8FAFC 0%, #E2E8F0 100%)";
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
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
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: getBackground(),
        transition: "background 0.3s ease",
      }}
      className={darkMode ? "dark-mode" : ""}
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene graphData={graphData} />
      </Canvas>
      <Menu graphData={graphData} />
      <GraphHUD graphData={graphData} />

      <AnimatePresence>
        {selectedNodeId !== null && !isSearchActive && (
          <NodeDetails id={selectedNodeId} onClose={handleCloseNodeDetails} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
