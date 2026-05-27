import { useMemo, useState } from "react";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import {useUIStore} from "../stores/useUIStore";

interface EdgeProps {
    start: [number, number, number];
    end: [number, number, number];
    color?: string;
    type?: string;
    debug: boolean;
    opacity?: number;
}

export default function Edge({ start, end, color = "#888888", type, debug, opacity = 1 }: EdgeProps) {
    const graphTheme = useUIStore(s => s.graphTheme);
    const darkMode = useUIStore(s => s.darkMode);
    const [hovered, setHovered] = useState(false);
    // Calculs géométriques pour éviter que la ligne ne rentre à l'intérieur de la sphère
    const { startOffset, endOffset, direction, midPoint, length } = useMemo(() => {
        const s = new THREE.Vector3(...start);
        const e = new THREE.Vector3(...end);
        const dir = e.clone().sub(s).normalize();
        const len = s.distanceTo(e);

        const nodeRadius = 0.3; // Doit correspondre à la taille de tes noeuds dans Node.tsx

        // On décale le début et la fin
        const sOff = s.clone().add(dir.clone().multiplyScalar(nodeRadius));
        const eOff = e.clone().add(dir.clone().multiplyScalar(-nodeRadius - 0.1)); // -0.1 laisse la place à la pointe de la flèche
        const mid = new THREE.Vector3().lerpVectors(sOff, eOff, 0.5);

        return { startOffset: sOff, endOffset: eOff, direction: dir, midPoint: mid, length: len };
    }, [start, end]);

    const isNeon = graphTheme === "neon";

    // Si la couleur par défaut est "black" (ce que tu as dans AppContext), ça ne brille pas en Néon.
    // On force un blanc/bleuté si on est en Néon et que la couleur est noire.
    const baseColor = (isNeon && color === "black") ? "#ffffff" : color;
    const edgeColor = hovered ? "#99C2FF" : baseColor;

    // Sécurité : Si les noeuds sont trop proches ou superposés, on ne dessine rien
    if (length < 0.6) return null;

    // Orientation de la pointe de la flèche (Le cône 3D regarde vers +Y par défaut)
    const arrowQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    const reverseArrowQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().negate());

    return (
        <group
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
            {/* 1. La Ligne Principale */}
            <Line
                points={[startOffset.toArray(), endOffset.toArray()]}
                color={edgeColor}
                lineWidth={isNeon ? 2 : 1.5}
                transparent={true}
                opacity={opacity}
                toneMapped={!isNeon} // Permet au Bloom d'ignorer la correction colorimétrique
            />

            {/* 2. La pointe de la flèche (Cone) */}
            <mesh position={endOffset} quaternion={arrowQuaternion}>
                <coneGeometry args={[0.08, 0.2, 8]} />
                <meshStandardMaterial
                    color={edgeColor}
                    emissive={isNeon ? edgeColor : "black"}
                    emissiveIntensity={isNeon ? 2 : 0}
                    transparent={true}
                    opacity={opacity}
                    depthWrite={false} // Evite les bugs de transparence avec la sphère
                />
            </mesh>

            {/* Optionnel : Flèche retour si équivalence */}
            {type === "equivalence" && (
                <mesh position={startOffset} quaternion={reverseArrowQuaternion}>
                    <coneGeometry args={[0.08, 0.2, 8]} />
                    <meshStandardMaterial
                        color={edgeColor}
                        emissive={isNeon ? edgeColor : "black"}
                        emissiveIntensity={isNeon ? 2 : 0}
                        transparent={true}
                        opacity={opacity}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* 3. Infobulle au survol (Tooltips) */}
            {hovered && (
                <Html position={midPoint.toArray()} center style={{ pointerEvents: "none" }}>
                    <div style={{
                        background: darkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(8px)",
                        color: darkMode ? "#E2E8F0" : "#0F172A",
                        border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.08)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                        whiteSpace: "nowrap",
                        fontFamily: "Inter, Roboto, sans-serif"
                    }}>
                        {type || "Relation"}
                    </div>
                </Html>
            )}

            {/* Hitbox debug */}
            {debug && (
                <mesh position={midPoint}>
                    <boxGeometry args={[0.2, 0.2, 0.2]}/>
                    <meshBasicMaterial color="green" wireframe={true}/>
                </mesh>
            )}
        </group>
    );
}