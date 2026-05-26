import { Container, Typography, Button, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function LostPage() {
    return (
        <>
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
            <Stack spacing={4}>
                <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', alignSelf: 'center' }} />
                <Typography variant="h3" component="h1">
                    404 - Page introuvable
                </Typography>
                <Typography variant="body1">
                    Désolé, nous n'avons pas trouvé la page que vous cherchez.
                </Typography>
                <Button variant="contained" href="/">
                    Retour à l'accueil
                </Button>
            </Stack>
        </Container>
        </>
    );
}