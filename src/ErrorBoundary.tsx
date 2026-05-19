import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Alert, Button } from '@mui/material';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Mettez à jour l'état pour que le prochain rendu affiche l'interface de repli.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Erreur non attrapée par le boundary:", error, errorInfo);
        // Vous pouvez également envoyer l'erreur à un service de journalisation d'erreurs ici (ex: Sentry)
        // captureException(error, { extra: errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            // Vous pouvez rendre n'importe quelle interface de repli personnalisée
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                    bgcolor="background.default"
                    p={3}
                >
                    <Alert severity="error" sx={{ mb: 2, textAlign: 'center' }}>
                        <h2>Oups, quelque chose s'est mal passé.</h2>
                        <p>Nous sommes désolés pour le désagrément.</p>
                        {import.meta.env.DEV && this.state.error && (
                            <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                                {this.state.error.message}
                                <br />
                                {this.state.error.stack}
                            </details>
                        )}
                    </Alert>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        Recharger la page
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;