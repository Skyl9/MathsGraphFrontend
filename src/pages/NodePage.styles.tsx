import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const DetailsGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
  maxWidth: "1200px",
  margin: "24px auto",
  padding: "0 16px",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "2.8fr 1.2fr",
  },
}));

export const MainContentColumn = styled("main")({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const SidebarColumn = styled("aside")({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const MathCard = styled("article")<{
  cardtype?: "enonce" | "proof" | "default";
}>(({ theme, cardtype }) => {
  const isDark = theme.palette.mode === "dark";

  let borderLeftColor = "transparent";
  if (cardtype === "enonce") borderLeftColor = isDark ? "#7dd3fc" : "#0ea5e9";
  if (cardtype === "proof") borderLeftColor = isDark ? "#c4b5fd" : "#8b5cf6";

  return {
    background: isDark ? "#0f1428" : "white",
    borderRadius: "16px",
    boxShadow: isDark
      ? "0 4px 20px rgba(0, 0, 0, 0.2)"
      : "0 4px 20px rgba(0, 0, 0, 0.04)",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.05)"
      : "1px solid rgba(0, 0, 0, 0.05)",
    borderLeft:
      cardtype && cardtype !== "default"
        ? `4px solid ${borderLeftColor}`
        : undefined,
    overflow: "hidden",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
  };
});

export const MathCardHeader = styled("header")(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    padding: "16px 24px",
    borderBottom: isDark
      ? "1px solid rgba(255, 255, 255, 0.05)"
      : "1px solid rgba(0, 0, 0, 0.05)",
    background: isDark ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.01)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

export const MathCardTitle = styled(Typography)<{
  variantcolor?: "primary" | "secondary" | "default";
  component?: React.ElementType;
}>(({ theme, variantcolor }) => {
  const isDark = theme.palette.mode === "dark";

  let color = theme.palette.text.primary;
  if (variantcolor === "primary") color = isDark ? "#7dd3fc" : "#0ea5e9";
  if (variantcolor === "secondary") color = theme.palette.secondary.main;

  return {
    fontSize: "1.1rem !important",
    fontWeight: "700 !important",
    color: color,
  };
});

export const MathCardBody = styled(Box)({
  padding: "24px",
  fontSize: "1.05rem",
  lineHeight: "1.7",
});

export const SidebarCard = styled("section")(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    background: isDark ? "#0f1428" : "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: isDark
      ? "0 4px 20px rgba(0, 0, 0, 0.2)"
      : "0 4px 20px rgba(0, 0, 0, 0.04)",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.05)"
      : "1px solid rgba(0, 0, 0, 0.05)",
  };
});

export const SidebarCardTitle = styled(Typography)<{
  component?: React.ElementType;
}>(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    fontWeight: "700 !important",
    marginBottom: "20px !important",
    position: "relative",
    paddingLeft: "10px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "4px",
      bottom: "4px",
      width: "3px",
      borderRadius: "2px",
      background: isDark ? "#7dd3fc" : "#0ea5e9",
    },
  };
});

export const MetadataList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const MetadataItem = styled("li")({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const MetadataLabel = styled("span")(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: 600,
  color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.03em",
}));

export const MetadataValue = styled("div")(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.mode === "dark" ? "#e2e8f0" : "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const ConceptHeader = styled("header")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginBottom: "8px",
});

export const ConceptTitleRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
});

export const ConceptTitle = styled(Typography)({
  fontSize: "2.2rem !important",
  fontWeight: "800 !important",
  lineHeight: "1.2 !important",
});

export const SidebarActions = styled("nav")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  "& button": {
    justifyContent: "flex-start",
  },
});
