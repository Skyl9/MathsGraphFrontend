import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Scene from "./scene/Scene";
import Menu from "./components/Menu";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import NodePage from "./pages/NodePage";
import AdminPanel from "./pages/AdminPanel";
import { createTheme, ThemeProvider } from "@mui/material";
import {AboutPage} from "./AboutPage";
import {SupportPage} from "./SupportPage";
import {HomePage} from "./HomePage";
import { LostPage } from "./LostPage";
import {AuthProvider} from "./contexts/Authprovider";
import {Login } from "./Login";
import {Register} from "./Register";
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


// TODO  Mettre en place page de description: 1. Type 2. Mathématicien 3. Sources

// TODO Mettre en place page de l'ensemble 1. Liste des noeuds 2. Liste des théorèmes/axiomes/lemmes (possiblement avec un filtre de 1.) 3. Liste des relations 4. Liste des sources 5. Liste des mathématiciens 6. Liste des catégories 7. Liste des types

// TODO Finaliser l'arborescence des pages et mettre en place un /graph + id du noeud pour afficher le graphique de ce noeud directement
// Fonction pour créer le thème en fonction du mode sombre
const getTheme = (darkMode: boolean) =>
    createTheme({
        palette: {
            mode: darkMode ? "dark" : "light", // Définir le mode de couleur
            primary: {
                main: darkMode ? "#90caf9" : "#1976d2", // Ajuster les couleurs primaires
            },
            secondary: {
                main: darkMode ? "#f48fb1" : "#9c27b0", // Ajuster les couleurs secondaires
            },
        },
        typography: {
            fontFamily: "Roboto, sans-serif",
        },
    });

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false); // État pour gérer le mode sombre
    const theme = useMemo(() => getTheme(darkMode), [darkMode]); // Créer le thème en fonction de l'état

    return (
        <AppProvider>
            <AuthProvider>
            <ThemeProvider theme={theme}>
                {" "}
                {/* Fournit le thème à l'application */}
                <Router>
                    {" "}
                    {/* Active la gestion des routes */}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<HomePage/>} /> {/* Passe le state et le setter au composant */}
                        <Route path="/graph" element={<AppContent darkMode={darkMode} setDarkMode={setDarkMode} />} />
                        <Route path="/node/:id" element={<NodePage />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/mathematicien/:id" element={<MathematicienPage />}/>
                        <Route path="*" element={<LostPage/>} />
                        <Route path={"/category/:id"} element={<CategoryPage />} />
                        <Route path={"/type/:id"} element={<TypePage />} />
                        <Route path={"/category"} element={<CategoryList />} />
                        <Route path={"/type"} element={<TypeList />} />
                        <Route path={"/mathematicien"} element={<MathematicienList />} />
                        <Route path={"/concept"} element={<ConceptList />} />
                        <Route path={"/user/:id"} element={<UserProfilePage />} />
                        <Route path={"/reset-password"} element={<PasswordReset/>}/>
                        <Route path={"/reset-password-verification/:token"} element={<PasswordResetVerification/>}/>
                        <Route path={"/username/:username"} element={<UserRedirect />}/>
                    </Routes>
                </Router>
            </ThemeProvider>
            </AuthProvider>
        </AppProvider>
    );
};

// ✅ Récupération des données du graphe avant affichage
const AppContent: React.FC<{ darkMode: boolean; setDarkMode: (value: boolean) => void }> = ({ darkMode, setDarkMode }) => {
    const { loading, error, graphData } = useAppContext();

    if (loading) return <div>Chargement des données du graphe en cours...</div>;
    if (error) return <div style={{ color: "red" }}>Erreur : {error}</div>;
    if (!graphData) return <div>Graphique non disponible ou introuvable.</div>;

    return (
        <div style={{ width: "100vw", height: "100vh" }} className={darkMode ? "dark-mode" : ""}>
            {" "}
            {/* Applique la classe CSS pour le mode sombre */}
            <Canvas style={{ background: darkMode ? "#222" : "lightgrey" }}>
                {" "}
                {/* Ajuster la couleur de fond du Canvas */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Scene />
            </Canvas>
            <Menu darkMode={darkMode} setDarkMode={setDarkMode} />{" "}
            {/* Passe le state et le setter au composant Menu */}
        </div>
    );
};

export default App;