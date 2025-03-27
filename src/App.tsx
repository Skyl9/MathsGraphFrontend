import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Menu from "./components/Menu";
import { AppProvider, useAppContext } from "./AppContext";
import NodePage from "./components/NodePage";
import AdminPanel from "./components/AdminPanel";

const App: React.FC = () => {
    return (
        <AppProvider> {/* Fournit le contexte global */}
            <Router> {/* Active la gestion des routes */}
                <Routes>
                    <Route path="/" element={<AppContent />} />
                    <Route path="/node/:id" element={<NodePage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
            </Router>
        </AppProvider>
    );
};

// ✅ Récupération des données du graphe avant affichage
const AppContent: React.FC = () => {
    const { loading, error, graphData } = useAppContext();

    if (loading) return <div>Chargement des données du graphe en cours...</div>;
    if (error) return <div style={{ color: "red" }}>Erreur : {error}</div>;
    if (!graphData) return <div>Graphique non disponible ou introuvable.</div>;

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas style={{ background: "lightgrey" }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Scene />
            </Canvas>
            <Menu />
        </div>
    );
};

export default App;
