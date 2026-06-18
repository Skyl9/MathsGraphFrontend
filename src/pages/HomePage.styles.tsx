import { styled } from "@mui/material/styles";
import { Box, Card, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export const HeroSection = styled(motion.section)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    position: "relative",
    padding: "90px 24px",
    borderRadius: "32px",
    marginBottom: "56px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    background: isDark
      ? "radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.16) 0%, rgba(14, 165, 233, 0.05) 45%, transparent 80%)"
      : "radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.12) 0%, rgba(14, 165, 233, 0.05) 45%, transparent 80%)",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.04)"
      : "1px solid rgba(0, 0, 0, 0.04)",
    boxShadow: isDark
      ? "0 10px 40px -10px rgba(0, 0, 0, 0.2)"
      : "0 10px 40px -10px rgba(0, 0, 0, 0.02)",

    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      zIndex: 0,
      opacity: isDark ? 0.06 : 0.025,
      backgroundSize: "26px 26px",
      backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px),
                        linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
      pointerEvents: "none",
    },
  };
});

export const HeroContent = styled("header")({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const HeroTitle = styled(Typography)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    fontSize: "clamp(2.8rem, 6.5vw, 4.2rem) !important",
    fontWeight: "900 !important",
    lineHeight: "1.1 !important",
    marginBottom: "20px !important",
    background: isDark
      ? "linear-gradient(135deg, #a5b4fc 0%, #38bdf8 50%, #34d399 100%)"
      : "linear-gradient(135deg, #6366f1 0%, #0ea5e9 50%, #10b981 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.03em",
  };
});

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  maxWidth: "650px",
  fontSize: "1.15rem !important",
  lineHeight: "1.65 !important",
  color:
    theme.palette.mode === "dark" ? "#94a3b8 !important" : "#475569 !important",
  marginBottom: "36px !important",
  fontWeight: "500 !important",
}));

export const HeroButton = styled(Button)({
  fontWeight: "700 !important",
  padding: "14px 36px !important",
  fontSize: "1.05rem !important",
  borderRadius: "14px !important",
  textTransform: "none" as const,
  transition:
    "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease !important",
  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3) !important",
  background: "linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%) !important",
  border: "none !important",
  color: "#ffffff !important",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 25px rgba(99, 102, 241, 0.5) !important",
  },
});

export const GlassCard = styled(Card)<{
  suffixcolor?: "concept" | "category" | "mathematician" | "type";
  component?: React.ElementType;
}>(({ theme, suffixcolor }) => {
  const isDark = theme.palette.mode === "dark";

  const hoverColors = {
    concept: isDark ? "rgba(165, 180, 252, 0.4)" : "rgba(99, 102, 241, 0.4)",
    category: isDark ? "rgba(125, 211, 252, 0.4)" : "rgba(14, 165, 233, 0.4)",
    mathematician: isDark
      ? "rgba(216, 180, 254, 0.4)"
      : "rgba(168, 85, 247, 0.4)",
    type: isDark ? "rgba(110, 231, 183, 0.4)" : "rgba(16, 185, 129, 0.4)",
  };

  return {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: isDark
      ? "rgba(15, 20, 35, 0.45) !important"
      : "rgba(255, 255, 255, 0.6) !important",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.05) !important"
      : "1px solid rgba(255, 255, 255, 0.5) !important",
    borderRadius: "24px !important",
    boxShadow: isDark
      ? "0 4px 30px rgba(0, 0, 0, 0.15) !important"
      : "0 4px 30px rgba(0, 0, 0, 0.02) !important",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease !important",
    "&:hover": {
      boxShadow: isDark
        ? "0 16px 36px rgba(99, 102, 241, 0.15) !important"
        : "0 16px 36px rgba(99, 102, 241, 0.08) !important",
      borderColor: suffixcolor
        ? `${hoverColors[suffixcolor]} !important`
        : undefined,
    },
  };
});

export const CardIconWrapper = styled(Box)<{
  suffixcolor?: "concept" | "category" | "mathematician" | "type";
}>(({ theme, suffixcolor }) => {
  const isDark = theme.palette.mode === "dark";

  const styleMap = {
    concept: {
      background: isDark
        ? "rgba(165, 180, 252, 0.12)"
        : "rgba(99, 102, 241, 0.08)",
      color: isDark ? "#a5b4fc" : "#6366f1",
      border: isDark
        ? "1px solid rgba(165, 180, 252, 0.2)"
        : "1px solid rgba(99, 102, 241, 0.15)",
    },
    category: {
      background: isDark
        ? "rgba(125, 211, 252, 0.12)"
        : "rgba(14, 165, 233, 0.08)",
      color: isDark ? "#7dd3fc" : "#0ea5e9",
      border: isDark
        ? "1px solid rgba(125, 211, 252, 0.2)"
        : "1px solid rgba(14, 165, 233, 0.15)",
    },
    mathematician: {
      background: isDark
        ? "rgba(216, 180, 254, 0.12)"
        : "rgba(168, 85, 247, 0.08)",
      color: isDark ? "#d8b4fe" : "#a855f7",
      border: isDark
        ? "1px solid rgba(216, 180, 254, 0.2)"
        : "1px solid rgba(168, 85, 247, 0.15)",
    },
    type: {
      background: isDark
        ? "rgba(110, 231, 183, 0.12)"
        : "rgba(16, 185, 129, 0.08)",
      color: isDark ? "#6ee7b7" : "#10b981",
      border: isDark
        ? "1px solid rgba(110, 231, 183, 0.2)"
        : "1px solid rgba(16, 185, 129, 0.15)",
    },
  };

  const currentStyle = suffixcolor ? styleMap[suffixcolor] : {};

  return {
    width: "46px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    marginBottom: "20px",
    transition: "transform 0.3s ease",
    ...currentStyle,
  };
});

export const ContributionBanner = styled(Card)<{
  component?: React.ElementType;
}>(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    marginTop: "56px !important",
    padding: "40px !important",
    borderRadius: "28px !important",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.05) !important"
      : "1px solid rgba(0, 0, 0, 0.04) !important",
    background: isDark
      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(14, 165, 233, 0.06) 50%, rgba(16, 185, 129, 0.03) 100%) !important"
      : "linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(14, 165, 233, 0.04) 50%, rgba(16, 185, 129, 0.02) 100%) !important",
    boxShadow: isDark
      ? "0 10px 40px -10px rgba(0, 0, 0, 0.15) !important"
      : "0 10px 30px -10px rgba(0, 0, 0, 0.02) !important",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "20px",
  };
});

export const ContributionTitle = styled(Typography)({
  fontWeight: "800 !important",
  letterSpacing: "-0.01em",
});
