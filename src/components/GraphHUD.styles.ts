import { styled } from "@mui/material/styles";
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
  display: "flex",
  alignItems: "center",
  padding: "6px 12px",
  borderRadius: 9999,
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  gap: 4,
  [theme.breakpoints.down("md")]: {
    "& .MuiIconButton-root": {
      minWidth: 44,
      minHeight: 44,
    },
  },
}));

export const ShortcutsPopoverContainer = styled(Box)(() => ({
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

export const ShortcutKey = styled("span")(() => ({
  background: "rgba(148, 163, 184, 0.15)",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  borderRadius: 4,
  padding: "2px 6px",
  fontFamily: "monospace",
  fontWeight: "bold",
  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
}));
