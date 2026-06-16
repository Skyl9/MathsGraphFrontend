import {
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import { motion, Variants } from "framer-motion";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import { useTranslation } from "react-i18next";

export function SupportPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isDark = theme.palette.mode === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90 } },
  };

  const tiers = [
    {
      title: t("support.tier1_title"),
      subtitle: t("support.tier1_subtitle"),
      description: t("support.tier1_desc"),
      icon: <VolunteerActivismIcon sx={{ fontSize: 32 }} />,
      color: "#f43f5e",
      bgColor: isDark ? "rgba(244, 63, 94, 0.15)" : "rgba(244, 63, 94, 0.08)",
      actionText: t("support.tier1_action"),
      actionLink: "https://ko-fi.com/tristan92",
      external: true,
    },
    {
      title: t("support.tier2_title"),
      subtitle: t("support.tier2_subtitle"),
      description: t("support.tier2_desc"),
      icon: <GitHubIcon sx={{ fontSize: 32 }} />,
      color: isDark ? "#ffffff" : "#0f172a",
      bgColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.08)",
      actionText: t("support.tier2_action"),
      actionLink: "https://github.com/sponsors",
      external: true,
    },
    {
      title: t("support.tier3_title"),
      subtitle: t("support.tier3_subtitle"),
      description: t("support.tier3_desc"),
      icon: <CodeIcon sx={{ fontSize: 32 }} />,
      color: "#0ea5e9",
      bgColor: isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.08)",
      actionText: t("support.tier3_action"),
      actionLink: "/contribution",
      external: false,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Stack spacing={8} alignItems="center">
          {/* Header */}
          <motion.div variants={itemVariants} style={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                bgcolor: isDark
                  ? "rgba(244, 63, 94, 0.15)"
                  : "rgba(244, 63, 94, 0.08)",
                color: "#f43f5e",
                mb: 3,
              }}
            >
              <FavoriteIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 900,
                mb: 2,
                letterSpacing: "-0.02em",
                background: isDark
                  ? "linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)"
                  : "linear-gradient(90deg, #e11d48 0%, #f43f5e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("support.title")}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 650,
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {t("support.description")}
            </Typography>
          </motion.div>

          {/* Grille des Options de Soutien */}
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={4}>
              {tiers.map((tier, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <motion.div
                    variants={itemVariants}
                    style={{ height: "100%" }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 3,
                        borderRadius: 4,
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                        background: isDark
                          ? "rgba(15, 20, 40, 0.4)"
                          : "#ffffff",
                        transition:
                          "transform 0.2s ease, border-color 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: tier.color,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: tier.bgColor,
                            color: tier.color,
                            mb: 3,
                          }}
                        >
                          {tier.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        >
                          {tier.title}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          {tier.subtitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}
                        >
                          {tier.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 0, pt: 4 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          color="primary"
                          href={tier.actionLink}
                          target={tier.external ? "_blank" : "_self"}
                          rel={tier.external ? "noopener noreferrer" : ""}
                          sx={{
                            py: 1.2,
                            borderRadius: 2.5,
                            fontWeight: 700,
                            boxShadow: "none",
                            textTransform: "none",
                          }}
                        >
                          {tier.actionText}
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Remerciement Final */}
          <motion.div variants={itemVariants} style={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              {t("support.thanks")}
            </Typography>
          </motion.div>
        </Stack>
      </motion.div>
    </Container>
  );
}
