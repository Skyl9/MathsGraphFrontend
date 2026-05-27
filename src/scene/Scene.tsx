import {useEffect, useMemo, useCallback, useRef, useState} from "react";
import {useThree, useFrame} from "@react-three/fiber";
import {OrbitControls, Billboard, Text, Instances, Instance} from "@react-three/drei";
import {Vector3, Color, Mesh} from "three";
import Edge from "../components/Edge";
import gsap from "gsap";
import {NodeData, Graph} from "../types/ApiTypes/graph";
import {EffectComposer, Bloom} from '@react-three/postprocessing';
import {useUIStore} from "../stores/useUIStore";
import {useFilterStore} from "../stores/useFilterStore";
import {useGraphStore} from "../stores/useGraphStore";
import CustomNode from "../components/Node";

const getNodeColor = (typeMath: string, colors: string[]): string => {
    if (typeMath === "axiome") return colors[1];
    if (typeMath === "théorème") return colors[2];
    if (typeMath === "lemme") return colors[0];
    return "purple";
};

// 🌟 NOUVEAU : Anneau holographique de sélection
const SelectionRing = ({ position, color }: { position: [number, number, number]; color: string }) => {
    const ringRef = useRef<Mesh>(null);
    useFrame(({ clock }) => {
        if (ringRef.current) {
            // Rotation sur l'axe Y/Z
            ringRef.current.rotation.z = clock.getElapsedTime() * 0.6;
            // Pulsation d'échelle douce
            const scale = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.06;
            ringRef.current.scale.set(scale, scale, scale);
        }
    });
    return (
        <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.015, 8, 48]} />
            <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={2.5} 
                transparent 
                opacity={0.8} 
            />
        </mesh>
    );
};

interface SceneProps {
    graphData: Graph;
}

interface GraphNodeProps {
    node: NodeData;
    currentView: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
    debug: boolean;
    shouldDim: boolean;
}

// 🌟 NOUVEAU : Sous-composant qui lie 1 Instance (GPU) à 1 Texte (CPU)
const GraphNode = ({node, currentView, color, isSelected, onClick, debug, shouldDim}: GraphNodeProps) => {
    const [hovered, setHovered] = useState(false);
    const sphereSize = 0.3;

    // Calcul de la couleur finale :
    // Si on est en mode "Focus" et que ce nœud n'est pas lié, on l'assombrit drastiquement.
    const finalColor = useMemo(() => {
        const activeColor = hovered ? "#99C2FF" : color;
        const c = new Color(activeColor);
        if (isSelected) return new Color("#ffffff"); // Blanc pur si sélectionné
        if (shouldDim) return c.multiplyScalar(0.15); // Très sombre si hors focus
        return c;
    }, [hovered, color, isSelected, shouldDim]);

    return (
        <group position={[node.position[currentView].x, node.position[currentView].y, node.position[currentView].z]}>
            {/* L'instance virtuelle de la sphère (1 draw call global) */}
            <Instance
                color={finalColor}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                }}
            />

            {/* On garde le Billboard pour le texte, affiché intelligemment */}
            {(!shouldDim || hovered) && (
                <Billboard position={[0, sphereSize + 0.4, 0]}>
                    <Text fontSize={0.3} color={color} anchorX="center" anchorY="middle">
                        {node.nom}
                    </Text>
                </Billboard>
            )}

            {/* Hitbox debug optionnelle */}
            {debug && (
                <mesh>
                    <sphereGeometry args={[sphereSize * 0.7, 16, 16]}/>
                    <meshBasicMaterial color="red" wireframe/>
                </mesh>
            )}
        </group>
    );
};

