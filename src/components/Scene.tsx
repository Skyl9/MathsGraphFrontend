import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {Frustum, Matrix4, Vector3} from "three";
import Node from "./Node";
import Edge from "./Edge";
import NodeDetails from "./NodeDetails";
import { GraphData } from "../type";


// 📌 Fonction pour obtenir la couleur d'un nœud
const getNodeColor = (typeMath: string, colors: string[]): string => {
    if (typeMath === "axiome") return colors[1];
    if (typeMath === "théorème") return colors[2];
    if (typeMath === "lemme") return colors[0];
    return "purple";
};

const getNodeLOD = (nodePosition: Vector3, camera:any) => {
    const distance = nodePosition.distanceTo(camera.position);

    if (distance < 5) return "high"; // Détail maximum (proche)
    if (distance < 15) return "medium"; // Détail intermédiaire
    return "low"; // Détail minimum (éloigné)
};

// 📌 Props du composant Scene
interface SceneProps {
    colorAxiome: string;
    colorLemme: string;
    colortheoreme: string;
    colorSides: string;
    targetPosition: Vector3 | null;
    setTargetPosition: React.Dispatch<React.SetStateAction<Vector3 | null>>;
    setInitialPosition: (pos: Vector3) => void;
    isPosInitial:boolean;
    setIsPosInitial:any;
    ref:any;
    setHistory:any,
    setCurrentIndex:any,
    currentIndex:any,
    history:Vector3[],
    needToSetHistory:any,
    moveToPosition:any,
    graphData:GraphData,
    filters: {
        axiome: boolean;
        theoreme: boolean;
        lemme: boolean;
    };
}

