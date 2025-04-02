import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Vector3 } from "three";
import { GraphData } from "./type";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib/controls/OrbitControls";

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
    selectedNodeId: number | null;
    setSelectedNodeId: React.Dispatch<React.SetStateAction<number | null>>;

    // Historique des mouvements
    history: Vector3[];
    setHistory: React.Dispatch<React.SetStateAction<Vector3[]>>;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    needToSetHistory: boolean;
    moveToPosition: (position: Vector3) => void;

    // Fonctions de navigation
    goBack: () => void;
    goForward: () => void;

    // Données liées au graphe
    graphData: GraphData | null;
    setGraphData: React.Dispatch<any>;
    filters: {
        "axiome": boolean;
        "théorème": boolean;
        "lemme": boolean;
        "réciproque": boolean;
    };
    setFilters: React.Dispatch<React.SetStateAction<any>>;

    // Actions liées au graphe

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
    const backend_link = process.env.REACT_APP_BACKEND_LINK || "";
    const port = process.env.REACT_APP_PORT || "8000";
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
        théorème: true,
        lemme: true,
        réciproque: true,
    });

    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 📌 Fonction pour charger les données du graphe
    const fetchGraphData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching GraphData...",backend_link,'b');
            const response = await fetch(backend_link + port+  "/concepts");
            if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
            const data = await response.json();
            setGraphData(data);
        } catch (err: unknown) {
            setError(`Erreur : ${err instanceof Error ? err.message : "Erreur inconnue"}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGraphData();
    }, [fetchGraphData]);

    // 📌 Fonctions de navigation
    const moveToPosition = useCallback((position: Vector3) => {
        if (!position) return;
        setTargetPosition(position);
        setNeedToSetHistory(true);
    }, []);

    const goBack = useCallback(() => {
        if (currentIndex <= 0) return;
        setCurrentIndex((prevIndex) => prevIndex - 1);
        setTargetPosition(history[currentIndex - 1]);
    }, [currentIndex, history]);

    const goForward = useCallback(() => {
        if (currentIndex >= history.length - 1) return;
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setTargetPosition(history[currentIndex + 1]);
    }, [currentIndex, history]);

    // 📌 Mémoïsation du contexte
    const contextValue = useMemo(() => ({
        color, setColor,
        colorAxiome, setColorAxiome,
        colorLemme, setColorLemme,
        colortheoreme, setColorTheoreme,
        colorSides, setColorSides,

        targetPosition, setTargetPosition,
        initialPosition, setInitialPosition,
        isPosInitial, setIsPosInitial,
        selectedNodeId, setSelectedNodeId,

        history, setHistory,
        currentIndex, setCurrentIndex,
        needToSetHistory, moveToPosition,
        goBack, goForward,

        graphData,setGraphData,
        filters, setFilters,

        ref: controls, loading, error,
        debugMode, setDebugMode

    }), [
        color, colorAxiome, colorLemme, colortheoreme, colorSides,
        targetPosition, initialPosition, isPosInitial, selectedNodeId,
        history, currentIndex, needToSetHistory,
        graphData, filters, loading, error, debugMode
    ]);

    return (
        <AppContext.Provider value={contextValue}>
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
