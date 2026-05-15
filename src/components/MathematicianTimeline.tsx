import React from 'react';
import { Chrono } from 'react-chrono';
import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { nodeApi } from '../services/api';

export const MathematicianTimeline: React.FC = () => {
    const theme = useTheme(); // Pour adapter les couleurs de la frise au mode sombre/clair !

    const { data: mathematicians, isLoading, error } = useQuery({
        queryKey: ['mathematicians-timeline'],
        queryFn: async () => {
            const result = await nodeApi.getMathematiciensTimeline();
            return result;
        }
    });

    if (isLoading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Erreur lors du chargement de la chronologie.</Typography>;
    if (!mathematicians || mathematicians.length === 0) return <Typography>Aucune date disponible.</Typography>;

    // 🌟 Formatage des données pour react-chrono
    const chronoItems = mathematicians.map(math => {
        const birthYear = dayjs(math.date_naissance).format('YYYY');
        const deathYear = math.date_deces ? dayjs(math.date_deces).format('YYYY') : 'Aujourd\'hui';

        return {
            title: birthYear, // Ce qui s'affiche sur la ligne du temps
            cardTitle: math.nom,
            cardSubtitle: `${birthYear} - ${deathYear} ${math.epoque ? `(${math.epoque})` : ''}`,
            cardDetailedText: math.biographie || "Aucune biographie disponible pour ce mathématicien.",
            // Optionnel : on pourrait même rajouter une `media` si on avait des portraits !
        };
    });

    return (
        <Box sx={{ width: '100%', height: '80vh', p: 2 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                Chronologie des Mathématiciens
            </Typography>

            <Chrono
                items={chronoItems}
                mode="VERTICAL_ALTERNATING" // Alterne gauche/droite (très élégant)
                theme={{
                    primary: theme.palette.primary.main,
                    secondary: theme.palette.background.paper,
                    cardBgColor: theme.palette.background.paper,
                    cardForeColor: theme.palette.text.primary,
                    titleColor: theme.palette.text.primary,
                }}
                enableOutline
                hideControls // Cache les boutons play/pause qui sont souvent superflus
                fontSizes={{
                    cardSubtitle: '0.85rem',
                    cardText: '1rem',
                    cardTitle: '1.25rem',
                    title: '1rem',
                }}
            />
        </Box>
    );
};