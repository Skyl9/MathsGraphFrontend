import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState, useRef, memo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import { Vector3, Quaternion, ConeGeometry, BoxGeometry, Mesh } from "three";
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

  // Sélection reste réactive (le clic est rare, le re-rendu global est acceptable)
  const isSelectedHighlighted = useGraphStore(
    (s) =>
      s.selectedNodeId !== null &&
      (startId === s.selectedNodeId || endId === s.selectedNodeId),
  );
  const hasSelection = useGraphStore((s) => s.selectedNodeId !== null);

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

  // Fonctions statiques pour le calcul des propriétés matérielles
  const getActiveColor = (
    hoveredId: number | null,
    isLocalHovered: boolean,
  ) => {
    const isHoverHighlighted =
      hoveredId !== null && (startId === hoveredId || endId === hoveredId);
    const isAnyNodeHovered = hoveredId !== null;

    if (isLocalHovered || isHoverHighlighted) return "#38bdf8";
    if (isAnyNodeHovered) return darkMode ? "#1e293b" : "#e2e8f0";
    if (isSelectedHighlighted) return "#38bdf8";
    return isNeon &&
      (color === "black" || color === "#888888" || color === "#ffffff")
      ? "#ffffff"
      : color;
  };

  const getFinalOpacity = (hoveredId: number | null) => {
    if (isFiltered) return 0;
    const isHoverHighlighted =
      hoveredId !== null && (startId === hoveredId || endId === hoveredId);
    const isAnyNodeHovered = hoveredId !== null;

    if (isAnyNodeHovered) {
      return isHoverHighlighted ? 1.0 : 0.08;
    }
    if (isSelectedHighlighted) return 1.0;

    const isFocus = graphTheme === "focus";
    return isFocus && hasSelection && !isSelectedHighlighted ? 0.1 : 1.0;
  };

  const getFinalLineWidth = (
    hoveredId: number | null,
    isLocalHovered: boolean,
  ) => {
    const isHoverHighlighted =
      hoveredId !== null && (startId === hoveredId || endId === hoveredId);
    const isAnyNodeHovered = hoveredId !== null;

    if (isLocalHovered || isHoverHighlighted) return 3.5;
    if (isAnyNodeHovered) return isNeon ? 2.0 : 1.5;
    if (isSelectedHighlighted) return 3.5;
    return isNeon ? 2.0 : 1.5;
  };

  const arrowRef1 = useRef<Mesh>(null);
  const arrowRef2 = useRef<Mesh>(null);

  // Valeurs initiales pour le premier rendu
  const initialHoveredId = useGraphStore.getState().hoveredNodeId;
  const initialColor = getActiveColor(initialHoveredId, hovered);
  const initialOpacity = getFinalOpacity(initialHoveredId);
  const initialLineWidth = getFinalLineWidth(initialHoveredId, hovered);

  useFrame(() => {
    const hoveredNodeId = useGraphStore.getState().hoveredNodeId;
    const activeColStr = getActiveColor(hoveredNodeId, hovered);
    const finalOp = getFinalOpacity(hoveredNodeId);
    const finalWidth = getFinalLineWidth(hoveredNodeId, hovered);

    if (lineRef.current && lineRef.current.material) {
      lineRef.current.material.color.set(activeColStr);
      lineRef.current.material.opacity = finalOp;
      lineRef.current.material.linewidth = finalWidth;
    }

    const arrMat = getEdgeMaterial(activeColStr, isNeon, finalOp);
    if (arrowRef1.current) {
      arrowRef1.current.material = arrMat;
      arrowRef1.current.visible = finalOp > 0.1;
    }
    if (arrowRef2.current) {
      arrowRef2.current.material = arrMat;
      arrowRef2.current.visible = finalOp > 0.1;
    }
  });

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
        getMultiplier: () => {
          const hoveredId = useGraphStore.getState().hoveredNodeId;
          const isHoverHighlighted =
            hoveredId !== null &&
            (startId === hoveredId || endId === hoveredId);
          return hovered || isHoverHighlighted || isSelectedHighlighted
            ? 2.5
            : 1.0;
        },
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
    isSelectedHighlighted,
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

  const initialArrowMaterial = useMemo(() => {
    return getEdgeMaterial(initialColor, isNeon, initialOpacity);
  }, [initialColor, isNeon, initialOpacity]);

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
        color={initialColor}
        lineWidth={initialLineWidth}
        transparent={true}
        opacity={initialOpacity}
        toneMapped={!isNeon} // Permet au Bloom d'ignorer la correction colorimétrique
        dashed={isAnimatedDash}
        dashScale={1}
        dashSize={dashSize}
        gapSize={gapSize}
      />

      {/* 2. La pointe de la flèche (Cone) */}
      <mesh
        ref={arrowRef1}
        position={endOffset}
        quaternion={arrowQuaternion}
        geometry={arrowGeometry}
        material={initialArrowMaterial}
        visible={initialOpacity > 0.1}
      />

      {/* Optionnel : Flèche retour si équivalence ou reciproque */}
      {(type === "equivalence" || type === "reciproque") && (
        <mesh
          ref={arrowRef2}
          position={startOffset}
          quaternion={reverseArrowQuaternion}
          geometry={arrowGeometry}
          material={initialArrowMaterial}
          visible={initialOpacity > 0.1}
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
