import { useMemo, useState, useRef, memo } from "react";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { Line2 } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";
import MathMarkdown from "./MathMarkdown";

// Optimisation R3F: Instanciation unique de la géométrie pour éviter de cloner 1000+ ConeGeometry (Fuite VRAM)
const arrowGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
const hitboxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  type?: string;
  debug: boolean;
  opacity?: number;
  startScale?: number;
  endScale?: number;
  isStartFiltered?: boolean;
  isEndFiltered?: boolean;
  startId: number;
  endId: number;
}

const Edge = memo(function Edge({
  start,
  end,
  color = "#888888",
  type,
  debug,
  opacity = 1,
  startScale = 1,
  endScale = 1,
  isStartFiltered = false,
  isEndFiltered = false,
  startId,
  endId,
}: EdgeProps) {
  const graphTheme = useUIStore((s) => s.graphTheme);
  const darkMode = useUIStore((s) => s.darkMode);

  // NOUVEAU : Lecture directe de l'état de survol via Zustand pour éviter les re-renders globaux de Scene.tsx
  const hoveredNodeId = useGraphStore((s) => s.hoveredNodeId);
  const isHighlighted =
    hoveredNodeId !== null &&
    (startId === hoveredNodeId || endId === hoveredNodeId);
  const isAnyNodeHovered = hoveredNodeId !== null;

  const [hovered, setHovered] = useState(false);
  const lineRef = useRef<Line2>(null);

  const isFiltered = isStartFiltered || isEndFiltered;

  // Calculs géométriques pour éviter que la ligne ne rentre à l'intérieur de la sphère
  const { startOffset, endOffset, direction, midPoint, length } =
    useMemo(() => {
      const s = new THREE.Vector3(...start);
      const e = new THREE.Vector3(...end);
      const dir = e.clone().sub(s).normalize();
      const len = s.distanceTo(e);

      // Rayon dynamique basé sur l'échelle des nœuds connectés
      const startRadius = 0.3 * startScale;
      const endRadius = 0.3 * endScale;

      // On décale le début et la fin
      const sOff = s.clone().add(dir.clone().multiplyScalar(startRadius));
      const eOff = e.clone().add(dir.clone().multiplyScalar(-endRadius - 0.15)); // -0.15 laisse la place à la pointe de la flèche
      const mid = new THREE.Vector3().lerpVectors(sOff, eOff, 0.5);

      return {
        startOffset: sOff,
        endOffset: eOff,
        direction: dir,
        midPoint: mid,
        length: len,
      };
    }, [start, end, startScale, endScale]);

  const isNeon = graphTheme === "neon";

  // Couleur dynamique d'arête : highlight au survol
  const activeColor = useMemo(() => {
    if (hovered) return "#38bdf8";
    if (isAnyNodeHovered) {
      return isHighlighted ? "#38bdf8" : darkMode ? "#1e293b" : "#e2e8f0";
    }
    return isNeon && color === "black" ? "#ffffff" : color;
  }, [hovered, isAnyNodeHovered, isHighlighted, isNeon, color, darkMode]);

  // Opacité dynamique au survol et filtrage
  const finalOpacity = useMemo(() => {
    if (isFiltered) return 0;
    if (isAnyNodeHovered) {
      return isHighlighted ? 1.0 : 0.08;
    }
    return opacity;
  }, [isFiltered, isAnyNodeHovered, isHighlighted, opacity]);

  // Épaisseur de ligne dynamique
  const finalLineWidth = useMemo(() => {
    const base = isNeon ? 2.0 : 1.5;
    if (hovered || (isAnyNodeHovered && isHighlighted)) {
      return base * 2.0;
    }
    return base;
  }, [isNeon, hovered, isAnyNodeHovered, isHighlighted]);

  // Détermination du style de ligne (Solid vs Dashed animé pour les implications/équivalences)
  const isAnimatedDash =
    type === "implication" || type === "reciproque" || type === "equivalence";
  const dashSize = type === "equivalence" ? 0.6 : 0.3;
  const gapSize = type === "equivalence" ? 0.15 : 0.2;

  useFrame((state) => {
    if (isAnimatedDash && lineRef.current && lineRef.current.material) {
      // Accélérer l'animation d'impulsion si survolé/highlighted
      const baseSpeed = type === "equivalence" ? 1.0 : 2.0;
      const multiplier =
        hovered || (isAnyNodeHovered && isHighlighted) ? 2.5 : 1.0;
      lineRef.current.material.dashOffset =
        -state.clock.getElapsedTime() * baseSpeed * multiplier;
    }
  });

  // Formule LaTeX selon la sémantique de relation
  const mathFormula = useMemo(() => {
    if (type === "implication") return "$A \\implies B$";
    if (type === "reciproque") return "$B \\implies A$";
    if (type === "equivalence") return "$A \\iff B$";
    if (type === "utilise") return "$A \\supset B$";
    return `$A \\text{ ${type} } B$`;
  }, [type]);

  // Sécurité : Si les noeuds sont trop proches ou superposés, on ne dessine rien
  if (length < 0.6) return null;

  // Orientation de la pointe de la flèche (Le cône 3D regarde vers +Y par défaut)
  const arrowQuaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction,
  );
  const reverseArrowQuaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().negate(),
  );

  return (
    <group
      onPointerOver={(e) => {
        if (isFiltered) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        if (isFiltered) return;
        e.stopPropagation();
        setHovered(false);
      }}
    >
      {/* 1. La Ligne Principale */}
      <Line
        ref={lineRef}
        points={[startOffset.toArray(), endOffset.toArray()]}
        color={activeColor}
        lineWidth={finalLineWidth}
        transparent={true}
        opacity={finalOpacity}
        toneMapped={!isNeon} // Permet au Bloom d'ignorer la correction colorimétrique
        dashed={isAnimatedDash}
        dashScale={1}
        dashSize={dashSize}
        gapSize={gapSize}
      />

      {/* 2. La pointe de la flèche (Cone) */}
      <mesh
        position={endOffset}
        quaternion={arrowQuaternion}
        geometry={arrowGeometry}
        visible={finalOpacity > 0.1}
      >
        <meshStandardMaterial
          color={activeColor}
          emissive={isNeon ? activeColor : "black"}
          emissiveIntensity={isNeon ? 2 : 0}
          transparent={true}
          opacity={finalOpacity}
          depthWrite={false} // Evite les bugs de transparence avec la sphère
        />
      </mesh>

      {/* Optionnel : Flèche retour si équivalence ou reciproque */}
      {(type === "equivalence" || type === "reciproque") && (
        <mesh
          position={startOffset}
          quaternion={reverseArrowQuaternion}
          geometry={arrowGeometry}
          visible={finalOpacity > 0.1}
        >
          <meshStandardMaterial
            color={activeColor}
            emissive={isNeon ? activeColor : "black"}
            emissiveIntensity={isNeon ? 2 : 0}
            transparent={true}
            opacity={finalOpacity}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Infobulle LaTeX au survol (MathJax) */}
      {hovered && !isFiltered && (
        <Html
          position={midPoint.toArray()}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: darkMode
                ? "rgba(15, 23, 42, 0.9)"
                : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              color: darkMode ? "#E2E8F0" : "#0F172A",
              border: darkMode
                ? "1px solid rgba(255, 255, 255, 0.15)"
                : "1px solid rgba(15, 23, 42, 0.12)",
              padding: "4px 10px",
              borderRadius: "8px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
              whiteSpace: "nowrap",
              fontFamily: "Inter, Roboto, sans-serif",
            }}
          >
            <MathMarkdown content={mathFormula} />
          </div>
        </Html>
      )}

      {/* Hitbox debug */}
      {debug && (
        <mesh position={midPoint} geometry={hitboxGeometry}>
          <meshBasicMaterial color="green" wireframe={true} />
        </mesh>
      )}
    </group>
  );
});

export default Edge;
