import {
    Card, CardContent, Typography, CircularProgress,
    Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Alert, Grid, useTheme
} from '@mui/material';
import { nodeApi } from '../../services/api';
import { useQuery } from "@tanstack/react-query";
import { AdminStats } from '../../types/ApiTypes/admin';

// Icônes
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FunctionsIcon from "@mui/icons-material/Functions";
import CategoryIcon from "@mui/icons-material/Category";
import SpeedIcon from "@mui/icons-material/Speed";

interface ApiRouteMetric {
    method: string;
    endpoint: string;
    total_hits: number;
    avg_duration: number;
}

interface ApiAnalytics {
    daily_hits: number;
    top_routes: ApiRouteMetric[];
}

const DashboardPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // 1. Récupération des analytics en temps réel (rafraîchi toutes les 10s)
    const { data: analytics, isLoading: loadingAnalytics } = useQuery<ApiAnalytics>({
        queryKey: ['apiAnalytics'],
        queryFn: () => nodeApi.getApiAnalytics(),
        refetchInterval: 10000
    });

    // 2. Récupération des stats générales
    const { data: stats, isLoading: loadingStats, error } = useQuery<AdminStats>({
        queryKey: ['adminStats'],
        queryFn: () => nodeApi.getAdminStats()
    });

    if (loadingStats || loadingAnalytics) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error instanceof Error ? error.message : 'Une erreur est survenue'}</Alert>;
    }

    if (!stats) return null;

    // Métriques associées à des icônes et couleurs adaptées
    const cards = [
        { 
            label: 'Utilisateurs', 
            value: stats.users, 
            icon: <PeopleIcon sx={{ fontSize: 24 }} />, 
            color: '#0ea5e9',
            bgColor: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.08)'
        },
        { 
            label: 'Favoris', 
            value: stats.favorites, 
            icon: <FavoriteIcon sx={{ fontSize: 24 }} />, 
            color: '#f43f5e',
            bgColor: isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.08)'
        },
        { 
            label: 'Concepts', 
            value: stats.concepts, 
            icon: <FunctionsIcon sx={{ fontSize: 24 }} />, 
            color: '#8b5cf6',
            bgColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)'
        },
        { 
            label: 'Catégories', 
            value: stats.categories, 
            icon: <CategoryIcon sx={{ fontSize: 24 }} />, 
            color: '#f97316',
            bgColor: isDark ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.08)'
        },
        { 
            label: "Appels API (Aujourd'hui)", 
            value: analytics?.daily_hits || "0", 
            icon: <SpeedIcon sx={{ fontSize: 24 }} />, 
            color: '#10b981',
            bgColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)'
        }
    ];

    // Calcul du maximum d'appels pour la jauge visuelle de traffic dans le tableau
    const maxHits = analytics?.top_routes?.reduce((max, r) => r.total_hits > max ? r.total_hits : max, 1) || 1;

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, letterSpacing: "-0.01em" }}>
                Tableau de Bord Administration
            </Typography>

            {/* Cartes de statistiques */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {cards.map((c, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={index}>
                        <Card 
                            elevation={0} 
                            sx={{ 
                                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                                borderRadius: 4,
                                background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                                transition: "transform 0.2s ease, border-color 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    borderColor: c.color
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.03em" }}>
                                        {c.label}
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: isDark ? "#ffffff" : "#0f172a" }}>
                                        {c.value}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: c.bgColor, color: c.color, display: "flex", alignItems: "center" }}>
                                    {c.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tableau des Analytics */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5 }}>
                Top des Routes de l'API
            </Typography>

            <Paper 
                elevation={0} 
                sx={{ 
                    overflow: 'hidden', 
                    borderRadius: 4, 
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff"
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Méthode</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Route (Endpoint)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Appels Totaux</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Temps Moyen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {analytics?.top_routes && analytics.top_routes.length > 0 ? (
                            analytics.top_routes.map((route, index) => (
                                <TableRow key={index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell sx={{ py: 1.5 }}>
                                        <Chip
                                            label={route.method}
                                            color={
                                                route.method === 'GET' ? 'success' :
                                                    route.method === 'POST' ? 'info' :
                                                        route.method === 'DELETE' ? 'error' : 'warning'
                                            }
                                            size="small"
                                            sx={{ fontWeight: 800, borderRadius: 1.5, fontSize: "0.75rem" }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500, fontSize: "0.9rem", color: isDark ? "grey.300" : "grey.800" }}>
                                        {route.endpoint}
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.5 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{route.total_hits}</Typography>
                                            {/* Jauge visuelle de traffic */}
                                            <Box sx={{ width: 80, height: 6, bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden", display: { xs: "none", sm: "block" } }}>
                                                <Box sx={{ width: `${(route.total_hits / maxHits) * 100}%`, height: "100%", bgcolor: "primary.main", borderRadius: 3 }} />
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.5, fontWeight: 600 }}>
                                        <Chip 
                                            label={`${route.avg_duration} ms`} 
                                            variant="outlined" 
                                            size="small"
                                            color={route.avg_duration > 150 ? "warning" : "default"}
                                            sx={{ borderRadius: 1.5, fontWeight: 700 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                    <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>Aucune donnée d'API enregistrée pour le moment.</Typography>
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