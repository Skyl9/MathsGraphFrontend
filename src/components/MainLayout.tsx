import { styled, alpha } from "@mui/material/styles";
import React from "react";
import { useOutlet, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import { TopBar } from "./TopBar";
import { motion, AnimatePresence } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useTranslation } from "react-i18next";
import { pageTransitionVariants } from "../utils/animations";

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: alpha(theme.palette.background.default, 0.85),
  backdropFilter: "blur(4px)",
  color: theme.palette.text.primary,
  transition: "background-color 0.3s ease, color 0.3s ease",
}));

const MainContent = styled("main")(() => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

const FooterContainer = styled("footer")(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  marginTop: "auto",
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.default, 0.5)
      : theme.palette.grey[100],
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
  transition: "background-color 0.3s ease, border-color 0.3s ease",
}));

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <LayoutRoot>
      <TopBar />
      <MainContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransitionVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
            }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </MainContent>

      <FooterContainer>
        <Container maxWidth="lg">
          <GridFooter />
        </Container>
      </FooterContainer>
    </LayoutRoot>
  );
};

const GridFooter: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.1rem",
              background: theme.gradients.text.primary,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MATHGRAPH
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 3 }}
          alignItems="center"
        >
          <Link
            href="/about"
            underline="none"
            color="text.secondary"
            sx={{ "&:hover": { color: "primary.main" } }}
          >
            {t("footer.about")}
          </Link>
          <Link
            href="/contribution"
            underline="none"
            color="text.secondary"
            sx={{ "&:hover": { color: "primary.main" } }}
          >
            {t("footer.contribute")}
          </Link>
          <Link
            href="/support"
            underline="none"
            color="text.secondary"
            sx={{ "&:hover": { color: "primary.main" } }}
          >
            {t("footer.support")}
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { color: "primary.main" },
            }}
          >
            <GitHubIcon sx={{ fontSize: 20 }} />
          </Link>
        </Stack>
      </Stack>

      <Divider sx={{ opacity: theme.palette.mode === "dark" ? 0.1 : 0.6 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="body2" color="text.secondary">
          © {currentYear} MathGraph. {t("footer.rights")}
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center">
          {t("footer.tagline")}
        </Typography>
      </Stack>
    </Stack>
  );
};