export default function Scene({
                                  colorAxiome,
                                  colorLemme,
                                  colortheoreme,
                                  colorSides,
                                  targetPosition,
                                  setTargetPosition,
                                  setInitialPosition,
                                  isPosInitial,
                                  setIsPosInitial,
    ref,
    setHistory,
    setCurrentIndex,
    currentIndex,
    history,
                                  moveToPosition,
    graphData,
    filters
                              }: SceneProps) {
    const { camera, gl } = useThree();
    const nodes = useMemo(() => graphData.nodes, [graphData.nodes]);
    const edges = useMemo(() => graphData.edges, [graphData.edges]);

    const colors = useMemo(() => [colorLemme, colorAxiome, colortheoreme], [colorLemme, colorAxiome, colortheoreme]);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const selectedNode = nodes.find((node) => node.id === selectedNodeId);

    const [debugMode, setDebugMode] = useState(false);
    const visibleNodes = useMemo(() => {
        return nodes.filter(node => filters[node.typeMath as keyof typeof  filters]);
    }, [nodes, filters]);

    const [nodeLODs, setNodeLODs] = useState<{ [key: number]: "high" | "medium" | "low" }>({});
    const [visibleNodesCamera, setVisibleNodesCamera] = useState<Set<number>>(new Set());



    function  CenterCamera(){
        const positions = nodes.map((node) => node.position);
        const minX = Math.min(...positions.map((p) => p[0]));
        const maxX = Math.max(...positions.map((p) => p[0]));
        const minY = Math.min(...positions.map((p) => p[1]));
        const maxY = Math.max(...positions.map((p) => p[1]));
        const minZ = Math.min(...positions.map((p) => p[2]));
        const maxZ = Math.max(...positions.map((p) => p[2]));

        // 📌 Centre et taille du graphe
        const center = new Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
        const size = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
        const defaultDistance = size * 2; // Distance de base

        // 📌 Position initiale de la caméra
        const initialPos = new Vector3(center.x, center.y + defaultDistance, center.z + defaultDistance);






        useFrame(() => {
            if (isPosInitial) {
            camera.position.copy(initialPos);
            camera.lookAt(center);
            setInitialPosition(initialPos);
            setIsPosInitial(false)
        }
        }, );

    }
    // CenterCamera()

    // 📌 Active/Désactive le mode debug avec "D"
    useEffect(() => {
        const toggleDebug = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "d") {
                console.log("Debug mod activé")
                setDebugMode((prev) => !prev);
            }
        };
        window.addEventListener("keydown", toggleDebug);
        return () => window.removeEventListener("keydown", toggleDebug);
    }, []);

    useEffect(() => {
        if (targetPosition) {
            setHistory((prevHistory: Vector3[]) => {
                // ✅ Si on navigue dans l'historique, on ne doit pas ajouter une nouvelle entrée
                if (currentIndex < prevHistory.length - 1) {
                    return prevHistory;
                }

                // ✅ Vérifie que la nouvelle position est différente de la dernière entrée
                if (prevHistory.length === 0 || !prevHistory[prevHistory.length - 1].equals(targetPosition)) {
                    return [...prevHistory, targetPosition];
                }

                return prevHistory;
            });

            // ✅ Ne pas incrémenter si la position ne change pas
            setCurrentIndex((prevIndex: number) =>
                history.length === 0 || !history[prevIndex].equals(targetPosition)
                    ? prevIndex + 1
                    : prevIndex
            );
        }
    }, [targetPosition]);



    // 📌 Gestion du clic hors nœuds (désélection)
    const handleCanvasClick = useCallback((event: MouseEvent) => {
        if (event.target === gl.domElement) {
            setSelectedNodeId(null);
        }
    }, [gl]);


    function MoveCamera(){
        const safeVector = new Vector3(0, 0, 2)
        useFrame((state, delta, frame) => {
            if (targetPosition ) {
                // Évite que la caméra soit exactement sur le nœud
                const safePosition = targetPosition.clone().add(safeVector);

                camera.lookAt(targetPosition);
                // Remplace la fonction lerp
                camera.position.x += (safePosition.x - camera.position.x) * delta * 2;
                camera.position.y += (safePosition.y - camera.position.y) * delta * 2;
                camera.position.z += (safePosition.z - camera.position.z) * delta * 2;



                if (ref.current) {
                    ref.current.target.x += (targetPosition.x - ref.current.target.x) * delta * 2;
                    ref.current.target.y += (targetPosition.y - ref.current.target.y) * delta * 2;
                    ref.current.target.z += (targetPosition.z - ref.current.target.z) * delta * 2;
                    ref.current.update();
                }

                if (camera.position.distanceTo(safePosition) < 0.7) {
                    setTargetPosition(null)
                }

            }
        });
    }

    useFrame(() => {
        const frustum = new Frustum();
        const cameraMatrix = new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(cameraMatrix);

        const newVisibleNodes = new Set<number>();
        nodes.forEach((node:any) => {
            const nodePosition = new Vector3(...node.position);
            if (frustum.containsPoint(nodePosition)) {
                newVisibleNodes.add(node.id);
            }
        });
        setVisibleNodesCamera(newVisibleNodes);
    });

    useFrame(() => {
        setNodeLODs((prevLODs) => {
            const newLODs: { [key: number]: "high" | "medium" | "low" } = {};
            nodes.forEach((node:any) => {
                newLODs[node.id] = getNodeLOD(new Vector3(...node.position), camera);
            });
            return newLODs;
        });
    });
    function normalizeString(str:string) {
        return str
            .normalize("NFD") // Décompose les caractères accentués
            .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
            .toLowerCase(); // Convertit en minuscules
    }

    MoveCamera()
    // 📌 Gestion du déplacement de la caméra (zoom progressif vers le nœud sélectionné)
    useEffect(()=> {
        console.table(nodes.map(node => ({id: node.id,x: node.position[0], y:node.position[1],z:node.position[2]})));
    },[]
)

    return (
        <group onPointerMissed={handleCanvasClick}>
            {/* 🔴 Nœuds */}
            {
                nodes
                .filter(node => filters[normalizeString(node.typeMath) as keyof typeof filters] && visibleNodesCamera.has(node.id))
                    .map((node) => (


                <Node
                    key={node.id}
                    id={node.id}
                    position={node.position as [number, number, number]}
                    color={getNodeColor(normalizeString(node.typeMath), colors)}
                    nom={node.nom}
                    isSelected={node.id === selectedNodeId}
                    onClick={() => {
                        setSelectedNodeId(node.id);
                        setTargetPosition(new Vector3(...node.position));
                    }}
                    debug={debugMode}
                    detailLevel={nodeLODs[node.id] || "high"} // Transmet le LOD au nœud

                />

            ))}

            {/* 🔵 Arêtes */}
            {edges
                .filter(edge => {
                    const startNode = visibleNodes.find(node => node.id === edge.start);
                    const endNode = visibleNodes.find(node => node.id === edge.end);

                    return startNode && endNode && visibleNodesCamera.has(edge.start) &&
                        visibleNodesCamera.has(edge.end) ; // On garde l'arête seulement si les 2 nœuds existent
                })
                .map((edge, index) => {
                    const startNode = visibleNodes.find(node => node.id === edge.start)!;
                    const endNode = visibleNodes.find(node => node.id === edge.end)!;
                    return (
                        <Edge
                            key={index}
                            start={startNode.position}
                            end={endNode.position}
                            type={edge.type}
                            color={colorSides}
                            debug={debugMode}
                        />
                    );
                })
            }

            {/* ℹ️ Affichage des détails du nœud sélectionné */}
            {selectedNode && (
                <NodeDetails
                    position={selectedNode.position}
                    nom={selectedNode.nom}
                    typeMath={selectedNode.typeMath}
                />
            )}
        </group>
    );
}
