import React from "react";
import { Paper, PaperProps, useTheme } from "@mui/material";

export type GlassPaperProps = PaperProps;

export const GlassPaper: React.FC<GlassPaperProps> = ({
  sx,
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Paper
      {...props}
      sx={{
        ...theme.glassmorphism.main,
        borderRadius: 3,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};
