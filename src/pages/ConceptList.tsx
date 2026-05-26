import { Container, Typography, Stack, CircularProgress, Box, Alert, Card, CardContent, Button, Grid } from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { nodeApi } from "../services/api";
import { ReportIssueButton } from "../components/Issue";
import { motion, Variants } from "framer-motion";
import FunctionsIcon from "@mui/icons-material/Functions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ConceptList = () => {
    const { data: concepts = [], isLoading: loading, error } = useQuery({
        queryKey: ['concept'],
        queryFn: () => nodeApi.getAllConceptNames()
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
                    Concepts Mathématiques
                </Typography>

                {loading && (
                    <Box display="flex" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                )}

                {error && <Alert severity="error">{error instanceof Error ? error.message : "Une erreur est survenue"}</Alert>}

                {!loading && !error && (
                    <>
                        {concepts.length === 0 ? (
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                Aucun concept trouvé.
                            </Typography>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                <Grid container spacing={3}>
                                    {concepts.map((concept) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={concept.id}>
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
                                                            boxShadow: "0 10px 20px rgba(14, 165, 233, 0.08)",
                                                            borderColor: "primary.main",
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
                                                                background: "rgba(14, 165, 233, 0.1)", 
                                                                color: "primary.main",
                                                                mb: 2 
                                                            }}
                                                        >
                                                            <FunctionsIcon />
                                                        </Box>
                                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1, lineBreak: "anywhere" }}>
                                                            {concept.nom}
                                                        </Typography>
                                                    </CardContent>
                                                    <Box sx={{ p: 3, pt: 0 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            href={`/concept/${concept.id}`}
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

export default ConceptList;