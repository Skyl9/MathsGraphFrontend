import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import Node from "./Node";
import Edge from "./Edge";
import NodeDetails from "./NodeDetails";
import { useAppContext } from "../AppContext";
import gsap from "gsap";
import { NodeData } from "../type"; // Importez les types précis

const getNodeColor = (typeMath: string, colors: string[]): string => {
    if (typeMath === "axiome") return colors[1];
    if (typeMath === "théorème") return colors[2];
    if (typeMath === "lemme") return colors[0];
    return "purple";
};

export default function Scene() {
    const { currentView, setCurrentView, colorLemme, colorAxiome, colortheoreme, graphData, filters, targetPosition, setHistory, currentIndex, setCurrentIndex, history, setDebugMode, debugMode, setTargetPosition, colorSides, selectedNodeId, setSelectedNodeId } = useAppContext();

    const { camera, gl } = useThree();
    const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
    const edges = useMemo(() => graphData?.edges ?? [], [graphData]);
    const controlsRef = useRef<any>(null);
    const [shouldBeShowNode, setShouldBeShowNode] = useState(false);


    const colors = useMemo(() => [colorLemme, colorAxiome, colortheoreme], [colorLemme, colorAxiome, colortheoreme]);

    const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) || null, [nodes, selectedNodeId]); // Typage précis

    const visibleNodes = useMemo(() => {
        return nodes.filter((node) => filters[node.typeMath as keyof typeof filters] ?? false);
    }, [nodes, filters]);

    useEffect(() => {
        if (selectedNode && targetPosition && controlsRef.current) {
            gsap.to(camera.position, {
                x: selectedNode.position[currentView].x,
                y: selectedNode.position[currentView].y,
                z: selectedNode.position[currentView].z + 3,
                duration: 1.5,
                onUpdate: () => {
                    controlsRef.current.target.lerp(targetPosition, 1);
                    controlsRef.current.update();
                },
            });
        }
    }, [selectedNode, targetPosition, camera, controlsRef]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (visibleNodes.length === 0){
                return;
            }
            if (selectedNodeId === null) {
                setSelectedNodeId(visibleNodes[0].id);
            }
            if (!camera || !event) {
                console.log("Camera is null");
                return;
            }
            let positionListe = visibleNodes.findIndex((node: NodeData) => node.id === selectedNodeId);

            if (positionListe === -1) {
                console.log("erreur de position dans la liste, élément non trouvé");
            } else {
                if (event.key === "d" || event.key === "ArrowRight") {
                    setSelectedNodeId(visibleNodes[(positionListe + 1) % visibleNodes.length].id); // Utilisation de modulo pour boucler
                    const { x, y, z } = visibleNodes[(positionListe + 1) % visibleNodes.length].position[currentView];
                    setTargetPosition(new Vector3(x, y, z));
                    setShouldBeShowNode(true);
                }
                if (event.key === "q" || event.key === "ArrowLeft") {
                    setSelectedNodeId(visibleNodes[(positionListe - 1 + visibleNodes.length) % visibleNodes.length].id); // Utilisation de modulo pour boucler
                    const { x, y, z } = visibleNodes[(positionListe - 1) % visibleNodes.length].position[currentView];
                    setTargetPosition(new Vector3(x, y, z));                    setShouldBeShowNode(true);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedNodeId, visibleNodes, camera, setTargetPosition, setSelectedNodeId]);

    useEffect(() => {
        const toggleDebug = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "m") {
                console.log("Debug mod activé");
                setDebugMode((prev) => !prev);
            }
        };
        window.addEventListener("keydown", toggleDebug);
        return () => window.removeEventListener("keydown", toggleDebug);
    }, [setDebugMode]);

    useEffect(() => {
        if (targetPosition) {
            setHistory((prevHistory: Vector3[]) => {
                if (currentIndex < prevHistory.length - 1) {
                    return prevHistory;
                }
                if (prevHistory.length === 0 || !prevHistory[prevHistory.length - 1].equals(targetPosition)) {
                    return [...prevHistory, targetPosition];
                }
                return prevHistory;
            });
            setCurrentIndex((prevIndex: number) =>
                history.length === 0 || (history[currentIndex] && !history[currentIndex].equals(targetPosition))
                    ? prevIndex + 1
                    : prevIndex
            );
        }
    }, [currentIndex, history, setCurrentIndex, setHistory, targetPosition]);

    useEffect(() => {
        if (selectedNode) {
            const { x, y, z } = selectedNode.position[currentView];
            setTargetPosition(new Vector3(x, y, z));
        }
    }, [selectedNode, setTargetPosition]);

    const handleCloseNodeDetails = useCallback(() => { // utilisation de useCallback
        setSelectedNodeId(null);
        setShouldBeShowNode(false);
    }, [setSelectedNodeId, setShouldBeShowNode]);

    const handleCanvasClick = useCallback((event: MouseEvent) => {
        if (event.target === gl.domElement) {
            setShouldBeShowNode(false);
        }
    }, [gl, setShouldBeShowNode]);

    if (!graphData) {
        return <group>Pas de données pour la scène.</group>;
    }

    return (
        <>
            <group onPointerMissed={handleCanvasClick}>
                {visibleNodes.map((node) => (
                    <Node
                        key={node.id}
                        id={node.id}
                        position={ [node.position[currentView].x,node.position[currentView].y,node.position[currentView].z] }
                        color={getNodeColor(node.typeMath, colors)}
                        nom={node.nom}
                        isSelected={shouldBeShowNode && selectedNodeId === node.id}
                        onClick={() => {
                            setSelectedNodeId(node.id);
                            setShouldBeShowNode(true);
                        }}
                        debug={debugMode}
                    />
                ))}
                {edges
                    .filter(edge => {
                        const startNode = visibleNodes.find(node => node.id === edge.start);
                        const endNode = visibleNodes.find(node => node.id === edge.end);
                        return startNode && endNode;
                    })
                    .map((edge, index) => {
                        const startNode = visibleNodes.find(node => node.id === edge.start)!;
                        const endNode = visibleNodes.find(node => node.id === edge.end)!;
                        return (
                            <Edge
                                key={index}
                                start={[startNode.position[currentView].x, startNode.position[currentView].y,startNode.position[currentView].z]}
                                end={[endNode.position[currentView].x,endNode.position[currentView].y,endNode.position[currentView].z]}
                                type={edge.type}
                                color={colorSides}
                                debug={debugMode}
                            />
                        );
                    })}
                {selectedNode && shouldBeShowNode && (
                    <NodeDetails
                        position={[selectedNode.position[currentView].x,selectedNode.position[currentView].y,selectedNode.position[currentView].z]}
                        nom={selectedNode.nom}
                        typeMath={selectedNode.typeMath}
                        id={selectedNode.id}
                        onClose={handleCloseNodeDetails}
                    />
                )}
            </group>
            <OrbitControls ref={controlsRef} enableZoom={true} maxDistance={2000} minDistance={5} />
        </>
    );
}