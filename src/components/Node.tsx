import { useState, useRef, useMemo, memo, useEffect } from "react";
import { Mesh, Vector3, SphereGeometry } from "three";
import { PointerEvent } from "react";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";
import { getNodeMaterial } from "../utils/materialCache";

// Optimisation R3F: Instanciation unique des géométries pour éviter la duplication et les fuites VRAM
const nodeGeometry = new SphereGeometry(0.3, 24, 24);
const hitboxGeometry = new SphereGeometry(0.3 * 0.7, 16, 16);

export interface CustomNodeData {
  mesh: Mesh;
  pos: Vector3;
  targetScale: number;
  currentScaleObj: { value: number };
}

interface NodeProps {
  position: [number, number, number];
  color: string;
  nom: string;
  onClick: (id: number) => void;
  debug: boolean;
  adjacencyList: Map<number, number[]>;
  scale?: number;
  isFiltered?: boolean;
  onHoverStart?: (id: number) => void;
  onHoverEnd?: () => void;
  id: number;
  registerNode?: (id: number, data: CustomNodeData) => void;
  unregisterNode?: (id: number) => void;
}

const areNodesEqual = (prev: NodeProps, next: NodeProps) => {
  return (
    prev.id === next.id &&
    prev.color === next.color &&
    prev.adjacencyList === next.adjacencyList &&
    prev.scale === next.scale &&
    prev.isFiltered === next.isFiltered &&
    prev.debug === next.debug &&
    prev.nom === next.nom &&
    prev.position[0] === next.position[0] &&
    prev.position[1] === next.position[1] &&
    prev.position[2] === next.position[2]
  );
};

const Node = memo(function Node({
  position,
  color,
  onClick,
  debug,
  adjacencyList,
  scale = 1,
  isFiltered = false,
  onHoverStart,
  onHoverEnd,
  id,
  registerNode,
  unregisterNode,
}: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null);

  const graphTheme = useUIStore((s) => s.graphTheme);
  const isSelected = useGraphStore((s) => s.selectedNodeId === id);
  const hasSelection = useGraphStore((s) => s.selectedNodeId !== null);
  const isNeighbor = useGraphStore(
    (s) =>
      s.selectedNodeId !== null &&
      (adjacencyList.get(s.selectedNodeId)?.includes(id) ?? false),
  );

  const isNeon = graphTheme === "neon";
  const isFocus = graphTheme === "focus";
  const shouldDim = isFocus && hasSelection && !isSelected && !isNeighbor;
  const opacity = shouldDim ? 0.15 : 1;

  const tempV = useMemo(() => new Vector3(...position), [position]);
  const currentScaleObj = useRef({ value: isFiltered ? 0.0 : scale });
  const groupRef = useRef<import("three").Group>(null);

  const [posX, posY, posZ] = position;

  useEffect(() => {
    if (groupRef.current) {
      import("gsap").then((gsap) => {
        if (!groupRef.current) return;
        gsap.default.to(groupRef.current.position, {
          x: posX,
          y: posY,
          z: posZ,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    }
  }, [posX, posY, posZ]);

  // Expose data to parent for central useFrame scale lerping
  const targetScaleVal = isFiltered ? 0.0 : scale;

  useEffect(() => {
    if (meshRef.current && registerNode) {
      registerNode(id, {
        mesh: meshRef.current,
        pos: tempV,
        targetScale: targetScaleVal,
        currentScaleObj: currentScaleObj.current,
      });
    }
    return () => {
      if (unregisterNode) unregisterNode(id);
    };
  }, [id, targetScaleVal, tempV, registerNode, unregisterNode]);

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
      ref={groupRef}
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
}, areNodesEqual);

export default Node;
