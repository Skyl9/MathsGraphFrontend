// DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { nodeApi } from '../../services/api';
import {AdminStats} from "../../types/ApiTypes/admin";



const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Exemple d'appel, à adapter selon votre API
                const data = await nodeApi.getAdminStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading || !stats) {
        return <CircularProgress />;
    }

    const cards = [
        { label: 'Utilisateurs', value: stats.users },
        { label: 'Favoris', value: stats.favorites },
        { label: 'Concepts', value: stats.concepts },
        { label: 'Catégories', value: stats.categories }
    ];

    return (
        <Grid container spacing={2}>
            {cards.map((c) => (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {c.label}
                        </Typography>
                        <Typography variant="h4">{c.value}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Grid>
    );
};

export default DashboardPage;