import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import Scene from "../scene/Scene";
import { Graph } from "../types/ApiTypes/graph";
import { useEffect } from "react";

interface GraphCanvasProps {
  graphData: Graph;
}

export default function GraphCanvas({ graphData }: GraphCanvasProps) {
  useEffect(() => {
    console.log(
      `[DEBUG R3F] Graphe monté avec ${graphData.nodes.length} nœuds et ${graphData.edges.length} arêtes.`,
    );
  }, [graphData]);

  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Stats />
      <Scene graphData={graphData} />
    </Canvas>
  );
}
