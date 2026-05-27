import { Container, Typography, Stack, Grid, Card, CardContent, Box, useTheme, Button } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import HubIcon from '@mui/icons-material/Hub';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export function AboutPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
    };

    const values = [
        {
            title: "Graphe de Connexions",
            description: "Visualisez les théorèmes et concepts non pas de manière isolée, mais comme un réseau interconnecté de connaissances mathématiques.",
            icon: <HubIcon sx={{ fontSize: 32 }} />,
            color: "#0ea5e9",
            bgColor: isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.08)"
        },
        {
            title: "Rigueur & Clarté",
            description: "Chaque fiche propose des énoncés LaTeX précis et des démonstrations détaillées pour allier rigueur scientifique et accessibilité visuelle.",
            icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
            color: "#8b5cf6",
            bgColor: isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.08)"
        },
        {
            title: "Savoir Collaboratif",
            description: "Le savoir se construit ensemble. Corrigez une coquille, proposez une amélioration ou ajoutez de nouvelles fiches pour faire grandir la cartographie.",
            icon: <GroupsIcon sx={{ fontSize: 32 }} />,
            color: "#10b981",
            bgColor: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.08)"
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <Stack spacing={8}>
                    {/* Hero Section */}
                    <motion.div variants={itemVariants}>
                        <Box 
                            sx={{
                                textAlign: 'center',
                                py: 6,
                                px: 4,
                                borderRadius: 6,
                                background: isDark 
                                    ? 'linear-gradient(135deg, rgba(9, 13, 22, 0.6) 0%, rgba(17, 24, 39, 0.6) 100%)'
                                    : 'linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)',
                                backdropFilter: 'blur(12px)',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box 
                                sx={{
                                    position: "absolute",
                                    top: -150,
                                    left: -150,
                                    width: 300,
                                    height: 300,
                                    borderRadius: "50%",
                                    background: "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
                                    filter: "blur(40px)"
                                }}
                            />
                            <Typography 
                                variant="h2" 
                                component="h1" 
                                sx={{ 
                                    fontWeight: 900, 
                                    mb: 2.5,
                                    letterSpacing: '-0.02em',
                                    background: isDark 
                                        ? 'linear-gradient(90deg, #38bdf8 0%, #a78bfa 100%)'
                                        : 'linear-gradient(90deg, #0284c7 0%, #7c3aed 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                À Propos de MathGraph
                            </Typography>
                            <Typography 
                                variant="h6" 
                                color="text.secondary" 
                                sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6, fontWeight: 500 }}
                            >
                                Ce projet a été créé pour offrir une visualisation claire et intuitive de l'univers mathématique. 
                                Chaque nœud représente un théorème ou un concept fondamental, facilitant l'exploration et la compréhension 
                                des liens étroits reliant les différentes branches des mathématiques.
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Grille des Valeurs */}
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
                            Les Piliers du Projet
                        </Typography>
                        <Grid container spacing={4}>
                            {values.map((v, i) => (
                                <Grid size={{ xs: 12, md: 4 }} key={i}>
                                    <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                        <Card 
                                            elevation={0}
                                            sx={{
                                                height: '100%',
                                                p: 3,
                                                borderRadius: 4,
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                                background: isDark ? 'rgba(15, 20, 40, 0.4)' : '#ffffff',
                                                transition: 'transform 0.2s ease, border-color 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    borderColor: v.color
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 0 }}>
                                                <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: 3, bgcolor: v.bgColor, color: v.color, mb: 3 }}>
                                                    {v.icon}
                                                </Box>
                                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                                                    {v.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                    {v.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Section Citation Inspirante */}
                    <motion.div variants={itemVariants}>
                        <Box 
                            sx={{
                                p: 5,
                                borderRadius: 4,
                                borderLeft: `6px solid ${isDark ? '#a78bfa' : '#7c3aed'}`,
                                bgcolor: isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.02)',
                                maxWidth: 800,
                                mx: 'auto'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontStyle: 'italic', mb: 2, fontWeight: 500, lineHeight: 1.6 }}>
                                "Les mathématiques ne sont pas seulement un ensemble de vérités froides et rigides, elles possèdent une beauté et une élégance qui n'ont rien à envier à l'art."
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: 'right', color: 'primary.main' }}>
                                — Adapté de Bertrand Russell
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Appel à l'action */}
                    <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontWeight: 500 }}>
                            Développé avec passion, ce projet est en constante évolution. Vos retours et contributions sont les bienvenus !
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="large"
                                href="/graph"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
                            >
                                Commencer l'exploration
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                size="large"
                                href="/contribution"
                                sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
                            >
                                Guide de Contribution
                            </Button>
                        </Stack>
                    </motion.div>
                </Stack>
            </motion.div>
        </Container>
    );
}