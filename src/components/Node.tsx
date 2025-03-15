// src/components/Node.tsx
import React, {useState} from "react";
import {Text} from "@react-three/drei";

interface NodeProps {
    id : number;
    position: [number, number, number];
    color: string;
    nom: string;
    isSelected : boolean;
    onClick: () => void;
    debug : boolean;
}

export default function Node({ id, position, color,isSelected, nom,onClick,debug, }: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const [pos, setPos] = useState(position);
    const sphereSize = 0.3 ;
    return (
        <group position={pos}
               onClick = {onClick}
               onPointerOver={() => setHovered(true)}
               onPointerOut={() => setHovered(false)}
        >
            <mesh>
                <sphereGeometry args={[sphereSize, 16, 16]}/>
                <meshStandardMaterial color={hovered ? "lightblue" : color } emissive={isSelected ? "yellow" : "black"} />
            </mesh>{
            <Text position={[0, 0.5, 0]} fontSize={0.3} color="white"
                  outlineWidth={0.001}  // Largeur du contour
                  outlineColor="black" // Couleur du contour
                >
                {nom}
            </Text>}
            {/* Hitbox en mode debug */}
            {debug && (
                <mesh >
                    <sphereGeometry args={[0.21, 16, 16]} />
                    <meshBasicMaterial color="red" wireframe />
                </mesh>
            )}
        </group>
    );
}
