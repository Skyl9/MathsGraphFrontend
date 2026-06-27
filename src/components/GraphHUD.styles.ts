import { styled, alpha } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export const GraphHUDContainer = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(3),
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: theme.zIndex.speedDial,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.5),
  justifyContent: "center",
  pointerEvents: "none", // The container shouldn't block clicks
  "& > *": {
    pointerEvents: "auto", // Children block clicks
  },
}));

export const HUDPill = styled(Box)(({ theme }) => ({
  ...theme.glassmorphism.pill,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: 24,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
  [theme.breakpoints.down("md")]: {
    "& .MuiIconButton-root": {
      minWidth: 44,
      minHeight: 44,
    },
  },
}));

export const ShortcutsPopoverContainer = styled(Box)(({ theme }) => ({
  ...theme.glassmorphism.card,
  padding: 16,
  minWidth: 200,
}));

export const ShortcutsTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "700 !important",
  marginBottom: `${theme.spacing(1.5)} !important`,
  fontSize: "0.9rem !important",
}));

export const ShortcutRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  fontSize: "0.8rem",
  "&:last-child": {
    marginBottom: 0,
  },
}));

export const ShortcutKey = styled("span")(({ theme }) => ({
  background: alpha(theme.palette.text.secondary, 0.15),
  border: `1px solid ${alpha(theme.palette.text.secondary, 0.3)}`,
  borderRadius: 4,
  padding: "2px 6px",
  fontFamily: "monospace",
  fontWeight: "bold",
  boxShadow: `0 1px 1px ${alpha(theme.palette.common.black, 0.1)}`,
}));
