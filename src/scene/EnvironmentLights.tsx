import { Stars, Grid } from "@react-three/drei";
import { useUIStore } from "../stores/useUIStore";

export default function EnvironmentLights() {
  const graphTheme = useUIStore((s) => s.graphTheme);
  const darkMode = useUIStore((s) => s.darkMode);

  return (
    <>
      <ambientLight
        intensity={graphTheme === "neon" ? 0.35 : darkMode ? 0.45 : 0.75}
      />
      <directionalLight
        position={[10, 20, 10]}
        intensity={graphTheme === "neon" ? 0.6 : 0.95}
      />
      <pointLight position={[-10, -20, -10]} intensity={0.2} />

      {/* Arrière-plan d'étoiles immersif */}
      <Stars
        radius={120}
        depth={50}
        count={600}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />

      {/* Grille moderne avec dégradé de distance */}
      <Grid
        position={[0, -12, 0]}
        args={[150, 150]}
        cellSize={1.5}
        cellThickness={1.0}
        cellColor={darkMode ? "#334155" : "#cbd5e1"}
        sectionSize={4.5}
        sectionThickness={1.5}
        sectionColor={darkMode ? "#38bdf8" : "#0284c7"}
        fadeDistance={100}
        fadeStrength={1}
        infiniteGrid
      />
    </>
  );
}
