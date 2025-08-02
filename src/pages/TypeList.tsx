import React, { useEffect, useState } from "react";
import { Container, Typography, Stack, CircularProgress, Box, Alert, List, ListItem, ListItemText, Link } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import {TypeName} from "../types/types";
import {ReportIssueButton} from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";



const TypeList: React.FC = () => {
    const [type, setType] = useState<TypeName[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Appel API pour récupérer les catégories
        const fetchCategories = async () => {
            try {
                const data = await nodeApi.getAllTypeNames();
                setType(data);
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
            console.log(type)
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
                        Liste des Types
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
                            {type.length === 0 ? (
                                <Typography variant="body1" color="textSecondary" textAlign="center">
                                    Aucun Type trouvé.
                                </Typography>
                            ) : (
                                <List>
                                    {type.map((type) => (
                                        <ListItem key={type.id}>
                                            <ListItemText>
                                                <Link href={`/type/${type.id}`} underline="hover" color="primary">
                                                    {type.type}
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

export default TypeList;