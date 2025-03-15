// src/App.tsx
import React, {useEffect, useRef, useState} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib"; // Import nécessaire pour le typage

import Scene from "./components/Scene";
import Menu from "./components/Menu";
import {Vector3} from "three";
import Map from "./components/map";
import { GraphData } from "./type";

const App: React.FC = () => {
    const [color, setColor] = useState('lightgrey');
    const [colorSides, setColorSides] = useState('black');
    const [colorAxiome, setColorAxiome] = useState('black');
    const [colortheoreme, setColorTheoreme] = useState('black');
    const [colorLemme, setColorLemme] = useState('black');
    const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);
    const [initialPosition, setInitialPosition] = useState<Vector3 | null>(null);
    const [isPosInitial, setIsPosInitial] = useState<boolean>(true);

    const controls = useRef<OrbitControlsImpl | null>(null);
    const [history, setHistory] = useState<Vector3[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [needToSetHistory, setNeedToSetHistory] = useState<boolean>(false)
    const [filters, setFilters] = useState({
        axiome: true,
        theoreme: true,
        lemme: true,
    });

    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGraphData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/concepts");

            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`);
            }
            const data = await response.json();
            setGraphData(data);

        } catch (err) {
            setError("Erreur lors du chargement du graphe  : "+err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraphData();
    }, []);

    const exportGraph = () => {
        const dataStr = JSON.stringify(graphData, null, 2);
        const blob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "graphData.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const importGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newGraph = JSON.parse(e.target?.result as string);
                setGraphData(newGraph); // Met à jour l'état du graphe
            } catch (error) {
                console.error("Erreur lors du chargement du fichier JSON", error);
            }
        };
        reader.readAsText(file);
    };


    const moveToPosition = (position: Vector3) => {
        // Si on revient en arrière puis sélectionne un nouveau nœud, on coupe l'historique
        setHistory((prev) => prev.slice(0, currentIndex + 1).concat([position]));
        setCurrentIndex((prev) => prev + 1);
    };

    const goBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setTargetPosition(history[currentIndex - 1]);
        }
    };

    const goForward = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setTargetPosition(history[currentIndex + 1]);
        }
    };
    if (graphData){
        // console.log("Le graphe est chargé")
    return (
        <>
            <Menu setColor={setColor}
                  setColorSides={setColorSides}
                  setColorAxiome={setColorAxiome}
                  setColorTheoreme={setColorTheoreme}
                  setColorLemme={setColorLemme}
                  setTargetPosition={setTargetPosition}
                  initialPosition={initialPosition}
                  setInitialPosition={setInitialPosition}
                  setIsPosInitial={setIsPosInitial}
                  moveToPosition={moveToPosition}
                  goBack={goBack}
                  goForward={goForward}
                  history={history}
                  currentIndex={currentIndex}
                  exportGraph={exportGraph}
                  importGraph={importGraph}
                  filters={filters}
                  setFilters={setFilters}

            />
            <div style={{width: "100vw", height: "100vh"}}>

                <Canvas style={{background: color}}>
                    <ambientLight intensity={0.5}/>
                    <pointLight position={[10, 10, 10]}/>
                    <OrbitControls ref={controls}/>

                    <Scene colorSides={colorSides}
                           colorAxiome={colorAxiome}
                           colortheoreme={colortheoreme}
                           colorLemme={colorLemme}
                           targetPosition={targetPosition}
                           setTargetPosition={setTargetPosition}
                           setInitialPosition={setInitialPosition}
                           isPosInitial={isPosInitial}
                           setIsPosInitial={setIsPosInitial}
                           ref={controls}
                           setHistory={setHistory}
                           setCurrentIndex={setCurrentIndex}
                           currentIndex={currentIndex}
                           history={history}
                           needToSetHistory={needToSetHistory}
                           moveToPosition={moveToPosition}
                           graphData={graphData}
                           filters={filters}

                    />


                </Canvas>
                <Map setTargetPosition={setTargetPosition}/>
            </div>
        </>
    );
}
    if (loading) {
        return <div>Chargement du graphe...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }
    return <></>
};

export default App;
