import { useState, useRef, useMemo, memo, useEffect } from "react";
import { Billboard, Text } from "@react-three/drei";
import { Mesh, Group, Vector3, SphereGeometry } from "three";
import { PointerEvent } from "react";
import { useTheme } from "@mui/material";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";
import { getNodeMaterial } from "../utils/materialCache";

// Optimisation R3F: Instanciation unique des géométries pour éviter la duplication et les fuites VRAM
const nodeGeometry = new SphereGeometry(0.3, 24, 24);
const hitboxGeometry = new SphereGeometry(0.3 * 0.7, 16, 16);

export interface CustomNodeData {
  mesh: Mesh;
  billboard: Group;
  pos: Vector3;
  targetScale: number;
  shouldShowBase: boolean;
  isFarShow: boolean;
  currentScaleObj: { value: number };
}

interface NodeProps {
  position: [number, number, number];
  color: string;
  nom: string;
  isSelected: boolean;
  onClick: (id: number) => void;
  debug: boolean;
  isNeighbor?: boolean;
  scale?: number;
  isFiltered?: boolean;
  onHoverStart?: (id: number) => void;
  onHoverEnd?: () => void;
  id: number;
  registerNode?: (id: number, data: CustomNodeData) => void;
  unregisterNode?: (id: number) => void;
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
  onHoverEnd,
  id,
  registerNode,
  unregisterNode,
}: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const sphereSize = 0.3;
  const meshRef = useRef<Mesh>(null);
  const billboardRef = useRef<Group>(null);
  const theme = useTheme();

  const graphTheme = useUIStore((s) => s.graphTheme);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);

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
  const shouldDim =
    isFocus && selectedNodeId !== null && !isSelected && !isNeighbor;
  const opacity = shouldDim ? 0.15 : 1;

  const tempV = useMemo(() => new Vector3(...position), [position]);
  const currentScaleObj = useRef({ value: isFiltered ? 0.0 : scale });

  // Expose data to parent for central useFrame
  const targetScaleVal = isFiltered ? 0.0 : scale;
  const shouldShowBase = !shouldDim || hovered;
  const isFarShow = isSelected || hovered;

  useEffect(() => {
    if (meshRef.current && billboardRef.current && registerNode) {
      registerNode(id, {
        mesh: meshRef.current,
        billboard: billboardRef.current,
        pos: tempV,
        targetScale: targetScaleVal,
        shouldShowBase,
        isFarShow,
        currentScaleObj: currentScaleObj.current,
      });
    }
    return () => {
      if (unregisterNode) unregisterNode(id);
    };
  }, [
    id,
    targetScaleVal,
    shouldShowBase,
    isFarShow,
    tempV,
    registerNode,
    unregisterNode,
  ]);

  const isInteractive = !isFiltered && currentScaleObj.current.value > 0.1;

  const material = useMemo(() => {
    return getNodeMaterial(
      color,
      hovered,
      isSelected,
      isNeon,
      isFiltered,
      opacity,
    );
  }, [color, hovered, isSelected, isNeon, isFiltered, opacity]);

  return (
    <group
      position={position}
      onClick={() => {
        if (!isInteractive) return;
        onClick(id);
      }}
      onPointerOver={(event: PointerEvent<HTMLCanvasElement>) => {
        if (!isInteractive) return;
        event.stopPropagation();
        setHovered(true);
        if (onHoverStart) onHoverStart(id);
      }}
      onPointerOut={(event: PointerEvent<HTMLCanvasElement>) => {
        if (!isInteractive) return;
        event.stopPropagation();
        setHovered(false);
        if (onHoverEnd) onHoverEnd();
      }}
    >
      <mesh ref={meshRef} geometry={nodeGeometry} material={material} />

      <Billboard ref={billboardRef} position={[0, sphereSize * scale + 0.3, 0]}>
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
        <mesh
          scale={[scale, scale, scale]}
          geometry={hitboxGeometry}
          visible={!isFiltered}
        >
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      )}
    </group>
  );
});

export default Node;
