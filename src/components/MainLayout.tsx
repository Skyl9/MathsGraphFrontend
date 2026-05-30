import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container, Typography, Link, Stack, Divider, useTheme } from "@mui/material";
import { TopBar } from "./TopBar";
import { motion, AnimatePresence } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";

export const MainLayout: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
        >
            {/* Barre de navigation supérieure */}
            <TopBar />

            {/* Zone de contenu principal avec animation d'entrée */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ display: "flex", flexDirection: "column", flexGrow: 1, width: "100%" }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* Pied de page (Footer) */}
            <Box
                component="footer"
                sx={{
                    py: 4,
                    px: 2,
                    mt: "auto",
                    backgroundColor: isDark ? "#080c18" : "#f1f5f9",
                    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    transition: "background-color 0.3s ease, border-color 0.3s ease",
                }}
            >
                <Container maxWidth="lg">
                    <GridFooter />
                </Container>
            </Box>
        </Box>
    );
};

const GridFooter: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
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
                            background: isDark 
                                ? "linear-gradient(90deg, #7DD3FC 0%, #C4B5FD 100%)" 
                                : "linear-gradient(90deg, #0EA5E9 0%, #7C3AED 100%)",
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
                    <Link href="/about" underline="none" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                        À propos
                    </Link>
                    <Link href="/contribution" underline="none" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                        Contribuer
                    </Link>
                    <Link href="/support" underline="none" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                        Soutenir
                    </Link>
                    <Link 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener" 
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", "&:hover": { color: "primary.main" } }}
                    >
                        <GitHubIcon sx={{ fontSize: 20 }} />
                    </Link>
                </Stack>
            </Stack>

            <Divider sx={{ opacity: isDark ? 0.1 : 0.6 }} />

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Typography variant="body2" color="text.secondary">
                    © {currentYear} MathGraph. Tous droits réservés.
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                    Visualisation interactive et collaborative des concepts mathématiques.
                </Typography>
            </Stack>
        </Stack>
    );
};
