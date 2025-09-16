import React, {useState, useMemo, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Canvas} from "@react-three/fiber";
import Scene from "./scene/Scene";
import Menu from "./components/Menu";
import {AppProvider, useAppContext} from "./contexts/AppContext";
import ConceptPage from "./pages/NodePage";
import {ThemeProvider} from "@mui/material";
import {AboutPage} from "./pages/AboutPage";
import {SupportPage} from "./pages/SupportPage";
import {HomePage} from "./pages/HomePage";
import {LostPage} from "./pages/LostPage";
import {AuthProvider} from "./contexts/Authprovider";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register";
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
import {CategoryRedirect} from "./Redirection/CategoryRedirect";
import {TypeRedirect} from "./Redirection/TypeRedirect";
import {MathematicienRedirect} from "./Redirection/MathematicienRedirect";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import ContentsPage from "./pages/admin/ContentsPage";
import SettingsPage from "./pages/SettingsManagement";
import ContributionPage from "./pages/ContributionPage";
import {getTheme} from "./theme";
import CssBaseline from '@mui/material/CssBaseline';
import { useGraphData } from "./hooks/useGraphData";

import { CircularProgress, Box, Alert, Snackbar } from '@mui/material';
import ErrorBoundary from "./ErrorBoundary";


const App: React.FC = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : prefersDark;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    const theme = useMemo(() => getTheme(darkMode), [darkMode]);

    return (
        <AppProvider>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <ErrorBoundary>
                    {" "}
                    <Router>
                        {" "}
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/graph" element={<AppContent darkMode={darkMode} setDarkMode={setDarkMode}/>}/>
                            <Route path="/concept/:id" element={<ConceptPage/>}/>
                            <Route path="/admin" element={<AdminLayout/>}>
                                <Route index element={<DashboardPage/>}/>
                                <Route path="users" element={<UsersPage/>}/>
                                <Route path="contents" element={<ContentsPage/>}/>
                                <Route path="settings" element={<SettingsPage/>}/>
                            </Route>


                            <Route path="/about" element={<AboutPage/>}/>
                            <Route path="/support" element={<SupportPage/>}/>
                            <Route path="/mathematicien/:id" element={<MathematicienPage/>}/>
                            <Route path="*" element={<LostPage/>}/>
                            <Route path={"/category/:id"} element={<CategoryPage/>}/>
                            <Route path={"/type/:id"} element={<TypePage/>}/>
                            <Route path={"/category"} element={<CategoryList/>}/>
                            <Route path={"/type"} element={<TypeList/>}/>
                            <Route path={"/mathematicien"} element={<MathematicienList/>}/>
                            <Route path={"/concept"} element={<ConceptList/>}/>
                            <Route path={"/user/:id"} element={<UserProfilePage/>}/>
                            <Route path={"/reset-password"} element={<PasswordReset/>}/>
                            <Route path={"/reset-password-verification/:token"}
                                   element={<PasswordResetVerification/>}/>
                            <Route path={"/username/:username"} element={<UserRedirect/>}/>
                            <Route path={"/category/redirect/:categoryName"} element={<CategoryRedirect/>}/>
                            <Route path={"/type/redirect/:typeName"} element={<TypeRedirect/>}/>
                            <Route path={"/mathematicien/redirect/:mathematicienName"}
                                   element={<MathematicienRedirect/>}/>
                            <Route path={"/contribution"} element={<ContributionPage/>}/>

                        </Routes>
                    </Router>
                    </ErrorBoundary>
                </ThemeProvider >
            </AuthProvider>
        </AppProvider>
    );
};

const AppContent: React.FC<{ darkMode: boolean; setDarkMode: (value: boolean) => void }> = ({
                                                                                                darkMode, setDarkMode
                                                                                            }) => {
    const {loading, error, graphData} = useGraphData();

    const { /* supprimez graphData, loading, error d'ici */ ...appContextValues } = useAppContext();


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Box ml={2}>Chargement des données du graphe en cours...</Box>
            </Box>
        );
    }
    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="error">
                    Erreur lors du chargement du graphe : {error}
                </Alert>
            </Box>
        );
    }
    if (!graphData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="info">Graphique non disponible ou introuvable.</Alert>
            </Box>
        );
    }

    console.log("GraphData reçu par AppContent (avant de passer à Scene/Menu):", graphData);

    return (
        <div style={{width: "100vw", height: "100vh"}} className={darkMode ? "dark-mode" : ""}>
            {" "}
            <Canvas style={{background: darkMode ? "#222" : "lightgrey"}}>
                {" "}
                <ambientLight intensity={0.5}/>
                <pointLight position={[10, 10, 10]}/>
                <Scene graphData={graphData} />
            </Canvas>
            <Menu darkMode={darkMode} setDarkMode={setDarkMode} graphData={graphData} />{" "}
        </div>
    );
};

export default App;