import React, {useEffect, useMemo, useCallback, useRef, useState} from "react";
import {useThree} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {Vector3} from "three";
import Node from "./Node";
import Edge from "./Edge";
import NodeDetails from "./NodeDetails";
import {useAppContext} from "../AppContext";
import gsap from "gsap";
import {NodeData} from "../type";


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
        targetPosition,
        setHistory,
        currentIndex,
        setCurrentIndex,
        history,
        setDebugMode,
        debugMode,
        setTargetPosition,
        colorSides,
        selectedNodeId,
        setSelectedNodeId

    } = useAppContext();




    const { camera, gl } = useThree();
    const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
    const edges = useMemo(() => graphData?.edges ?? [], [graphData]);
    const controlsRef = useRef<any>(null); // Référence pour OrbitControls
    const [shouldBeShowNode, setShouldBeShowNode] = useState(false);

    const colors = useMemo(() => [colorLemme, colorAxiome, colortheoreme], [
        colorLemme,
        colorAxiome,
        colortheoreme
    ]);

    const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId), [
        nodes,
        selectedNodeId

    ]);

    const visibleNodes = useMemo(() => {
        return nodes.filter((node) => filters[node.typeMath as keyof typeof filters] ?? false);
    }, [nodes, filters]);
    useEffect(() => {
        if (selectedNode && targetPosition && controlsRef.current) {
            setShouldBeShowNode(true)
            gsap.to(camera.position, {
                x: selectedNode.position[0] ,
                y: selectedNode.position[1] ,
                z: selectedNode.position[2] + 3,
                duration: 1.5,
                onUpdate: () => {
                    controlsRef.current.target.lerp(targetPosition, 1); // Mise à jour pendant l'animation
                    controlsRef.current.update(); // Synchronisation
                },

            });
        }
        }, [selectedNode, targetPosition, camera, controlsRef])
        
    // Calcul des noeuds visibles en fonction des filtres

    // Gestion des événements clavier pour contrôler la caméra
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (selectedNodeId === null){
                setSelectedNodeId(visibleNodes[0].id);
            }
                if (!camera || !event) {
                    console.log("Camera is null");
                    return;}
            console.log("selectedNodeId :", selectedNodeId);
            let positionListe = visibleNodes.findIndex((node: NodeData) => node.id === selectedNodeId);
                setShouldBeShowNode(true);
                if (positionListe===-1){
                    console.log("erreur de position dans la liste, élément non trouvé")
                }
                else{
                if (event.key === "d" || event.key === "right") {
                    if (positionListe > visibleNodes.length-2) {
                        setSelectedNodeId(visibleNodes[0].id);
                        setTargetPosition(new Vector3(...visibleNodes[0].position))

                    } else {
                        setSelectedNodeId(visibleNodes[positionListe + 1].id);
                        setTargetPosition(new Vector3(...visibleNodes[positionListe + 1].position))

                    }

                } // Avancer
                if (event.key === "q" || event.key === "left") {
                    if (positionListe === 0) {
                        setSelectedNodeId(visibleNodes[visibleNodes.length - 1].id);
                        setTargetPosition(new Vector3(...visibleNodes[visibleNodes.length - 1].position))
                    } else {
                        setSelectedNodeId(visibleNodes[positionListe - 1].id);
                        setTargetPosition(new Vector3(...visibleNodes[positionListe - 1].position))
                    }
                } // Reculer
            }}
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown); // Nettoyage
        };
    }, );

    useEffect(() => {
        console.log("selectedNodeId modifié :", selectedNodeId);
    }, [selectedNodeId]);

    // 📌 Active/Désactive le mode debug avec "m"
    useEffect(() => {
        const toggleDebug = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "m") {
                console.log("Debug mod activé")
                setDebugMode((prev) => !prev);
            }
        };
        window.addEventListener("keydown", toggleDebug);
        return () => window.removeEventListener("keydown", toggleDebug);
    },);

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
                history.length === 0 || (history[currentIndex] && !history[currentIndex].equals(targetPosition))
                    ? prevIndex + 1
                    : prevIndex
            );
        }
    },);



    // 📌 Gestion du clic hors nœuds (désélection)
    const handleCanvasClick = useCallback((event: MouseEvent) => {
        if (event.target === gl.domElement) {
            setShouldBeShowNode(false);
            console.log("Clic en dehors : shouldBeShowNode → false");
        }
    }, [gl]);

    useEffect(() => {
        console.log("targetPosition changé :", targetPosition);
    }, [targetPosition]);


    /*
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

    return (<>
        <group onPointerMissed={handleCanvasClick}>
            {/* 🔴 Nœuds */}
            {
                nodes
                    .filter(node => filters[node.typeMath as keyof typeof filters] )
                    .map((node) => (


                <Node
                    key={node.id}
                    id={node.id}
                    position={node.position as [number, number, number]}
                    color={getNodeColor(node.typeMath, colors)}
                    nom={node.nom}
                    isSelected={shouldBeShowNode && selectedNodeId === node.id}
                    onClick={() => {
                        console.log("Nœud sélectionné :", node.id);
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
            {selectedNode && shouldBeShowNode && (
                <NodeDetails
                    position={selectedNode.position}
                    nom={selectedNode.nom}
                    typeMath={selectedNode.typeMath}
                    id={selectedNode.id}
                />

            )}
        </group>
    <OrbitControls ref={controlsRef} enableZoom={true} maxDistance={2000} minDistance={5} />
</>
);
}
