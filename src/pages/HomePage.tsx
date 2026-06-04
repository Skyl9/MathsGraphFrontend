import {
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Link,
  CardActions,
  useTheme,
  Box,
  Grid,
} from "@mui/material";
import { RecentChanges } from "../components/RecentChanges.tsx";
import { RecentComments } from "../components/recentComment.tsx";
import { motion, Variants } from "framer-motion";

// Icônes
import FunctionsIcon from "@mui/icons-material/Functions";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";

import "../styles/HomePage.css";

export function HomePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Configuration des cartes d'exploration
  const cardsData = [
    {
      title: t("home.cards.concepts.title"),
      description: t("home.cards.concepts.desc"),
      link: "/concept",
      icon: <FunctionsIcon sx={{ fontSize: 26 }} />,
      suffix: "concept",
    },
    {
      title: t("home.cards.categories.title"),
      description: t("home.cards.categories.desc"),
      link: "/category",
      icon: <CategoryIcon sx={{ fontSize: 26 }} />,
      suffix: "category",
    },
    {
      title: t("home.cards.mathematicians.title"),
      description: t("home.cards.mathematicians.desc"),
      link: "/mathematicien",
      icon: <PeopleIcon sx={{ fontSize: 26 }} />,
      suffix: "mathematician",
    },
    {
      title: t("home.cards.types.title"),
      description: t("home.cards.types.desc"),
      link: "/type",
      icon: <LayersIcon sx={{ fontSize: 26 }} />,
      suffix: "type",
    },
  ];

  // Variantes d'animation pour Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 6 }}
      className={isDark ? "dark-mode" : ""}
    >
      {/* Section Hero Moderne */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hero-section"
      >
        <Box className="hero-content">
          <Typography className="hero-title" variant="h1">
            {t("home.hero_title")}
          </Typography>
          <Typography className="hero-subtitle" variant="body1">
            {t("home.hero_subtitle")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/graph"
            className="hero-button"
            endIcon={<ArrowForwardIcon />}
          >
            {t("home.explore_graph")}
          </Button>
        </Box>
      </motion.div>

      {/* Grille de Cartes d'Exploration */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {cardsData.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <motion.div
                variants={itemVariants}
                style={{ height: "100%" }}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card
                  className={`glass-card glass-card-${card.suffix}`}
                  elevation={0}
                >
                  <CardContent sx={{ p: 3.5, pb: 1.5 }}>
                    <Box
                      className={`card-icon-wrapper card-icon-${card.suffix}`}
                    >
                      {card.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3.5, pt: 0 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      href={card.link}
                      fullWidth
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        py: 1,
                        borderWidth: 1.5,
                        "&:hover": {
                          borderWidth: 1.5,
                        },
                      }}
                    >
                      {t("home.explore_button")}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Bannière de Contribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <Card className="contribution-banner" elevation={0}>
          <CardContent sx={{ p: 0 }}>
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  color: "primary.main",
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <EditNoteIcon sx={{ fontSize: 36 }} />
                <Typography
                  variant="h5"
                  className="contribution-title"
                  component="h3"
                >
                  {t("home.contribution.title")}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 550, lineHeight: 1.6 }}
              >
                {t("home.contribution.desc")}
              </Typography>
              <Link href="/contribution" className="contribution-link">
                {t("home.contribution.link")}
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections d'activités récentes en colonnes */}
      <Grid container spacing={4} className="recent-sections-grid">
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentChanges />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentComments />
        </Grid>
      </Grid>
    </Container>
  );
}
