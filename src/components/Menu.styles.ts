import { styled, alpha } from "@mui/material/styles";
import { Box, Typography, IconButton, Button } from "@mui/material";

export const MenuContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 24,
  left: 24,
  zIndex: 100,
  [theme.breakpoints.down("md")]: {
    top: 80,
    left: 16,
    "& .MuiIconButton-root": {
      minWidth: 44,
      minHeight: 44,
    },
  },
}));

export const FloatingGlassMenu = styled(Box)(({ theme }) => ({
  scrollbarWidth: "thin",
  scrollbarColor: `${alpha(theme.palette.common.white, 0.1)} transparent`,
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.text.secondary, 0.2),
    borderRadius: 4,
    "&:hover": {
      background: alpha(theme.palette.text.secondary, 0.4),
    },
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: "calc(100vw - 32px)",
    maxHeight: "calc(100vh - 120px)",
    "& .MuiIconButton-root": {
      minWidth: 44,
      minHeight: 44,
    },
  },
}));

export const SearchBarContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 24,
  right: 24,
  zIndex: 110,
  display: "flex",
  flexDirection: "column",
  width: 340,
  [theme.breakpoints.down("md")]: {
    top: 16,
    left: 16,
    right: 16,
    width: "auto",
  },
}));

export const SearchResultsBox = styled(Box)(({ theme }) => ({
  marginTop: 8,
  padding: 8,
  borderRadius: 12,
  boxShadow: `0 10px 25px -5px ${alpha(theme.palette.common.black, 0.15)}, 0 8px 10px -6px ${alpha(theme.palette.common.black, 0.15)}`,
  maxHeight: 280,
  overflowY: "auto",
  fontFamily: '"Inter", Roboto, sans-serif',
  transition: "all 0.2s ease",
  "&::-webkit-scrollbar": {
    width: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.text.secondary, 0.3),
    borderRadius: 2,
  },
}));

export const SearchResultItem = styled(Box)(() => ({
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "background 0.15s ease, color 0.15s ease",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  marginBottom: 2,
  "&:last-child": {
    marginBottom: 0,
  },
}));

export const SearchResultTitle = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const SearchResultMeta = styled(Typography)(() => ({
  fontSize: "0.75rem",
  opacity: 0.7,
  textTransform: "capitalize",
}));

export const SearchNoResults = styled(Box)(() => ({
  padding: "12px 16px",
  fontSize: "0.875rem",
  textAlign: "center",
  opacity: 0.7,
}));

export const MenuButtonToggle = styled(IconButton)(({ theme }) => ({
  backdropFilter: "blur(12px)",
  background: alpha(theme.palette.background.paper, 0.75),
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  boxShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.15)}`,
  padding: theme.spacing(1.5),
  "&:hover": {
    background: alpha(theme.palette.background.paper, 0.85),
  },
}));

export const NavigationButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  justifyContent: "flex-start",
  borderColor: alpha(theme.palette.text.primary, 0.15),
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "0.875rem",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  "&:hover": {
    background: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.05 : 0.03,
    ),
    borderColor: alpha(theme.palette.text.primary, 0.3),
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  fontWeight: 600,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  "&:hover": {
    background: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.05 : 0.03,
    ),
  },
  "&:active": {
    background: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.15 : 0.1,
    ),
  },
}));
