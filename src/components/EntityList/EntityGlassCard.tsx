import { Card, Box, Stack, Typography, Button, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface EntityGlassCardProps {
  title: string;
  icon: ReactNode;
  actionTo: string;
  actionText: string;
  children?: ReactNode;
  isSecondary?: boolean;
}

export const EntityGlassCard = ({
  title,
  icon,
  actionTo,
  actionText,
  children,
  isSecondary = false,
}: EntityGlassCardProps) => {
  const theme = useTheme();
  const mainColor = isSecondary ? "secondary.main" : "primary.main";
  const bgRgba = isSecondary
    ? "rgba(124, 58, 237, 0.1)"
    : "rgba(14, 165, 233, 0.1)";
  const shadowColor = isSecondary
    ? "rgba(124, 58, 237, 0.08)"
    : "rgba(14, 165, 233, 0.08)";

  return (
    <Card
      className="glass-card"
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center", // Align items vertically by default
        justifyContent: "space-between",
        ...theme.glassmorphism.card,
        borderRadius: 4,
        p: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 10px 20px ${shadowColor}`,
          borderColor: mainColor,
        },
      }}
    >
      <Box sx={{ flex: 1, pr: 2, display: "flex", flexDirection: "column" }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: children ? 1 : 0 }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              background: bgRgba,
              color: mainColor,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant={children ? "h5" : "h6"}
            component="h2"
            sx={{
              fontWeight: 700,
              lineBreak: "anywhere",
              textTransform: isSecondary ? "capitalize" : "none",
            }}
          >
            {title}
          </Typography>
        </Stack>
        {children}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="outlined"
          color={isSecondary ? "secondary" : "primary"}
          component={Link}
          to={actionTo}
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            height: "fit-content",
          }}
        >
          {actionText}
        </Button>
      </Box>
    </Card>
  );
};
