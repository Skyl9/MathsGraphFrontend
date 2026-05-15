import React from "react";
import { Container, Typography, Stack, CircularProgress, Box, Alert, List, ListItem, ListItemText, Link } from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import {ReportIssueButton} from "../components/Issue";

const TypeList: React.FC = () => {
    const { data: type = [], isLoading: loading, error } = useQuery({
        queryKey: ['type'],
        queryFn: () => nodeApi.getAllTypeNames()
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
                        Liste des Types
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

