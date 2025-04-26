import { Container, Typography, Button, Stack } from '@mui/material';

export function AboutPage() {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Stack spacing={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    À propos
                </Typography>
                <Typography variant="body1">
                    Ce projet a été créé pour offrir une visualisation claire et intuitive de l'univers mathématique.
                    Chaque nœud représente un théorème ou un concept fondamental.
                    Le but est d'aider à mieux comprendre les liens entre différentes branches des mathématiques.
                </Typography>
                <Typography variant="body1">
                    Développé avec passion, ce projet est en constante évolution. Vos retours sont les bienvenus !
                </Typography>
            </Stack>
        </Container>
    );
}