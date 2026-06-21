import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState, useRef, memo, useEffect } from "react";
import { Line, Html } from "@react-three/drei";
import { Vector3, Quaternion, ConeGeometry, BoxGeometry } from "three";
import { Line2 } from "three-stdlib";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";
import { getEdgeMaterial } from "../utils/materialCache";
import MathMarkdown from "./MathMarkdown";

// Optimisation R3F: Instanciation unique de la géométrie pour éviter de cloner 1000+ ConeGeometry (Fuite VRAM)
const arrowGeometry = new ConeGeometry(0.08, 0.2, 8);
const hitboxGeometry = new BoxGeometry(0.2, 0.2, 0.2);
const UP_Y = new Vector3(0, 1, 0);

export interface EdgeDataRef {
  lineRef: React.MutableRefObject<Line2 | null>;
  isAnimatedDash: boolean;
  type: string;
  getMultiplier: () => number;
}

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
  registerEdge?: (id: string, data: EdgeDataRef) => void;
  unregisterEdge?: (id: string) => void;
}

const areEdgesEqual = (prev: EdgeProps, next: EdgeProps) => {
  return (
    prev.startId === next.startId &&
    prev.endId === next.endId &&
    prev.color === next.color &&
    prev.type === next.type &&
    prev.debug === next.debug &&
    prev.startScale === next.startScale &&
    prev.endScale === next.endScale &&
    prev.isStartFiltered === next.isStartFiltered &&
    prev.isEndFiltered === next.isEndFiltered &&
    prev.start[0] === next.start[0] &&
    prev.start[1] === next.start[1] &&
    prev.start[2] === next.start[2] &&
    prev.end[0] === next.end[0] &&
    prev.end[1] === next.end[1] &&
    prev.end[2] === next.end[2]
  );
};

