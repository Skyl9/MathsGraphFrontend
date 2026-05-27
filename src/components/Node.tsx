import {useState, useRef, useMemo} from "react";
import {Billboard, Text} from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";
import { PointerEvent } from "react";
import {useTheme} from "@mui/material";
import {useUIStore} from "../stores/useUIStore";
import {useGraphStore} from "../stores/useGraphStore";

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

export default function Node({ position, color, isSelected, nom, onClick, debug,isNeighbor = false }: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const sphereSize = 0.3;
    const meshRef = useRef<Mesh<any, MeshStandardMaterial>>(null);
    const theme = useTheme();

    const graphTheme = useUIStore(s => s.graphTheme);
    const selectedNodeId = useGraphStore(s => s.selectedNodeId);

    // Détermine la couleur de label contrastée en fonction du thème (clair/sombre)
    const labelColor = useMemo(() => {
        if (theme.palette.mode === "dark") {
            return color === "black" ? "#ffffff" : color; 
        }
        // Assombrir les couleurs pour une meilleure lisibilité en mode clair
        if (color === "#52C575") return "#166534"; // Vert forêt
        if (color === "#AE66CC") return "#6b21a8"; // Violet royal
        if (color === "#F99D1C") return "#c2410c"; // Orange rouille
        return color === "black" ? "#0f172a" : color;
    }, [color, theme]);

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
                <sphereGeometry args={[sphereSize, 24, 24]} />
                <meshPhysicalMaterial
                    color={hovered ? "#99C2FF" : color}
                    emissive={isNeon || isSelected ? (hovered ? "#99C2FF" : color) : "black"}
                    emissiveIntensity={isNeon ? (isSelected ? 3 : 1.5) : (isSelected ? 1.5 : 0)}
                    transparent={true}
                    opacity={opacity}
                    roughness={0.15}
                    metalness={0.2}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    transmission={0.3} // Aspect vitreux/dépoli
                    ior={1.5}
                />
            </mesh>

            {/* On cache le texte des nœuds lointains en mode focus pour désencombrer l'écran */}
            {(!shouldDim || hovered) && (
                <Billboard position={[0, sphereSize + 0.4, 0]}>
                    <Text 
                        fontSize={0.28} 
                        color={labelColor} 
                        anchorX="center" 
                        anchorY="middle"
                    >
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