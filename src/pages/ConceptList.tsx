import React from "react";
import { Container, Typography, Stack, CircularProgress, Box, Alert, List, ListItem, ListItemText, Link } from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import {ReportIssueButton} from "../components/Issue";

const ConceptList: React.FC = () => {
    const { data: concept = [], isLoading: loading, error } = useQuery({
        queryKey: ['concept'],
        queryFn: () => nodeApi.getAllConceptNames()
    });

    return (
        <>
            {/* Barre supérieure */}
            <TopBar />

            {/* Conteneur principal */}
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Stack spacing={4}>
                    {/* Titre principal */}
                    <Typography variant="h4" component="h1" textAlign="center">
                        Liste des Concepts mathématiques
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
                            {concept.length === 0 ? (
                                <Typography variant="body1" color="textSecondary" textAlign="center">
                                    Aucun Concept trouvé.
                                </Typography>
                            ) : (
                                <List>
                                    {concept.map((concept) => (
                                        <ListItem key={concept.id}>
                                            <ListItemText>
                                                <Link href={`/concept/${concept.id}`} underline="hover" color="primary">
                                                    {concept.nom}
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

export default ConceptList;