// src/components/Edge.tsx
import React, {useRef, useState} from "react";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface EdgeProps {
    start: [number, number, number];
    end: [number, number, number];
    color?: string;
    type?: string;
    debug: boolean;
}

export default function Edge({ start, end, color = "white", type, debug }: EdgeProps) {
    const arrowRef1 = useRef<THREE.ArrowHelper>(null);
    const arrowRef2 = useRef<THREE.ArrowHelper>(null); // Flèche retour
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const [hovered, setHovered] = useState(false);

    const direction = endVec.clone().sub(startVec).normalize();
    const length = startVec.distanceTo(endVec);
    const nodeRadius = 0.25;

    const startOffset = startVec.clone().add(direction.clone().multiplyScalar(nodeRadius));
    const endOffset = endVec.clone().add(direction.clone().multiplyScalar(-nodeRadius));

    const midPoint = new THREE.Vector3().lerpVectors(startVec, endVec, 0.5);

    useFrame(() => {
        if (arrowRef1.current) {
            arrowRef1.current.setDirection(direction);
            arrowRef1.current.position.copy(startOffset);
        }
        if (type === "équivalence" && arrowRef2.current) {
            arrowRef2.current.setDirection(direction.clone().negate());
            arrowRef2.current.position.copy(endOffset);
        }
    });

    return (
        <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            {/* Ligne optimisée */}
            <Line
                points={[startOffset.toArray(), endOffset.toArray()]}
                color={color}
                lineWidth={3}
            />

            {/* Flèche directionnelle */}
            <arrowHelper ref={arrowRef1} args={[direction, startOffset, length - 2 * nodeRadius, color, 0.5, 0.3]} />

            {/* Flèche retour pour l'équivalence */}
            {type === "équivalence" && (
                <arrowHelper ref={arrowRef2} args={[direction.clone().negate(), endOffset, length - 2 * nodeRadius, color, 0.5, 0.3]} />
            )}

            {/* Infobulle au survol */}
            {hovered && (
            <Html position={midPoint.toArray()} center>
                <div style={{ background: "white", padding: "5px", borderRadius: "5px" }}>
                    {type === "équivalence" ? "Équivalence" : "Implication"}
                </div>
            </Html>
            )}
            {/* Hitbox debug */}
            {debug && (
                <>
                    <mesh position={midPoint}>
                        <boxGeometry args={[0.2, 0.2, 0.2]}/>
                        <meshBasicMaterial color="green" wireframe/>
                    </mesh>
                </>
            )}
        </group>
    );
}