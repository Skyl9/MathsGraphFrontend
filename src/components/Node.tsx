import React, {useState, useRef, useMemo} from "react";
import { Text } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { PointerEvent } from "react";
import {useTheme} from "@mui/material";

interface NodeProps {
    id: number;
    position: [number, number, number];
    color: string;
    nom: string;
    isSelected: boolean;
    onClick: () => void;
    debug: boolean;
}

export default function Node({ id, position, color, isSelected, nom, onClick, debug }: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const sphereSize = 0.3;
    const meshRef = useRef<Mesh<any, MeshStandardMaterial>>(null);
    const theme = useTheme();

    // Détermine la couleur en fonction du thème
    const nodeColor = useMemo(() => {
        return theme.palette.primary.main; // Couleur primaire du thème
    }, [theme]);

    return (
        <group position={position} onClick={onClick}
               onPointerOver={(event: PointerEvent<HTMLCanvasElement>) => {
                   event.stopPropagation();
                   setHovered(true);
               }}
               onPointerOut={(event: PointerEvent<HTMLCanvasElement>) => {
                   event.stopPropagation();
                   setHovered(false);
               }}
        >
            <mesh ref={meshRef}>
                <sphereGeometry args={[sphereSize, 16, 16]} />
                <meshStandardMaterial color={hovered ? "#99C2FF" : color} emissive={isSelected ? "#99c2ff" : color} />
            </mesh>
            <Text position={[0, sphereSize + 0.2, 0]} fontSize={0.3} color={nodeColor} anchorX="center" anchorY="middle">
                {nom}
            </Text>
            {debug && (
                <mesh>
                    <sphereGeometry args={[sphereSize * 0.7, 16, 16]} />
                    <meshBasicMaterial color="red" wireframe />
                </mesh>
            )}
        </group>
    );
}