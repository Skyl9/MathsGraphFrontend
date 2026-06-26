/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { useTheme } from "@mui/material";
import { useGraphStore } from "../stores/useGraphStore";
import { useFilterStore } from "../stores/useFilterStore";
import { useUIStore } from "../stores/useUIStore";
import { NodeData } from "../types/ApiTypes/graph";
import { getNodeColor, getLabelColor } from "../utils/nodeColors";

const getNodePos = (node: NodeData, view: string) => {
  return (
    node.position[view] ||
    node.position["grille"] ||
    node.position["physique"] || { x: 0, y: 0, z: 0 }
  );
};

export const GlobalLabelsLOD = ({
  nodes,
  colors,
  currentView,
  adjacencyList,
  getNodeScale,
}: any) => {
  const [visibleNodes, setVisibleNodes] = useState<NodeData[]>([]);
  const theme = useTheme();

  const filters = useFilterStore((s) => s.filters);
  const graphTheme = useUIStore((s) => s.graphTheme);

  // We read the global store synchronously in useFrame, no need for component re-render
  // but we can also use selectors if we want. Actually, reading state directly in useFrame is faster:
  const getGraphState = useGraphStore.getState;

  const frameCount = useRef(0);

  useFrame(({ camera }) => {
    frameCount.current++;
    // Throttle: on vérifie les distances toutes les 15 frames (4 fois par seconde à 60fps)
    if (frameCount.current % 15 !== 0) return;

    const newVisible: NodeData[] = [];
    const state = getGraphState();
    const selectedNodeId = state.selectedNodeId;
    const hoveredNodeId = state.hoveredNodeId;

    nodes.forEach((node: NodeData) => {
      const typeKey = (node.typeMath ?? "").toLowerCase();
      const isFiltered =
        typeKey in filters
          ? !(filters[typeKey as keyof typeof filters] ?? false)
          : false;

      if (isFiltered) return;

      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;
      const hasSelection = selectedNodeId !== null;
      const isNeighbor =
        hasSelection &&
        (adjacencyList.get(selectedNodeId)?.includes(node.id) ?? false);

      const isFocus = graphTheme === "focus";
      const shouldDim = isFocus && hasSelection && !isSelected && !isNeighbor;

      const shouldShowBase = !shouldDim || isHovered;
      const isFarShow = isSelected || isHovered;

      const pos = getNodePos(node, currentView);
      // Distance paramétrique au carré (plus rapide qu'un Vector3.distanceTo qui fait une racine carrée)
      const dx = camera.position.x - pos.x;
      const dy = camera.position.y - pos.y;
      const dz = camera.position.z - pos.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      const isFar = distSq > 35 * 35;

      if (shouldShowBase && (isFarShow || !isFar)) {
        newVisible.push(node);
      }
    });

    // Évite de déclencher des re-rendus React si la liste des IDs visibles n'a pas changé
    const currentIds = visibleNodes.map((n) => n.id).join(",");
    const newIds = newVisible.map((n) => n.id).join(",");

    if (currentIds !== newIds) {
      setVisibleNodes(newVisible);
    }
  });

  return (
    <group>
      {visibleNodes.map((node) => {
        const pos = getNodePos(node, currentView);
        const scale = getNodeScale(node.id);
        const sphereSize = 0.3;
        const nodeColor = getNodeColor(node.typeMath ?? "", colors);
        const labelColor = getLabelColor(nodeColor, theme.palette.mode);

        return (
          <Billboard
            key={`label-${node.id}`}
            position={[pos.x, pos.y + sphereSize * scale + 0.3, pos.z]}
          >
            <Text
              fontSize={0.28}
              color={labelColor}
              anchorX="center"
              anchorY="middle"
            >
              {node.nom}
            </Text>
          </Billboard>
        );
      })}
    </group>
  );
};
