import {Container, Typography, Button, Stack, Grid, Card, CardContent, IconButton, Link, CardActions} from "@mui/material";
import {TopBar} from "./components/TopBar";


export function HomePage() {
    return (
        <>
            {/* Barre supérieure */}
            <TopBar />


            <Container maxWidth="md" sx={{ py: 8 }}>
                <Stack spacing={4} textAlign="center">
                    <Typography variant="h2" component="h1">
                        Bienvenue sur MathGraph
                    </Typography>
                    <Typography variant="body1">
                        Explorez visuellement les théorèmes, concepts et démonstrations mathématiques.
                        Découvrez les connexions, approfondissez vos connaissances et soutenez le projet.
                    </Typography>
                    <Button variant="contained" href="/graph">
                        Explorer le graphe
                    </Button>
                </Stack>

                {/* Section des liens esthétiques vers les pages */}
                <Grid container spacing={2} direction={"row"} sx={{ mt: 6,justifyContent: "space-around" }} >
                    {/* Carte pour Liste des Concepts */}
                    <Grid size={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Concepts Mathématiques
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Explorez la liste complète des concepts mathématiques disponibles.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary" href="/concept" fullWidth>
                                    Explorer
                                </Button>
                            </CardActions>

                        </Card>
                    </Grid>

                    {/* Carte pour Liste des Catégories */}
                    <Grid size={6}>
                    <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Catégories
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Découvrez les différentes catégories associées aux concepts.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary" href="/category" fullWidth>
                                    Explorer
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    {/* Carte pour Liste des Mathématiciens */}
                    <Grid size={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Mathématiciens
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Parcourez les biographies des mathématiciens contribuant au domaine.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary" href="/mathematicien" fullWidth>
                                    Explorer
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    {/* Carte pour Liste des Types */}
                    <Grid size={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Types Mathématiques
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Consultez les différents types de théorèmes et concepts disponibles.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="primary" href="/type" fullWidth>
                                    Explorer
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}