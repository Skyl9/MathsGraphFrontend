// src/components/Node.tsx
import React, {useState} from "react";
import {Text} from "@react-three/drei";
import {useThree} from "@react-three/fiber";


interface NodeProps {
    id : number;
    position: [number, number, number];
    color: string;
    nom: string;
    isSelected : boolean;
    onClick: () => void;
    debug : boolean;
    detailLevel:any
}

export default function Node({ id, position, color,isSelected, nom,onClick,debug,detailLevel }: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const { camera } = useThree();
    const [pos, setPos] = useState(position);
    const sphereSize = detailLevel === "high" ? 0.3 : detailLevel === "medium" ? 0.2 : 0.1;
    const textVisible = detailLevel === "high";

    return (
        <group position={pos}
               onClick = {onClick}
               onPointerOver={() => setHovered(true)}
               onPointerOut={() => setHovered(false)}
        >
            <mesh>
                <sphereGeometry args={[sphereSize, 16, 16]}/>
                <meshStandardMaterial color={hovered ? "lightblue" : color } emissive={isSelected ? "yellow" : "black"} />
            </mesh>{textVisible &&
            <Text position={[0, 0.4, 0]} fontSize={0.3} color="white">
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