export default function Scene({graphData}: SceneProps) {
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
    const selectedNodeId = useGraphStore(s => s.selectedNodeId);
    const setSelectedNodeId = useGraphStore(s => s.setSelectedNodeId);

    const {camera, gl} = useThree();
    const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
    const edges = useMemo(() => graphData?.edges ?? [], [graphData]);
    const controlsRef = useRef<any>(null);
    const darkMode = useUIStore(s => s.darkMode);

    const colors = useMemo(() => [colorLemme, colorAxiome, colortheoreme], [colorLemme, colorAxiome, colortheoreme]);
    const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) || null, [nodes, selectedNodeId]);

    const visibleNodes = useMemo(() => {
        return nodes.filter((node) => filters[node.typeMath as keyof typeof filters] ?? false);
    }, [nodes, filters]);

    const neighborIds = useMemo(() => {
        if (selectedNodeId === null) return new Set<number>();
        const neighbors = new Set<number>();
        edges.forEach(edge => {
            if (edge.start === selectedNodeId) neighbors.add(edge.end);
            if (edge.end === selectedNodeId) neighbors.add(edge.start);
        });
        return neighbors;
    }, [selectedNodeId, edges]);

    // Animations GSAP
    useEffect(() => {
        if (selectedNode && targetPosition && controlsRef.current) {
            gsap.to(controlsRef.current.target, {
                x: targetPosition.x, y: targetPosition.y, z: targetPosition.z,
                duration: 1.2, ease: "power3.inOut",
                onUpdate: () => controlsRef.current.update(),
            });
            gsap.to(camera.position, {
                x: targetPosition.x + 2, y: targetPosition.y + 1.5, z: targetPosition.z + 5,
                duration: 1.2, ease: "power3.inOut"
            });
        }
    }, [selectedNode, targetPosition, camera, currentView]);

    // Écouteurs d'événements pour le HUD de navigation (Zoom / Reset)
    useEffect(() => {
        const handleZoomIn = () => {
            if (controlsRef.current) {
                const target = controlsRef.current.target;
                gsap.to(camera.position, {
                    x: target.x + (camera.position.x - target.x) * 0.7,
                    y: target.y + (camera.position.y - target.y) * 0.7,
                    z: target.z + (camera.position.z - target.z) * 0.7,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        };

        const handleZoomOut = () => {
            if (controlsRef.current) {
                const target = controlsRef.current.target;
                gsap.to(camera.position, {
                    x: target.x + (camera.position.x - target.x) * 1.4,
                    y: target.y + (camera.position.y - target.y) * 1.4,
                    z: target.z + (camera.position.z - target.z) * 1.4,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        };

        const handleReset = () => {
            setSelectedNodeId(null);
            setTargetPosition(new Vector3(0, 0, 0));
            if (controlsRef.current) {
                gsap.to(controlsRef.current.target, {
                    x: 0, y: 0, z: 0,
                    duration: 1.2,
                    ease: "power3.inOut",
                    onUpdate: () => controlsRef.current.update()
                });
            }
            gsap.to(camera.position, {
                x: 0, y: 10, z: 35,
                duration: 1.2,
                ease: "power3.inOut"
            });
        };

        window.addEventListener("graph-zoom-in", handleZoomIn);
        window.addEventListener("graph-zoom-out", handleZoomOut);
        window.addEventListener("graph-reset-view", handleReset);

        return () => {
            window.removeEventListener("graph-zoom-in", handleZoomIn);
            window.removeEventListener("graph-zoom-out", handleZoomOut);
            window.removeEventListener("graph-reset-view", handleReset);
        };
    }, [camera, setSelectedNodeId, setTargetPosition]);

    // Raccourcis clavier (D, Q, Arrow)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (visibleNodes.length === 0) return;
            if (selectedNodeId === null) setSelectedNodeId(visibleNodes[0].id);
            if (!camera || !event) return;

            let positionListe = visibleNodes.findIndex((node: NodeData) => node.id === selectedNodeId);
            if (positionListe !== -1) {
                if (event.key === "d" || event.key === "ArrowRight") {
                    const nextNode = visibleNodes[(positionListe + 1) % visibleNodes.length];
                    setSelectedNodeId(nextNode.id);
                    setTargetPosition(new Vector3(nextNode.position[currentView].x, nextNode.position[currentView].y, nextNode.position[currentView].z));
                }
                if (event.key === "q" || event.key === "ArrowLeft") {
                    const prevNode = visibleNodes[(positionListe - 1 + visibleNodes.length) % visibleNodes.length];
                    setSelectedNodeId(prevNode.id);
                    setTargetPosition(new Vector3(prevNode.position[currentView].x, prevNode.position[currentView].y, prevNode.position[currentView].z));
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedNodeId, visibleNodes, camera, setTargetPosition, setSelectedNodeId, currentView]);

    // Mode debug
    useEffect(() => {
        const toggleDebug = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "m") setDebugMode(!debugMode);
        };
        window.addEventListener("keydown", toggleDebug);
        return () => window.removeEventListener("keydown", toggleDebug);
    }, [debugMode, setDebugMode]);


    useEffect(() => {
        if (selectedNode) {
            const {x, y, z} = selectedNode.position[currentView];
            setTargetPosition(new Vector3(x, y, z));
        }
    }, [selectedNode, setTargetPosition, currentView]);

    const handleCanvasClick = useCallback((event: MouseEvent) => {
        if (event.target === gl.domElement) setSelectedNodeId(null);
    }, [gl, setSelectedNodeId]);

    const renderMode = useUIStore(s => s.renderMode);
    if (!graphData) return <group>Pas de données pour la scène.</group>;

    return (
        <>
            <ambientLight intensity={graphTheme === "neon" ? 0.35 : (darkMode ? 0.45 : 0.75)}/>
            <directionalLight position={[10, 20, 10]} intensity={graphTheme === "neon" ? 0.6 : 0.95} />
            <pointLight position={[-10, -20, -10]} intensity={0.2} />

            <gridHelper 
                args={[200, 80, darkMode ? "rgba(56, 189, 248, 0.45)" : "rgba(14, 165, 233, 0.55)", darkMode ? "rgba(148, 163, 184, 0.08)" : "rgba(71, 85, 105, 0.1)"]} 
                position={[0, -12, 0]} 
            />

            <group onPointerMissed={handleCanvasClick}>
                {renderMode === "performance" ? (
                    /* ==========================================
                       MODE PERFORMANCE (InstancedMesh)
                    ========================================== */
                    <Instances limit={10000}>
                        <sphereGeometry args={[0.3, 16, 16]}/>
                        <meshStandardMaterial
                            transparent={true}
                            emissive={graphTheme === "neon" ? "white" : "black"}
                            emissiveIntensity={graphTheme === "neon" ? 0.8 : 0}
                        />
                        {visibleNodes.map((node) => {
                            const isSelected = selectedNodeId === node.id;
                            const isNeighbor = neighborIds.has(node.id);
                            const isFocus = graphTheme === "focus";
                            const shouldDim = isFocus && selectedNodeId !== null && !isSelected && !isNeighbor;

                            return (
                                <GraphNode
                                    key={`inst-${node.id}`}
                                    node={node}
                                    currentView={currentView}
                                    color={getNodeColor(node.typeMath, colors)}
                                    isSelected={isSelected}
                                    shouldDim={shouldDim}
                                    debug={debugMode}
                                    onClick={() => {
                                        setSelectedNodeId(node.id);
                                    }}
                                />
                            );
                        })}
                    </Instances>
                ) : (
                    /* ==========================================
                       MODE QUALITÉ (Noeuds individuels classiques)
                    ========================================== */
                    visibleNodes.map((node) => (
                        <CustomNode
                            key={`node-${node.id}`}
                            id={node.id}
                            position={[node.position[currentView].x, node.position[currentView].y, node.position[currentView].z]}
                            color={getNodeColor(node.typeMath, colors)}
                            nom={node.nom}
                            isSelected={selectedNodeId === node.id}
                            isNeighbor={neighborIds.has(node.id)}
                            onClick={() => {
                                setSelectedNodeId(node.id);
                            }}
                            debug={debugMode}
                        />
                    ))
                )}

                {/* 🌟 Les Arêtes */}
                {edges
                    .filter(edge => visibleNodes.find(n => n.id === edge.start) && visibleNodes.find(n => n.id === edge.end))
                    .map((edge, index) => {
                        const startNode = visibleNodes.find(node => node.id === edge.start)!;
                        const endNode = visibleNodes.find(node => node.id === edge.end)!;

                        const isFocus = graphTheme === "focus";
                        const isLineConnectedToSelected = edge.start === selectedNodeId || edge.end === selectedNodeId;
                        const lineOpacity = (isFocus && selectedNodeId !== null && !isLineConnectedToSelected) ? 0.1 : 1;

                        return (
                            <group key={index}>
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

                {/* 🌟 Anneau de sélection holographique */}
                {selectedNode && (
                    <SelectionRing
                        position={[selectedNode.position[currentView].x, selectedNode.position[currentView].y, selectedNode.position[currentView].z]}
                        color={getNodeColor(selectedNode.typeMath, colors)}
                    />
                )}
            </group>

            {graphTheme === "neon" && (
                <EffectComposer>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.8}/>
                </EffectComposer>
            )}

            <OrbitControls ref={controlsRef} enableZoom={true} maxDistance={2000} minDistance={5}/>
        </>
    );
}