import React, { useEffect, useMemo, useState, useCallback } from "react";
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";
import Node from "./Node";
import Edge from "./Edge";
import NodeDetails from "./NodeDetails";
import {useAppContext} from "../AppContext";


// 📌 Fonction pour obtenir la couleur d'un nœud
const getNodeColor = (typeMath: string, colors: string[]): string => {
    if (typeMath === "axiome") return colors[1];
    if (typeMath === "théorème") return colors[2];
    if (typeMath === "lemme") return colors[0];
    return "purple";
};

export default function Scene() {
    const {colorLemme,
        colorAxiome,
        colortheoreme,
        graphData,
        filters,
        isPosInitial,
        setIsPosInitial,
        setInitialPosition,
        selectedNodeId,
        setSelectedNodeId,
        targetPosition,
        setHistory,
        currentIndex,
        setCurrentIndex,
        ref,
        history,
        setDebugMode,
        debugMode,
        setTargetPosition,
        colorSides,
    } = useAppContext();

    const { camera, gl } = useThree();
    const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
    const edges = useMemo(() => graphData?.edges ?? [], [graphData]);

    const colors = useMemo(() => [colorLemme, colorAxiome, colortheoreme], [
        colorLemme,
        colorAxiome,
        colortheoreme
    ]);

    const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId), [
        nodes,
        selectedNodeId
    ]);

    // Calcul des noeuds visibles en fonction des filtres
    const visibleNodes = useMemo(() => {
        return nodes.filter((node) => filters[node.typeMath as keyof typeof filters] ?? false);
    }, [nodes, filters]);

    // Gestion des événements clavier pour contrôler la caméra
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!camera || !event) return;

            const velocity = new Vector3(0, 0, 0);
            if (event.key === "z") velocity.z -= 1; // Avancer
            if (event.key === "s") velocity.z += 1; // Reculer
            if (event.key === "q") velocity.x -= 1; // Gauche
            if (event.key === "d") velocity.x += 1; // Droite

            camera.position.add(velocity);
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown); // Nettoyage
        };
    }, [camera]);



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

        const velocity = new Vector3(0, 0, 0);
        const damping = 0.95; // Coefficient d'amortissement (0 = arrêt instantané, 1 = pas d'amortissement)
        const accelerationFactor = 0.1; // Intensité du mouvement

        useFrame(() => {
            if (velocity.lengthSq() > 0.0001) {
                camera.position.add(velocity);
                velocity.multiplyScalar(damping); // Réduit progressivement la vitesse
            }
        });

        const moveCamera2 = (direction: Vector3) => {
            velocity.addScaledVector(direction, accelerationFactor);
        };

// Exemple : Déplacer avec ZQSD / WASD
        useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                const moveSpeed = new Vector3(0, 0, 0);
                if (event.key === "z") moveSpeed.z -= 1;
                if (event.key === "s") moveSpeed.z += 1;
                if (event.key === "q") moveSpeed.x -= 1;
                if (event.key === "d") moveSpeed.x += 1;

                moveSpeed.normalize().multiplyScalar(0.2); // Ajuste la force du déplacement
                moveCamera2(moveSpeed);
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }, []);






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
    /*
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
    }); */
    /*
    useFrame(() => {
        setNodeLODs((prevLODs) => {
            const newLODs: { [key: number]: "high" | "medium" | "low" } = {};
            nodes.forEach((node:any) => {
                newLODs[node.id] = getNodeLOD(new Vector3(...node.position), camera);
            });
            return newLODs;
        });
    });*/
    function normalizeString(str:string) {
        return str
            .normalize("NFD") // Décompose les caractères accentués
            .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
            .toLowerCase(); // Convertit en minuscules
    }

    MoveCamera()


    // 📌 Gestion du déplacement de la caméra (zoom progressif vers le nœud sélectionné)
    /* En cas de problème affiche tout les positions :
    useEffect(()=> {
        console.table(nodes.map(node => ({id: node.id,x: node.position[0], y:node.position[1],z:node.position[2]})));
    },[]
    )
    */
    if (!graphData) {
        return <group>Pas de données pour la scène.</group>;
    }

    return (
        <group onPointerMissed={handleCanvasClick}>
            {/* 🔴 Nœuds */}
            {
                nodes
                .filter(node => filters[normalizeString(node.typeMath) as keyof typeof filters] )
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
                />

            ))}

            {/* 🔵 Arêtes */}
            {edges
                .filter(edge => {
                    const startNode = visibleNodes.find(node => node.id === edge.start);
                    const endNode = visibleNodes.find(node => node.id === edge.end);

                    return startNode && endNode ; // On garde l'arête seulement si les 2 nœuds existent
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
