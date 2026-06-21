import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

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
  scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(148, 163, 184, 0.2)",
    borderRadius: 4,
    "&:hover": {
      background: "rgba(148, 163, 184, 0.4)",
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

export const SearchResultsBox = styled(Box)(() => ({
  marginTop: 8,
  padding: 8,
  borderRadius: 12,
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.15)",
  maxHeight: 280,
  overflowY: "auto",
  fontFamily: '"Inter", Roboto, sans-serif',
  transition: "all 0.2s ease",
  "&::-webkit-scrollbar": {
    width: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(148, 163, 184, 0.3)",
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