const Edge = memo(function Edge({
  start,
  end,
  color = "#888888",
  type,
  debug,
  startScale = 1,
  endScale = 1,
  isStartFiltered = false,
  isEndFiltered = false,
  startId,
  endId,
  registerEdge,
  unregisterEdge,
}: EdgeProps) {
  const theme = useTheme();
  const graphTheme = useUIStore((s) => s.graphTheme);
  const darkMode = useUIStore((s) => s.darkMode);

  // Lecture de l'état de survol et de sélection (Sélecteurs optimisés au grain fin)
  const isHoverHighlighted = useGraphStore(
    (s) =>
      s.hoveredNodeId !== null &&
      (startId === s.hoveredNodeId || endId === s.hoveredNodeId),
  );
  const isSelectedHighlighted = useGraphStore(
    (s) =>
      s.selectedNodeId !== null &&
      (startId === s.selectedNodeId || endId === s.selectedNodeId),
  );
  const isAnyNodeHovered = useGraphStore((s) => s.hoveredNodeId !== null);
  const isHighlighted = isHoverHighlighted || isSelectedHighlighted;

  const [hovered, setHovered] = useState(false);
  const lineRef = useRef<Line2>(null);

  const isFiltered = isStartFiltered || isEndFiltered;

  // Calculs géométriques pour éviter que la ligne ne rentre à l'intérieur de la sphère
  const {
    startOffset,
    endOffset,
    midPoint,
    length,
    arrowQuaternion,
    reverseArrowQuaternion,
  } = useMemo(() => {
    const s = new Vector3(...start);
    const e = new Vector3(...end);
    const dir = e.clone().sub(s).normalize();
    const len = s.distanceTo(e);

    // Rayon dynamique basé sur l'échelle des nœuds connectés
    const startRadius = 0.3 * startScale;
    const endRadius = 0.3 * endScale;

    // On décale le début et la fin
    const sOff = s.clone().add(dir.clone().multiplyScalar(startRadius));
    const eOff = e.clone().add(dir.clone().multiplyScalar(-endRadius - 0.15)); // -0.15 laisse la place à la pointe de la flèche
    const mid = new Vector3().lerpVectors(sOff, eOff, 0.5);

    const arrowQuat = new Quaternion().setFromUnitVectors(UP_Y, dir);
    const reverseArrowQuat = new Quaternion().setFromUnitVectors(
      UP_Y,
      dir.clone().negate(),
    );

    return {
      startOffset: sOff,
      endOffset: eOff,
      direction: dir,
      midPoint: mid,
      length: len,
      arrowQuaternion: arrowQuat,
      reverseArrowQuaternion: reverseArrowQuat,
    };
  }, [start, end, startScale, endScale]);

  const isNeon = graphTheme === "neon";

  // Couleur dynamique d'arête : highlight au survol ou à la sélection
  const activeColor = useMemo(() => {
    if (hovered || isHoverHighlighted) return "#38bdf8";
    if (isAnyNodeHovered) return darkMode ? "#1e293b" : "#e2e8f0";
    if (isSelectedHighlighted) return "#38bdf8";
    return isNeon &&
      (color === "black" || color === "#888888" || color === "#ffffff")
      ? "#ffffff"
      : color;
  }, [
    hovered,
    isAnyNodeHovered,
    isHoverHighlighted,
    isSelectedHighlighted,
    isNeon,
    color,
    darkMode,
  ]);

  const hasSelection = useGraphStore((s) => s.selectedNodeId !== null);

  // Opacité dynamique au survol et filtrage
  const finalOpacity = useMemo(() => {
    if (isFiltered) return 0;
    if (isAnyNodeHovered) {
      return isHoverHighlighted ? 1.0 : 0.08;
    }
    if (isSelectedHighlighted) return 1.0;

    const isFocus = graphTheme === "focus";
    return isFocus && hasSelection && !isSelectedHighlighted ? 0.1 : 1.0;
  }, [
    isFiltered,
    isAnyNodeHovered,
    isHoverHighlighted,
    isSelectedHighlighted,
    graphTheme,
    hasSelection,
  ]);

  // Épaisseur de ligne dynamique
  const finalLineWidth = useMemo(() => {
    if (hovered || isHoverHighlighted) return 3.5;
    if (isAnyNodeHovered) return isNeon ? 2.0 : 1.5;
    if (isSelectedHighlighted) return 3.5;
    return isNeon ? 2.0 : 1.5;
  }, [
    hovered,
    isAnyNodeHovered,
    isHoverHighlighted,
    isSelectedHighlighted,
    isNeon,
  ]);

  // Détermination du style de ligne (Solid vs Dashed animé pour les implications/équivalences)
  const isAnimatedDash =
    type === "implication" || type === "reciproque" || type === "equivalence";
  const dashSize = type === "equivalence" ? 0.6 : 0.3;
  const gapSize = type === "equivalence" ? 0.15 : 0.2;

  // Enregistrement pour la boucle useFrame centralisée dans Scene.tsx
  useEffect(() => {
    const edgeId = `${startId}-${endId}`;
    if (registerEdge) {
      registerEdge(edgeId, {
        lineRef,
        isAnimatedDash,
        type: type || "",
        getMultiplier: () => (hovered || isHighlighted ? 2.5 : 1.0),
      });
    }
    return () => {
      if (unregisterEdge) unregisterEdge(edgeId);
    };
  }, [
    startId,
    endId,
    isAnimatedDash,
    type,
    hovered,
    isAnyNodeHovered,
    isHighlighted,
    registerEdge,
    unregisterEdge,
  ]);

  // Formule LaTeX selon la sémantique de relation
  const mathFormula = useMemo(() => {
    if (type === "implication") return "$A \\implies B$";
    if (type === "reciproque") return "$B \\implies A$";
    if (type === "equivalence") return "$A \\iff B$";
    if (type === "utilise") return "$A \\supset B$";
    return `$A \\text{ ${type} } B$`;
  }, [type]);

  const arrowMaterial = useMemo(() => {
    return getEdgeMaterial(activeColor, isNeon, finalOpacity);
  }, [activeColor, isNeon, finalOpacity]);

  // Sécurité : Si les noeuds sont trop proches ou superposés, on ne dessine rien
  if (length < 0.6) return null;

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
        material={arrowMaterial}
        visible={finalOpacity > 0.1}
      />

      {/* Optionnel : Flèche retour si équivalence ou reciproque */}
      {(type === "equivalence" || type === "reciproque") && (
        <mesh
          position={startOffset}
          quaternion={reverseArrowQuaternion}
          geometry={arrowGeometry}
          material={arrowMaterial}
          visible={finalOpacity > 0.1}
        />
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
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(8px)",
              color: darkMode ? "#E2E8F0" : "#0F172A",
              border: darkMode
                ? `1px solid ${alpha(theme.palette.divider, 0.15)}`
                : `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              padding: "4px 10px",
              borderRadius: "8px",
              boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.25)}`,
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
}, areEdgesEqual);

export default Edge;
