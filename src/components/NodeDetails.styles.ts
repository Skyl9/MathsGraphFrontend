/* eslint-disable @typescript-eslint/no-explicit-any */
import { styled, alpha } from "@mui/material/styles";
import { Box, Typography, Button, ButtonProps } from "@mui/material";
import { motion } from "framer-motion";
import { GlassPaper } from "./GlassPaper";

export const NodeDetailsSidebar = styled(motion.aside)(({ theme }) => ({
  position: "fixed",
  top: 80,
  right: 24,
  bottom: 24,
  width: 360,
  zIndex: 100,
  fontFamily: '"Inter", Roboto, sans-serif',
  display: "flex",
  flexDirection: "column",
  pointerEvents: "auto",
  [theme.breakpoints.down("md")]: {
    top: "auto",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "auto",
    maxHeight: "65vh",
    borderRadius: "24px 24px 0 0",
  },
}));

export const SidebarContainer = styled(GlassPaper)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 20,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  transition: "background 0.3s ease, border-color 0.3s ease",
  [theme.breakpoints.down("md")]: {
    borderRadius: "24px 24px 0 0",
  },
}));

export const SidebarHeader = styled("header")(({ theme }) => ({
  padding: 24,
  position: "relative",
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
}));

export const SidebarTitle = styled(Typography)(() => ({
  fontWeight: "800 !important",
  letterSpacing: "-0.025em",
  lineHeight: "1.25 !important",
  marginRight: "24px !important",
}));

export const MathTypeBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 9999,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginTop: 10,
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
}));

export const SidebarBody = styled(Box)(({ theme }) => ({
  padding: 24,
  flexGrow: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.text.secondary, 0.2),
    borderRadius: 3,
    "&:hover": {
      background: alpha(theme.palette.text.secondary, 0.4),
    },
  },
}));

export const SectionLabel = styled(Typography)(() => ({
  fontSize: "0.75rem !important",
  fontWeight: "800 !important",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  opacity: 0.6,
  marginBottom: "8px !important",
}));

export const NeighborsList = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 6,
}));

export const NeighborChip = styled(Box)(() => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "1px solid transparent",
}));

export const SidebarFooter = styled("footer")(({ theme }) => ({
  padding: "20px 24px",
  borderTop: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
  display: "flex",
  gap: 12,
}));

export const SidebarFooterBtn = styled(Button)<ButtonProps<any>>(() => ({
  flex: 1,
  borderRadius: "12px !important",
  fontWeight: "700 !important",
  textTransform: "none !important",
}));
