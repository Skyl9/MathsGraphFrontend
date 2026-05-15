import React, {useEffect, useMemo, useCallback, useRef, useState} from "react";
import {useThree} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {Vector3} from "three";
import Node from "../components/Node";
import Edge from "../components/Edge";
import NodeDetails from "../components/NodeDetails";
import gsap from "gsap";
import {NodeData, Graph} from "../types/ApiTypes/graph";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import {useUIStore} from "../stores/useUIStore";
import {useFilterStore} from "../stores/useFilterStore";
import {useGraphStore} from "../stores/useGraphStore";

const getNodeColor = (typeMath: string, colors: string[]): string => {
    if (typeMath === "axiome") return colors[1];
    if (typeMath === "théorème") return colors[2];
    if (typeMath === "lemme") return colors[0];
    return "purple";
};

// Définir les props attendues pour le composant Scene
interface SceneProps {
    graphData: Graph;
}

export default function Scene({ graphData }: SceneProps) {
    console.log("Graph Data reçu par Scene:", graphData); // <<< AJOUTÉ

    const currentView = useUIStore(s => s.currentView);
    const colorLemme = useUIStore(s => s.colorLemme);
    const colorAxiome = useUIStore(s => s.colorAxiome);
    const colortheoreme = useUIStore(s => s.colortheoreme);
    const colorSides = useUIStore(s => s.colorSides);
    const debugMode = useUIStore(s => s.debugMode);
    const setDebugMode = useUIStore(s => s.setDebugMode);
    const graphTheme = useUIStore(s => s.graphTheme);

    const filters = useFilterStore(s => s.filters);

    const targetPosition = useGraphStore(s => s.targetPosition);
    const setTargetPosition = useGraphStore(s => s.setTargetPosition);
    const history = useGraphStore(s => s.history);
    const setHistory = useGraphStore(s => s.setHistory);
    const currentIndex = useGraphStore(s => s.currentIndex);
    const setCurrentIndex = useGraphStore(s => s.setCurrentIndex);
    const selectedNodeId = useGraphStore(s => s.selectedNodeId);
    const setSelectedNodeId = useGraphStore(s => s.setSelectedNodeId);

    const {camera, gl} = useThree();
    const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
    const edges = useMemo(() => graphData?.edges ?? [], [graphData]);
    const controlsRef = useRef<any>(null);
    const [shouldBeShowNode, setShouldBeShowNode] = useState(false);


    const colors = useMemo(() => [colorLemme, colorAxiome, colortheoreme], [colorLemme, colorAxiome, colortheoreme]);

    const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) || null, [nodes, selectedNodeId]);

    const visibleNodes = useMemo(() => {
        const filtered = nodes.filter((node) => filters[node.typeMath as keyof typeof filters] ?? false);
        console.log("Nœuds filtrés (visibleNodes) dans Scene:", filtered); // <<< AJOUTÉ
        return filtered;
    }, [nodes, filters]);

    console.log("Arêtes dans Scene:", edges); // <<< AJOUTÉ

    const neighborIds = useMemo(() => {
        if (selectedNodeId === null) return new Set<number>();

        const neighbors = new Set<number>();
        edges.forEach(edge => {
            if (edge.start === selectedNodeId) neighbors.add(edge.end);
            if (edge.end === selectedNodeId) neighbors.add(edge.start);
        });
        return neighbors;
    }, [selectedNodeId, edges]);

    useEffect(() => {
        if (selectedNode && targetPosition && controlsRef.current) {
            // 1. On anime la CIBLE de la caméra avec GSAP (au lieu d'un lerp brutal)
            gsap.to(controlsRef.current.target, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 1.2,
                ease: "power3.inOut",
                onUpdate: () => controlsRef.current.update(), // Demande à Three.js de recalculer l'angle
            });

            // 2. On anime la POSITION de la caméra pour l'éloigner un peu du nœud
            // On la décale un peu sur X et Y pour un effet plus dramatique/cinématique
            gsap.to(camera.position, {
                x: targetPosition.x + 2,
                y: targetPosition.y + 1.5,
                z: targetPosition.z + 5, // On garde un bon recul
                duration: 1.2,
                ease: "power3.inOut"
            });
        }
        // Note : j'ai retiré controlsRef des dépendances pour éviter des déclenchements parasites
    }, [selectedNode, targetPosition, camera, currentView]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (visibleNodes.length === 0) {
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
                    setSelectedNodeId(visibleNodes[(positionListe + 1) % visibleNodes.length].id);
                    const {x, y, z} = visibleNodes[(positionListe + 1) % visibleNodes.length].position[currentView];
                    setTargetPosition(new Vector3(x, y, z));
                    setShouldBeShowNode(true);
                }
                if (event.key === "q" || event.key === "ArrowLeft") {
                    setSelectedNodeId(visibleNodes[(positionListe - 1 + visibleNodes.length) % visibleNodes.length].id);
                    const {x, y, z} = visibleNodes[(positionListe - 1 + visibleNodes.length) % visibleNodes.length].position[currentView];
                    setTargetPosition(new Vector3(x, y, z));
                    setShouldBeShowNode(true);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedNodeId, visibleNodes, camera, setTargetPosition, setSelectedNodeId, currentView]);

    useEffect(() => {
        const toggleDebug = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "m") {
                console.log("Debug mod activé");
                setDebugMode((prev) => (typeof prev === 'function' ? prev(!prev) : !prev));
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
            const {x, y, z} = selectedNode.position[currentView];
            setTargetPosition(new Vector3(x, y, z));
        }
    }, [selectedNode, setTargetPosition, currentView]);

    const handleCloseNodeDetails = useCallback(() => {
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
            {/* 🌟 NOUVEAU : Changement de la couleur de fond dynamique */}
            {graphTheme === "neon" && <color attach="background" args={["#0a0a10"]} />}
            {/* 🌟 NOUVEAU : En mode néon, on baisse la lumière ambiante pour faire ressortir les sphères */}
            <ambientLight intensity={graphTheme === "neon" ? 0.1 : 0.5} />
            <pointLight position={[10, 10, 10]} intensity={graphTheme === "neon" ? 0.2 : 1} />

            <group onPointerMissed={handleCanvasClick}>
                {visibleNodes.map((node) => (
                    <Node
                        key={node.id}
                        id={node.id}
                        position={[node.position[currentView].x, node.position[currentView].y, node.position[currentView].z]}
                        color={getNodeColor(node.typeMath, colors)}
                        nom={node.nom}
                        isSelected={shouldBeShowNode && selectedNodeId === node.id}
                        isNeighbor={neighborIds.has(node.id)} // 🌟 NOUVEAU
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

                        // 🌟 NOUVEAU : Opacité de la ligne en mode focus
                        const isFocus = graphTheme === "focus";
                        const isLineConnectedToSelected = edge.start === selectedNodeId || edge.end === selectedNodeId;
                        const lineOpacity = (isFocus && selectedNodeId !== null && !isLineConnectedToSelected) ? 0.1 : 1;

                        return (
                            <group key={index}>
                                {/* Astuce: On enveloppe l'Edge pour contrôler son opacité si possible,
                                ou tu passeras lineOpacity à Edge plus tard. Pour l'instant le focus est sur les Noeuds */}
                                <Edge
                                    start={[startNode.position[currentView].x, startNode.position[currentView].y, startNode.position[currentView].z]}
                                    end={[endNode.position[currentView].x, endNode.position[currentView].y, endNode.position[currentView].z]}
                                    type={edge.type}
                                    color={colorSides}
                                    debug={debugMode}
                                    opacity={lineOpacity}
                                />
                            </group>
                        );
                    })}

                {selectedNode && shouldBeShowNode && (
                    <NodeDetails
                        position={[selectedNode.position[currentView].x, selectedNode.position[currentView].y, selectedNode.position[currentView].z]}
                        nom={selectedNode.nom}
                        typeMath={selectedNode.typeMath}
                        id={selectedNode.id}
                        onClose={handleCloseNodeDetails}
                    />
                )}
            </group>

            {/* 🌟 NOUVEAU : Le post-processing pour le mode Néon */}
            {graphTheme === "neon" && (
                <EffectComposer disableNormalPass>
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={1.5}
                        radius={0.8}
                    />
                </EffectComposer>
            )}

            <OrbitControls ref={controlsRef} enableZoom={true} maxDistance={2000} minDistance={5}/>
        </>
    );
}