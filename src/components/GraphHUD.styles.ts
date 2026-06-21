import { styled, alpha } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const GraphHUDContainer = styled(Box)(() => ({
  position: "absolute",
  bottom: 24,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 100,
  display: "flex",
  justifyContent: "center",
  pointerEvents: "auto",
}));

export const HUDPill = styled(Box)(({ theme }) => ({
  ...theme.glassmorphism.pill,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 16px",
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

export const ShortcutsTitle = styled(Typography)(() => ({
  fontWeight: "700 !important",
  marginBottom: "12px !important",
  fontSize: "0.9rem !important",
}));

export const ShortcutRow = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
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
