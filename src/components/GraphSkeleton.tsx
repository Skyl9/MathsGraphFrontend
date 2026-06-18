import { Box, useTheme, keyframes } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useUIStore } from "../stores/useUIStore";

const pulseAnimation = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
`;

export const GraphSkeleton = () => {
  const theme = useTheme();
  const darkMode = useUIStore((s) => s.darkMode);

  // Position fictives pour simuler un graphe (en pourcentage)
  const dummyNodes = [
    { id: 1, x: 50, y: 50, size: 60 },
    { id: 2, x: 30, y: 30, size: 40 },
    { id: 3, x: 70, y: 40, size: 45 },
    { id: 4, x: 25, y: 65, size: 30 },
    { id: 5, x: 65, y: 70, size: 35 },
    { id: 6, x: 80, y: 20, size: 25 },
    { id: 7, x: 45, y: 25, size: 30 },
    { id: 8, x: 15, y: 45, size: 25 },
  ];

  const dummyEdges = [
    { start: 1, end: 2 },
    { start: 1, end: 3 },
    { start: 1, end: 4 },
    { start: 1, end: 5 },
    { start: 1, end: 7 },
    { start: 2, end: 4 },
    { start: 2, end: 8 },
    { start: 3, end: 6 },
    { start: 3, end: 7 },
    { start: 5, end: 3 },
  ];

  const nodeColor = darkMode
    ? alpha(theme.palette.primary.light, 0.4)
    : alpha(theme.palette.primary.main, 0.3);
  const edgeColor = darkMode
    ? alpha(theme.palette.primary.light, 0.2)
    : alpha(theme.palette.primary.main, 0.15);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "800px",
          height: "600px",
          animation: `${pulseAnimation} 2s ease-in-out infinite`,
        }}
      >
        <svg width="100%" height="100%" style={{ position: "absolute" }}>
          {dummyEdges.map((edge, idx) => {
            const startNode = dummyNodes.find((n) => n.id === edge.start);
            const endNode = dummyNodes.find((n) => n.id === edge.end);
            if (!startNode || !endNode) return null;
            return (
              <line
                key={`edge-${idx}`}
                x1={`${startNode.x}%`}
                y1={`${startNode.y}%`}
                x2={`${endNode.x}%`}
                y2={`${endNode.y}%`}
                stroke={edgeColor}
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {dummyNodes.map((node) => (
          <Box
            key={`node-${node.id}`}
            sx={{
              position: "absolute",
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: node.size,
              height: node.size,
              borderRadius: "50%",
              backgroundColor: nodeColor,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 15px ${nodeColor}`,
            }}
          />
        ))}
      </Box>

      {/* Message texte optionnel superposé */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          animation: `${pulseAnimation} 2s ease-in-out infinite`,
          color: darkMode ? alpha("#fff", 0.7) : alpha("#000", 0.6),
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontSize: "0.875rem",
        }}
      >
        Chargement de la géométrie...
      </Box>
    </Box>
  );
};
