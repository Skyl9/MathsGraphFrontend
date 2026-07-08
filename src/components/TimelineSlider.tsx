import React, { useMemo } from "react";
import { Box, Slider, Typography, IconButton } from "@mui/material";
import { useUIStore } from "../stores/useUIStore";
import { Graph } from "../types/ApiTypes/graph";
import CloseIcon from "@mui/icons-material/Close";

interface TimelineSliderProps {
  graphData: Graph;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  graphData,
}) => {
  const { timelineYear, setTimelineYear } = useUIStore();

  const { minYear, maxYear } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    graphData.nodes.forEach((node) => {
      if (node.annee != null) {
        if (node.annee < min) min = node.annee;
        if (node.annee > max) max = node.annee;
      }
    });
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = new Date().getFullYear();
    return { minYear: min, maxYear: max };
  }, [graphData]);

  if (timelineYear === null) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        maxWidth: 600,
        backgroundColor: "rgba(30, 30, 30, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        padding: 2,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}
        >
          Machine à Remonter le Temps
        </Typography>
        <IconButton
          size="small"
          onClick={() => setTimelineYear(null)}
          sx={{ color: "#fff" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#90caf9",
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {timelineYear < 0
          ? `${Math.abs(timelineYear)} av. J.-C.`
          : timelineYear}
      </Typography>
      <Slider
        value={timelineYear}
        min={minYear}
        max={maxYear}
        onChange={(_, value) => setTimelineYear(value as number)}
        valueLabelDisplay="off"
        sx={{
          color: "#90caf9",
          height: 8,
          "& .MuiSlider-thumb": {
            width: 24,
            height: 24,
            backgroundColor: "#fff",
            border: "2px solid currentColor",
            transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&::before": {
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0px 0px 0px 8px rgb(144 202 249 / 16%)",
            },
            "&.Mui-active": {
              width: 28,
              height: 28,
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.28,
          },
        }}
      />
    </Box>
  );
};
