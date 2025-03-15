import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { GraphData } from "./type";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib/controls/OrbitControls";
import {useThree} from "@react-three/fiber";

// 📌 Définition du type pour votre contexte
interface AppContextProps {
    // Couleurs
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    colorAxiome: string;
    colorLemme: string;
    colortheoreme: string;
    colorSides: string;
    setColorSides: React.Dispatch<any>;
    setColorLemme: React.Dispatch<any>;
    setColorAxiome: React.Dispatch<any>;
    setColorTheoreme: React.Dispatch<any>;

    // Positions et état de la caméra
    targetPosition: Vector3 | null;
    setTargetPosition: React.Dispatch<React.SetStateAction<Vector3 | null>>;
    initialPosition: Vector3 | null;
    setInitialPosition: (pos: Vector3) => void;
    isPosInitial: boolean;
    setIsPosInitial: React.Dispatch<any>;
    setSelectedNodeId: React.Dispatch<any>;
    selectedNodeId: number | null;

    // Historique des mouvements
    history: Vector3[];
    setHistory: React.Dispatch<any>;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<any>;
    needToSetHistory: boolean;
    moveToPosition: (position: Vector3) => void;

    // Fonctions de navigation
    goBack: () => void;
    goForward: () => void;

    // Données liées au graphe
    graphData: GraphData | null;
    filters: {
        axiome: boolean;
        theoreme: boolean;
        lemme: boolean;
    };
    setFilters: React.Dispatch<any>;

    // Actions liées au graphe
    exportGraph: () => void;
    importGraph: (event: React.ChangeEvent<HTMLInputElement>) => void;

    // Références diverses
    ref: React.MutableRefObject<OrbitControlsImpl | null>;
    loading: boolean;
    error: string | null;

    debugMode: boolean;
    setDebugMode: React.Dispatch<React.SetStateAction<boolean>>;

}

// 📌 Création du contexte
const AppContext = createContext<AppContextProps | undefined>(undefined);

// 📌 Fournisseur de contexte (englobe tout le composant principal)
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // États globaux partagés via le contexte
    const [color, setColor] = useState("lightgrey");
    const [colorSides, setColorSides] = useState("black");
    const [colorAxiome, setColorAxiome] = useState("black");
    const [colortheoreme, setColorTheoreme] = useState("black");
    const [colorLemme, setColorLemme] = useState("black");

    const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);
    const [initialPosition, setInitialPosition] = useState<Vector3 | null>(null);
    const [isPosInitial, setIsPosInitial] = useState<boolean>(true);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

    const controls = useRef<OrbitControlsImpl | null>(null);
    const [history, setHistory] = useState<Vector3[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [needToSetHistory, setNeedToSetHistory] = useState<boolean>(false);
    const [debugMode, setDebugMode] = useState<boolean>(false);


    const [filters, setFilters] = useState({
        axiome: true,
        theoreme: true,
        lemme: true,
    });

    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [loading, setLoading] = useState(true); // Pour afficher un indicateur de chargement
    const [error, setError] = useState<string | null>(null); // Pour capturer les erreurs




    // 📌 Fonction pour charger les données du graphe
    const fetchGraphData = async () => {
        setLoading(true);
        setError(null); // Réinitialiser l'erreur à chaque tentative
        try {
            const response = await fetch("http://127.0.0.1:8000/concepts");

            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`);
            }

            const data = await response.json();
            setGraphData(data);
        } catch (err: unknown) {
            setError(
                `Erreur lors du chargement du graphe : ${
                    err instanceof Error ? err.message : "Erreur inconnue"
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraphData();
    }, []);

    // 📌 Fonction pour exporter le graphe
    const exportGraph = () => {
        try {
            if (!graphData) {
                throw new Error("Aucun graphe à exporter.");
            }
            const dataStr = JSON.stringify(graphData, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "graphData.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            alert(`Erreur lors de l'exportation : ${err}`);
        }
    };

    // 📌 Fonction pour importer le graphe
    const importGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) throw new Error("Aucun fichier sélectionné.");

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const newGraph = JSON.parse(e.target?.result as string);
                    setGraphData(newGraph);
                } catch (err) {
                    alert("Erreur lors de l'importation du fichier JSON.");
                }
            };
            reader.readAsText(file);
        } catch (err) {
            alert(`Erreur lors de l'importation : ${err}`);
        }
    };

    // 📌 Fonctions de navigation
    const moveToPosition = (position: Vector3) => {
        if (!position) {
            console.error("Position non valide !");
            return;
        }
        setTargetPosition(position);
        setNeedToSetHistory(true);
    };

    const goBack = () => {
        if (currentIndex <= 0) return;
        setCurrentIndex((prevIndex) => prevIndex - 1);
        setTargetPosition(history[currentIndex - 1]);
    };

    const goForward = () => {
        if (currentIndex >= history.length - 1) return;
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setTargetPosition(history[currentIndex + 1]);
    };

    return (
        <AppContext.Provider
            value={{
                // Couleurs
                color,
                setColor,
                colorAxiome,
                setColorAxiome,
                colorLemme,
                setColorLemme,
                colortheoreme,
                setColorTheoreme,
                colorSides,
                setColorSides,

                // Positions et état de la caméra
                targetPosition,
                setTargetPosition,
                initialPosition,
                setInitialPosition,
                isPosInitial,
                setIsPosInitial,
                setSelectedNodeId,
                selectedNodeId,

                // Historique des mouvements et navigation
                history,
                setHistory,
                currentIndex,
                setCurrentIndex,
                needToSetHistory,
                moveToPosition,
                goBack,
                goForward,

                // Données du graphe
                graphData,
                filters,
                setFilters,

                // Actions de graphe
                exportGraph,
                importGraph,

                // Références diverses
                ref: controls,
                loading,
                error,

                debugMode,
                setDebugMode
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// 📌 Hook personnalisé pour accéder au contexte
export const useAppContext = (): AppContextProps => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider.");
    }
    return context;
};