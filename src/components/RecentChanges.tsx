import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, Chip, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import { nodeApi } from '../services/api';
import { useQuery } from '@tanstack/react-query';

dayjs.extend(relativeTime);
dayjs.locale('fr');

export interface RecentChange {
    id: number;
    concept_id: number;
    concept_nom: string;
    username: string;
    modified_at: string;
    field_modified: string;
    is_rollback: boolean;
}

export const RecentChanges: React.FC = () => {
    const { data: changes = [], isLoading: loading, error } = useQuery({
        queryKey: ['recentHistory'],
        queryFn: () => nodeApi.getRecentHistory(15)
    });

    if (loading) return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
    if (error) return <Typography color="error" align="center">Erreur lors de la récupération de l'historique : {(error as any).message}</Typography>;
    if (changes.length === 0) return <Typography variant="body2" color="textSecondary" align="center">Aucune activité récente.</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, maxHeight: '500px', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon color="primary" /> Activité récente
            </Typography>
            <List>
                {changes.map((change: RecentChange) => (
                    <ListItem key={change.id} divider alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: change.is_rollback ? 'warning.main' : 'primary.main' }}>
                                {change.is_rollback ? <RestoreIcon /> : change.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                    <Typography variant="subtitle2" component="span" fontWeight="bold">
                                        <Link to={`/user/${change.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {change.username}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" component="span" color="textSecondary">
                                        a {change.is_rollback ? 'restauré' : 'modifié'}
                                    </Typography>
                                    <Typography variant="subtitle2" component="span" color="primary">
                                        <Link to={`/concept/${change.concept_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {change.concept_nom}
                                        </Link>
                                    </Typography>
                                </Box>
                            }
                            secondary={
                                <Box mt={0.5} display="flex" alignItems="center" gap={1}>
                                    <Chip size="small" label={change.field_modified} variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                    <Typography variant="caption" color="textSecondary">
                                        • {dayjs(change.modified_at).fromNow()}
                                    </Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};