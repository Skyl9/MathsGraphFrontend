import { Canvas } from "@react-three/fiber";
import Scene from "../scene/Scene";
import { Graph } from "../types/ApiTypes/graph";

interface GraphCanvasProps {
  graphData: Graph;
}

export default function GraphCanvas({ graphData }: GraphCanvasProps) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene graphData={graphData} />
    </Canvas>
  );
}
