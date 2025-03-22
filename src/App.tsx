import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import Menu from "./components/Menu";
import { AppProvider, useAppContext } from "./AppContext";

const App: React.FC = () => {
    return (
            <AppProvider> {/* AppProvider est maintenant enfant de Canvas */}
                <AppContent />
            </AppProvider>
    );
};

// Sous-composant pour récupérer la couleur et afficher la scène
// ✅ Récupération des données nécessaires depuis le contexte
const AppContent: React.FC = () => {
    const { color, loading, error, graphData } = useAppContext(); // Contexte disponible ici

    if (loading) {
        return <div>Chargement des données du graphe en cours...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>Erreur : {error}</div>;
    }

    if (!graphData) {
        return <div>Graphique non disponible ou introuvable.</div>;
    }

    return (
        <React.Fragment>
            {/* Contenu principal */}
            <div style={{ width: "100vw", height: "100vh" }}>
                <Canvas style={{ background: "lightgrey" }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Scene />
                </Canvas>

                {/* Le Menu est ici, en dehors de Canvas */}
                <Menu />
            </div>

        </React.Fragment>
    );
};

export default App;