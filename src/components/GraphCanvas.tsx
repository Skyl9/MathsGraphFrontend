import { Canvas } from "@react-three/fiber";
import Scene from "../scene/Scene";
import { Graph } from "../types/ApiTypes/graph";
import { useGraphStore } from "../stores/useGraphStore";
import { visuallyHidden } from "@mui/utils";
import { Box } from "@mui/material";

interface GraphCanvasProps {
  graphData: Graph;
}

export default function GraphCanvas({ graphData }: GraphCanvasProps) {
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);

  return (
    <>
      <Box sx={visuallyHidden} aria-live="polite">
        <h2>Liste des nœuds du graphe</h2>
        <ul>
          {graphData.nodes.map((node) => (
            <li key={node.id}>
              <button onClick={() => setSelectedNodeId(node.id)}>
                Sélectionner le nœud {node.nom}
              </button>
            </li>
          ))}
        </ul>
      </Box>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene graphData={graphData} />
      </Canvas>
    </>
  );
}
