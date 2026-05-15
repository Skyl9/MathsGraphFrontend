import React from "react";
import { Container, Typography, Stack, CircularProgress, Box, Alert, List, ListItem, ListItemText, Link } from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import {ReportIssueButton} from "../components/Issue";
import {MathematicianTimeline} from "../components/MathematicianTimeline.tsx";

const MathematicienList: React.FC = () => {
    const { data: mathematicien = [], isLoading: loading, error } = useQuery({
        queryKey: ['mathematicien'],
        queryFn: () => nodeApi.getAllMathematicienName()
    });

    return (
        <>
            {/* Barre supérieure */}
            <TopBar />

            <MathematicianTimeline></MathematicianTimeline>

            {/* Conteneur principal */}
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Stack spacing={4}>
                    {/* Titre principal */}
                    <Typography variant="h4" component="h1" textAlign="center">
                        Liste des Mathématiciens
                    </Typography>

                    {/* Indicateur de chargement */}
                    {loading && (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    )}

                    {/* Affichage des erreurs */}
                    {error && <Alert severity="error">{(error as any).message}</Alert>}

                    {/* Liste des catégories */}
                    {!loading && !error && (
                        <>
                            {mathematicien.length === 0 ? (
                                <Typography variant="body1" color="textSecondary" textAlign="center">
                                    Aucun Mathématicien trouvée.
                                </Typography>
                            ) : (
                                <List>
                                    {mathematicien.map((mathematicien) => (
                                        <ListItem key={mathematicien.id}>
                                            <ListItemText>
                                                <Link href={`/mathematicien/${mathematicien.id}`} underline="hover" color="primary">
                                                    {mathematicien.nom}
                                                </Link>
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </>
                    )}
                </Stack>
                <ReportIssueButton/>
            </Container>
        </>
    );
};

export default MathematicienList;

