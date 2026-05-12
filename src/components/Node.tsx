import React, {useState, useRef, useMemo} from "react";
import {Billboard, Text} from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { PointerEvent } from "react";
import {useTheme} from "@mui/material";
import {useAppContext} from "../contexts/AppContext.tsx";

interface NodeProps {
    id: number;
    position: [number, number, number];
    color: string;
    nom: string;
    isSelected: boolean;
    onClick: () => void;
    debug: boolean;
    isNeighbor?: boolean;
}

export default function Node({ id, position, color, isSelected, nom, onClick, debug,isNeighbor = false }: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const sphereSize = 0.3;
    const meshRef = useRef<Mesh<any, MeshStandardMaterial>>(null);
    const theme = useTheme();

    const { graphTheme, selectedNodeId } = useAppContext();

    // Détermine la couleur en fonction du thème
    const nodeColor = useMemo(() => {
        return theme.palette.primary.main; // Couleur primaire du thème
    }, [theme]);

    const isNeon = graphTheme === "neon";
    const isFocus = graphTheme === "focus";
    const shouldDim = isFocus && selectedNodeId !== null && !isSelected && !isNeighbor;
    const opacity = shouldDim ? 0.15 : 1;
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
                <meshStandardMaterial
                    color={hovered ? "#99C2FF" : color}
                    // 🌟 MODIFIÉ : Gestion de l'émission lumineuse et de la transparence
                    emissive={isNeon || isSelected ? (hovered ? "#99C2FF" : color) : "black"}
                    emissiveIntensity={isNeon ? (isSelected ? 3 : 1.5) : (isSelected ? 1 : 0)}
                    transparent={true}
                    opacity={opacity}
                />
            </mesh>

            {/* On cache le texte des nœuds lointains en mode focus pour désencombrer l'écran */}
            {(!shouldDim || hovered) && (
                <Billboard position={[0, sphereSize + 0.4, 0]}>
                    <Text fontSize={0.3} color={nodeColor} anchorX="center" anchorY="middle">
                        {nom}
                    </Text>
                </Billboard>
            )}

            {debug && (
                <mesh>
                    <sphereGeometry args={[sphereSize * 0.7, 16, 16]} />
                    <meshBasicMaterial color="red" wireframe />
                </mesh>
            )}
        </group>
    );
}