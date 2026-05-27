import { Container, Grid, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Box, Stack, useTheme } from "@mui/material";
import { motion, Variants } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import EditNoteIcon from "@mui/icons-material/EditNote";

const ContributionPage: React.FC = () => {
    const theme = useTheme();
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

    const dos = [
        "Corriger une erreur ou une faute (orthographe, explications…)",
        "Ajouter des exemples, précisions, ou références fiables",
        "Améliorer la clarté d’un texte sans le rendre trop complexe",
        "Créer une nouvelle fiche sur un sujet pertinent"
    ];

    const donts = [
        "Copier du contenu protégé par des droits d’auteur",
        "Effacer sans raison du travail d’un·e autre",
        "Ajouter des blagues, opinions ou contenus hors sujet",
        "Mettre en avant un site, produit ou service"
    ];

    const tips = [
        "Relisez-vous avant de valider !",
        "Si vous n’êtes pas sûr, proposez : la modération vous aidera.",
        "Restez bienveillant et respectueux envers les autres contributeurs."
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <Stack spacing={6}>
                    {/* Header */}
                    <motion.div variants={itemVariants} style={{ textAlign: "center" }}>
                        <Box sx={{ display: "inline-flex", p: 2, borderRadius: "50%", bgcolor: isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.08)", color: "primary.main", mb: 3 }}>
                            <EditNoteIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 900, 
                                mb: 2,
                                letterSpacing: "-0.02em"
                            }}
                        >
                            Mode d’emploi de Contribution
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, mx: "auto", lineHeight: 1.6, fontWeight: 500 }}>
                            Merci de vouloir enrichir MathGraph ! Pour que la cartographie du savoir mathématique reste fiable et agréable à consulter, voici quelques règles simples.
                        </Typography>
                    </motion.div>

                    {/* Do's & Don'ts Columns */}
                    <Grid container spacing={4}>
                        {/* Ce que vous pouvez faire */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div variants={itemVariants} style={{ height: "100%" }}>
                                <Paper 
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: "100%",
                                        borderRadius: 4,
                                        border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.15)"}`,
                                        background: isDark ? "rgba(16, 185, 129, 0.03)" : "rgba(16, 185, 129, 0.01)"
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 850, color: "success.main" }}>
                                            Recommandé
                                        </Typography>
                                    </Stack>
                                    <List sx={{ p: 0 }}>
                                        {dos.map((item, index) => (
                                            <ListItem key={index} sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                                                <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                                                    <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={item} 
                                                    primaryTypographyProps={{ variant: "body1", fontWeight: 500, lineHeight: 1.5 }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Ce qu'il faut éviter */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <motion.div variants={itemVariants} style={{ height: "100%" }}>
                                <Paper 
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: "100%",
                                        borderRadius: 4,
                                        border: `1px solid ${isDark ? "rgba(244, 63, 94, 0.2)" : "rgba(244, 63, 94, 0.15)"}`,
                                        background: isDark ? "rgba(244, 63, 94, 0.03)" : "rgba(244, 63, 94, 0.01)"
                                    }}
                                >
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                        <CancelIcon color="error" sx={{ fontSize: 28 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 850, color: "error.main" }}>
                                            À Éviter
                                        </Typography>
                                    </Stack>
                                    <List sx={{ p: 0 }}>
                                        {donts.map((item, index) => (
                                            <ListItem key={index} sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                                                <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                                                    <CancelIcon color="error" sx={{ fontSize: 20 }} />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={item} 
                                                    primaryTypographyProps={{ variant: "body1", fontWeight: 500, lineHeight: 1.5 }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>

                    {/* Quelques bons réflexes */}
                    <motion.div variants={itemVariants}>
                        <Paper 
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0,0,0,0.06)"}`,
                                background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff"
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <EmojiObjectsIcon color="warning" sx={{ fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    Quelques Bons Réflexes
                                </Typography>
                            </Stack>
                            <Grid container spacing={3}>
                                {tips.map((tip, index) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={index}>
                                        <Box 
                                            sx={{
                                                p: 3, 
                                                borderRadius: 3, 
                                                bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0,0,0,0.02)",
                                                height: "100%",
                                                borderLeft: "4px solid",
                                                borderColor: "warning.main"
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.5 }}>
                                                {tip}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </motion.div>

                    {/* Footer note */}
                    <motion.div variants={itemVariants} style={{ textAlign: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                            🚀 Chaque correction ou ajout, même minime, aide l’ensemble de la communauté mathématique !
                        </Typography>
                    </motion.div>
                </Stack>
            </motion.div>
        </Container>
    );
};

export default ContributionPage;
