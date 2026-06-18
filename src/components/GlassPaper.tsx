import React from "react";
import { Paper, PaperProps, useTheme } from "@mui/material";

export interface GlassPaperProps extends PaperProps {
  blur?: number;
  opacity?: number;
}

export const GlassPaper: React.FC<GlassPaperProps> = ({
  blur = 16,
  opacity = 0.75,
  sx,
  children,
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      {...props}
      sx={{
        backgroundColor: isDark
          ? `rgba(15, 20, 40, ${opacity})`
          : `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.5)"}`,
        boxShadow: isDark
          ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
          : "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
        borderRadius: 3,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};
