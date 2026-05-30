import {useState, useRef, useMemo, memo} from "react";
import {Billboard, Text} from "@react-three/drei";
import { Mesh, MeshStandardMaterial, Group, Vector3, MathUtils } from "three";
import { PointerEvent } from "react";
import {useTheme} from "@mui/material";
import {useFrame} from "@react-three/fiber";
import {useUIStore} from "../stores/useUIStore";
import {useGraphStore} from "../stores/useGraphStore";

interface NodeProps {
    position: [number, number, number];
    color: string;
    nom: string;
    isSelected: boolean;
    onClick: () => void;
    debug: boolean;
    isNeighbor?: boolean;
    scale?: number;
    isFiltered?: boolean;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
}

const Node = memo(function Node({ 
    position, 
    color, 
    isSelected, 
    nom, 
    onClick, 
    debug, 
    isNeighbor = false, 
    scale = 1,
    isFiltered = false,
    onHoverStart,
    onHoverEnd
}: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const sphereSize = 0.3;
    const meshRef = useRef<Mesh<any, MeshStandardMaterial>>(null);
    const billboardRef = useRef<Group>(null);
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

    const tempV = useMemo(() => new Vector3(...position), [position]);
    const currentScaleRef = useRef(isFiltered ? 0.0 : scale);

    useFrame(({ camera }) => {
        // LERP doux pour l'échelle (scale-to-0 si filtré)
        const targetScaleVal = isFiltered ? 0.0 : scale;
        currentScaleRef.current = MathUtils.lerp(currentScaleRef.current, targetScaleVal, 0.15);

        // Applique l'échelle dynamique au mesh R3F
        if (meshRef.current) {
            meshRef.current.scale.set(currentScaleRef.current, currentScaleRef.current, currentScaleRef.current);
        }

        if (billboardRef.current) {
            const dist = camera.position.distanceTo(tempV);
            const isFar = dist > 35;
            const isScaleTiny = currentScaleRef.current < 0.1;
            
            // Masque le texte si filtré ou si trop loin (sauf sélection/survol)
            const shouldShowText = !isScaleTiny && (!shouldDim || hovered) && (isSelected || hovered || !isFar);
            billboardRef.current.visible = shouldShowText;
        }
    });

    const isInteractive = !isFiltered && currentScaleRef.current > 0.1;

    return (
        <group position={position} 
               onClick={() => {
                   if (!isInteractive) return;
                   onClick();
               }}
               onPointerOver={(event: PointerEvent<HTMLCanvasElement>) => {
                   if (!isInteractive) return;
                   event.stopPropagation();
                   setHovered(true);
                   if (onHoverStart) onHoverStart();
               }}
               onPointerOut={(event: PointerEvent<HTMLCanvasElement>) => {
                   if (!isInteractive) return;
                   event.stopPropagation();
                   setHovered(false);
                   if (onHoverEnd) onHoverEnd();
               }}
        >
            <mesh ref={meshRef}>
                <sphereGeometry args={[sphereSize, 24, 24]} />
                <meshPhysicalMaterial
                    color={hovered ? "#99C2FF" : color}
                    emissive={isNeon || isSelected ? (hovered ? "#99C2FF" : color) : "black"}
                    emissiveIntensity={isNeon ? (isSelected ? 3 : 1.5) : (isSelected ? 1.5 : 0)}
                    transparent={true}
                    opacity={isFiltered ? 0 : opacity}
                    roughness={0.15}
                    metalness={0.2}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    transmission={0.3} // Aspect vitreux/dépoli
                    ior={1.5}
                />
            </mesh>

            <Billboard ref={billboardRef} position={[0, (sphereSize * scale) + 0.3, 0]}>
                <Text 
                    fontSize={0.28} 
                    color={labelColor} 
                    anchorX="center" 
                    anchorY="middle"
                >
                    {nom}
                </Text>
            </Billboard>

            {debug && (
                <mesh scale={[scale, scale, scale]}>
                    <sphereGeometry args={[sphereSize * 0.7, 16, 16]} />
                    <meshBasicMaterial color="red" wireframe />
                </mesh>
            )}
        </group>
    );
});

export default Node;