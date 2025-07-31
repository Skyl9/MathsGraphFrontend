import React, { useEffect, useState } from "react";
import { Container, Typography, Stack, CircularProgress, Box, Alert, List, ListItem, ListItemText, Link } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import {ConceptName} from "../types/types";
import {ReportIssueButton} from "../components/Issue";



const ConceptList: React.FC = () => {
    const [concept, setConcept] = useState<ConceptName[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Appel API pour récupérer les catégories
        const fetchCategories = async () => {
            try {
                const data = await nodeApi.getAllConceptNames();
                setConcept(data);
            } catch (err) {
                setError(nodeApi.handleError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    useEffect(()=>
        {
            console.log(concept)
        }
    )

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
                    {error && <Alert severity="error">{error}</Alert>}

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
                                                <Link href={`/node/${concept.id}`} underline="hover" color="primary">
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