import React, { useEffect, useState } from "react";
import { Container, Typography, Stack, CircularProgress, Box, Alert, List, ListItem, ListItemText, Link } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import {MathematicienName} from "../types/types";



const MathematicienList: React.FC = () => {
    const [mathematicien, setMathematicien] = useState<MathematicienName[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Appel API pour récupérer les catégories
        const fetchCategories = async () => {
            try {
                const data = await nodeApi.getAllMathematicienName();
                setMathematicien(data);
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
            console.log(mathematicien)
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
                        Liste des Mathématiciens
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
            </Container>
        </>
    );
};

export default MathematicienList;