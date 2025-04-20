import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Scene from "./scene/Scene";
import Menu from "./components/Menu";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import NodePage from "./components/NodePage";
import AdminPanel from "./pages/AdminPanel";
import { createTheme, ThemeProvider } from "@mui/material";

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
            <ThemeProvider theme={theme}>
                {" "}
                {/* Fournit le thème à l'application */}
                <Router>
                    {" "}
                    {/* Active la gestion des routes */}
                    <Routes>
                        <Route path="/" element={<AppContent darkMode={darkMode} setDarkMode={setDarkMode} />} /> {/* Passe le state et le setter au composant */}
                        <Route path="/node/:id" element={<NodePage />} />
                        <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                </Router>
            </ThemeProvider>
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