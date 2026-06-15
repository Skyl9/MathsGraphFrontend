import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useGraphStore } from "../stores/useGraphStore";
import { useUIStore } from "../stores/useUIStore";
import { NodeData } from "../types/ApiTypes/graph";
import { useThree } from "@react-three/fiber";

const getNodePos = (
  node: NodeData,
  view: string,
): { x: number; y: number; z: number } => {
  return (
    node.position[view] ||
    node.position["grille"] ||
    node.position["physique"] || { x: 0, y: 0, z: 0 }
  );
};

interface ControlsManagerProps {
  nodes: NodeData[];
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export default function ControlsManager({
  nodes,
  controlsRef,
}: ControlsManagerProps) {
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const setTargetPosition = useGraphStore((s) => s.setTargetPosition);
  const currentView = useUIStore((s) => s.currentView);
  const debugMode = useUIStore((s) => s.debugMode);
  const setDebugMode = useUIStore((s) => s.setDebugMode);
  const { camera } = useThree();

  // Raccourcis clavier (D, Q, Arrow)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (nodes.length === 0) return;
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (selectedNodeId === null) {
        setSelectedNodeId(nodes[0].id);
        return;
      }
      if (!camera || !event) return;

      const positionListe = nodes.findIndex(
        (node: NodeData) => node.id === selectedNodeId,
      );
      if (positionListe !== -1) {
        if (event.key === "d" || event.key === "ArrowRight") {
          const nextNode = nodes[(positionListe + 1) % nodes.length];
          setSelectedNodeId(nextNode.id);
          const pos = getNodePos(nextNode, currentView);
          setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
        }
        if (event.key === "q" || event.key === "ArrowLeft") {
          const prevNode =
            nodes[(positionListe - 1 + nodes.length) % nodes.length];
          setSelectedNodeId(prevNode.id);
          const pos = getNodePos(prevNode, currentView);
          setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedNodeId,
    nodes,
    camera,
    setTargetPosition,
    setSelectedNodeId,
    currentView,
  ]);

  // Mode debug
  useEffect(() => {
    const toggleDebug = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "m") setDebugMode(!debugMode);
    };
    window.addEventListener("keydown", toggleDebug);
    return () => window.removeEventListener("keydown", toggleDebug);
  }, [debugMode, setDebugMode]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={80}
      maxPolarAngle={Math.PI / 1.5}
    />
  );
}
