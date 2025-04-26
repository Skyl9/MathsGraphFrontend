import { Container, Typography, Button, Stack } from '@mui/material';

export function HomePage() {
    return (
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
        </Container>
    );
}