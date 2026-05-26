import { Container, Typography, Stack, CircularProgress, Box, Alert, Card, CardContent, Button, Grid } from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { nodeApi } from "../services/api";
import { ReportIssueButton } from "../components/Issue";
import { motion, Variants } from "framer-motion";
import LayersIcon from "@mui/icons-material/Layers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const TypeList = () => {
    const { data: types = [], isLoading: loading, error } = useQuery({
        queryKey: ['type'],
        queryFn: () => nodeApi.getAllTypeNames()
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Stack spacing={4}>
                <Typography variant="h3" component="h1" textAlign="center" sx={{ fontWeight: 800, mb: 2 }}>
                    Types Mathématiques
                </Typography>

                {loading && (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                )}

                {error && <Alert severity="error">{error instanceof Error ? error.message : "Une erreur est survenue"}</Alert>}

                {!loading && !error && (
                    <>
                        {types.length === 0 ? (
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                Aucun Type trouvé.
                            </Typography>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                <Grid container spacing={3}>
                                    {types.map((t) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.id}>
                                            <motion.div variants={itemVariants} style={{ height: "100%" }}>
                                                <Card 
                                                    className="glass-card" 
                                                    elevation={0}
                                                    sx={{
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        background: "rgba(255, 255, 255, 0.7)",
                                                        backdropFilter: "blur(8px)",
                                                        border: "1px solid rgba(0, 0, 0, 0.06)",
                                                        borderRadius: 4,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "translateY(-4px)",
                                                            boxShadow: "0 10px 20px rgba(124, 58, 237, 0.08)",
                                                            borderColor: "secondary.main",
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3, pb: 1 }}>
                                                        <Box 
                                                            sx={{ 
                                                                width: 40, 
                                                                height: 40, 
                                                                display: "flex", 
                                                                alignItems: "center", 
                                                                justifyContent: "center", 
                                                                borderRadius: 2, 
                                                                background: "rgba(124, 58, 237, 0.1)", 
                                                                color: "secondary.main",
                                                                mb: 2 
                                                            }}
                                                        >
                                                            <LayersIcon />
                                                        </Box>
                                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1, textTransform: "capitalize" }}>
                                                            {t.type}
                                                        </Typography>
                                                    </CardContent>
                                                    <Box sx={{ p: 3, pt: 0 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            href={`/type/${t.id}`}
                                                            fullWidth
                                                            endIcon={<ArrowForwardIcon fontSize="small" />}
                                                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                                                        >
                                                            Consulter
                                                        </Button>
                                                    </Box>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </motion.div>
                        )}
                    </>
                )}
            </Stack>
            <ReportIssueButton />
        </Container>
    );
};

export default TypeList;
