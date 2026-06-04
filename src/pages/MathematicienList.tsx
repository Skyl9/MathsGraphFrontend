import { ReportIssueButton } from "../components/Issue";
import { MathematicianTimeline } from "../components/MathematicianTimeline.tsx";

import { Box } from "@mui/material";

const MathematicienList = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(85vh - 128px)",
      }}
    >
      {/* Conteneur principal de la chronologie (prend tout l'espace disponible) */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <MathematicianTimeline />
      </Box>

      {/* Bouton de signalement en bas */}
      <Box sx={{ pb: 2, display: "flex", justifyContent: "center" }}>
        <ReportIssueButton />
      </Box>
    </Box>
  );
};

export default MathematicienList;
