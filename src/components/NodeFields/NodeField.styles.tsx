import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const FieldWrapper = styled(Box)(() => ({
  flexGrow: 1,
}));

export const FieldTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
  fontSize: "0.9rem",
  marginBottom: "4px",
}));

export const FieldContent = styled(Box)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.mode === "dark" ? "#e2e8f0" : "#0f172a",
}));
