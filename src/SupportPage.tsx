import { Container, Typography, Button, Stack } from '@mui/material';
export function SupportPage() {
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Stack spacing={4} textAlign="center">
                <Typography variant="h3" component="h1" gutterBottom>
                    Soutenir le projet
                </Typography>
                <Typography variant="body1">
                    Vous appréciez MathGraph ? Vous pouvez soutenir son développement !
                </Typography>
                <Button variant="outlined" color="primary" href="https://www.patreon.com/">
                    Me soutenir sur Patreon
                </Button>
            </Stack>
        </Container>
    );
}