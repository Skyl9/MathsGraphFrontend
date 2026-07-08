import { Text } from "@react-three/drei";
import { useUIStore } from "../stores/useUIStore";
import { NodeData } from "../types/ApiTypes/graph";
import { useMemo } from "react";
import { computeDomainsLayout } from "../utils/layoutUtils";

interface ClusterLabelsProps {
  nodes: NodeData[];
}

export function ClusterLabels({ nodes }: ClusterLabelsProps) {
  const currentView = useUIStore((s) => s.currentView);
  const darkMode = useUIStore((s) => s.darkMode);

  const clusters = useMemo(() => {
    if (currentView !== "domaines") return [];
    return computeDomainsLayout(nodes);
  }, [nodes, currentView]);

  if (currentView !== "domaines") return null;

  return (
    <group>
      {clusters.map((cluster, idx) => (
        <Text
          key={idx}
          position={[cluster.center.x, cluster.center.y + 4, cluster.center.z]}
          fontSize={1.5}
          color={darkMode ? "#ffffff" : "#000000"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor={darkMode ? "#000000" : "#ffffff"}
        >
          {cluster.domaine}
        </Text>
      ))}
    </group>
  );
}
