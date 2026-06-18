import { Box, Typography, Button, Paper, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function LostPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        py: 10,
        px: 2,
        background: isDark
          ? "radial-gradient(circle at 50% 40%, rgba(244, 67, 54, 0.1) 0%, rgba(9, 13, 22, 0) 60%)"
          : "radial-gradient(circle at 50% 40%, rgba(244, 67, 54, 0.05) 0%, rgba(255, 255, 255, 0) 60%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 5, sm: 6 },
          width: "100%",
          maxWidth: 500,
          borderRadius: 6,
          background: isDark
            ? "rgba(15, 20, 35, 0.45)"
            : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.07)",
          boxShadow: isDark
            ? "0 12px 40px 0 rgba(0, 0, 0, 0.3)"
            : "0 12px 40px 0 rgba(31, 38, 135, 0.06)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: isDark
              ? "rgba(244, 67, 54, 0.15)"
              : "rgba(244, 67, 54, 0.08)",
            border: "1px solid",
            borderColor: isDark
              ? "rgba(244, 67, 54, 0.3)"
              : "rgba(244, 67, 54, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            color: "error.main",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40 }} />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "5rem", sm: "6rem" },
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, #f44336 0%, #ff7961 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
            letterSpacing: "-0.05em",
          }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 2 }}
        >
          {t("lost.not_found")}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 5, maxWidth: 365, mx: "auto" }}
        >
          {t("lost.description")}
        </Typography>

        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 650,
            px: 4,
            py: 1.5,
            boxShadow: "0 4px 14px 0 rgba(244, 67, 54, 0.25)",
            bgcolor: "error.main",
            "&:hover": {
              bgcolor: "error.dark",
              boxShadow: "0 6px 20px 0 rgba(244, 67, 54, 0.35)",
            },
          }}
        >
          {t("lost.back_home")}
        </Button>
      </Paper>
    </Box>
  );
}
