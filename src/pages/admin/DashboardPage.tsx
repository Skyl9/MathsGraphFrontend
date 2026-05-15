import React from 'react';
import {
    Grid, Card, CardContent, Typography, CircularProgress,
    Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Alert
} from '@mui/material';
import { nodeApi } from '../../services/api';
import { useQuery } from "@tanstack/react-query";

const DashboardPage: React.FC = () => {
    // 1. Récupération des analytics en temps réel (rafraîchi toutes les 10s)
    const { data: analytics, isLoading: loadingAnalytics } = useQuery({
        queryKey: ['apiAnalytics'],
        queryFn: () => nodeApi.getApiAnalytics(),
        refetchInterval: 10000
    });

    // 2. Récupération des stats générales
    const { data: stats, isLoading: loadingStats, error } = useQuery({
        queryKey: ['adminStats'],
        queryFn: () => nodeApi.getAdminStats()
    });

    if (loadingStats || loadingAnalytics) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{(error as any).message}</Alert>;
    }

    if (!stats) return null;

    // 🌟 Mise à jour de la clé pour correspondre au backend (daily_hits)
    const cards = [
        { label: 'Utilisateurs', value: stats.users },
        { label: 'Favoris', value: stats.favorites },
        { label: 'Concepts', value: stats.concepts },
        { label: 'Catégories', value: stats.categories },
        { label: "Requêtes API (Aujourd'hui)", value: analytics?.daily_hits || "0" }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Tableau de bord
            </Typography>

            {/* =======================================
                SECTION 1 : LES CARTES DE STATISTIQUES
            ======================================= */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {cards.map((c, index) => (
                    // Ajout du <Grid item> indispensable pour la mise en page MUI
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    {c.label}
                                </Typography>
                                <Typography variant="h4" color={c.label.includes('API') ? 'primary' : 'text.primary'}>
                                    {c.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* =======================================
                SECTION 2 : LE TABLEAU DES ANALYTICS
            ======================================= */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Top 10 des routes de l'API
            </Typography>

            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell><strong>Méthode</strong></TableCell>
                            <TableCell><strong>Route (Endpoint)</strong></TableCell>
                            <TableCell align="right"><strong>Appels totaux</strong></TableCell>
                            <TableCell align="right"><strong>Temps de réponse (moyen)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {analytics?.top_routes && analytics.top_routes.length > 0 ? (
                            analytics.top_routes.map((route: any, index: number) => (
                                <TableRow key={index} hover>
                                    <TableCell>
                                        <Chip
                                            label={route.method}
                                            color={
                                                route.method === 'GET' ? 'success' :
                                                    route.method === 'POST' ? 'info' :
                                                        route.method === 'DELETE' ? 'error' : 'warning'
                                            }
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace' }}>{route.endpoint}</TableCell>
                                    <TableCell align="right">{route.total_hits}</TableCell>
                                    <TableCell align="right">{route.avg_duration} ms</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">Aucune donnée d'API enregistrée pour le moment.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default DashboardPage;