import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import graphData from "../assets/graphData.json";
import * as THREE from "three";
import {Vector3} from "three";

interface NodeData {
    id: number;
    position: [number, number, number];
    nom: string;
    typeMath: string;
}

interface EdgeData {
    start: number;
    end: number;
    type?: string;
}

interface GraphData {
    nodes: NodeData[];
    edges: EdgeData[];
}

const typedGraphData: GraphData = graphData as GraphData;

interface MapProps {
    setTargetPosition: (pos: THREE.Vector3) => void;
}

export default function Map({ setTargetPosition }: MapProps) {
    const [zoom, setZoom] = useState(0.4);
    const mapRef = useRef<HTMLDivElement>(null);

    // Gestion du zoom
    const handleWheel = (event: React.WheelEvent) => {
        setZoom((prevZoom) => Math.max(0.2, Math.min(5, prevZoom - event.deltaY * 0.005)));
    };

    function setSafeTargetPosition(pos : Vector3){
        const safePosition = pos.clone().add(new Vector3(0, 0, 5));
        //setTargetPosition(safePosition);
    }

    return (
        <div
            ref={mapRef}
            style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 150,
                height: 150,
                border: "2px solid white",
                background: "rgba(0, 0, 0, 0.5)",
            }}
            onWheel={handleWheel}
        >
            <Canvas>
                {/* Caméra orthographique pour la mini-carte */}
                <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50 * zoom} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {typedGraphData.nodes.map((node) => (
                    <mesh
                        key={node.id}
                        position={node.position}
                        onClick={() => setSafeTargetPosition(new THREE.Vector3(...node.position))}
                    >
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshBasicMaterial color="white" />
                    </mesh>
                ))}

                {typedGraphData.edges.map((edge, index) => {
                    const startNode = typedGraphData.nodes.find((node) => node.id === edge.start);
                    const endNode = typedGraphData.nodes.find((node) => node.id === edge.end);
                    if (!startNode || !endNode) return null;

                    return (
                        <line key={index}>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position"
                                    args={[
                                        new Float32Array([...startNode.position, ...endNode.position]),
                                        3,
                                    ]}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial color="white" />
                        </line>
                    );
                })}
            </Canvas>
        </div>
    );
}
