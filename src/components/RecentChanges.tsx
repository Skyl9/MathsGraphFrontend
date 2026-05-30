import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  useTheme
} from '@mui/material';
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

import { RecentChange } from '../types/ApiTypes/concept';

export const RecentChanges: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { data: changes = [], isLoading: loading, error } = useQuery({
        queryKey: ['recentHistory'],
        queryFn: () => nodeApi.getRecentHistory(15)
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={8}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Typography color="error" align="center" sx={{ p: 4 }}>
                Erreur lors de la récupération de l'historique : {error instanceof Error ? error.message : String(error)}
            </Typography>
        );
    }
    if (changes.length === 0) {
        return (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ p: 4 }}>
                Aucune activité récente.
            </Typography>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                maxHeight: '520px',
                overflowY: 'auto',
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                boxShadow: isDark ? '0 8px 32px 0 rgba(0, 0, 0, 0.2)' : '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                },
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800, mb: 3, letterSpacing: '-0.01em' }}>
                <EditIcon color="primary" /> Modifications récentes
            </Typography>
            <List sx={{ py: 0 }}>
                {changes.map((change: RecentChange) => (
                    <ListItem
                        key={change.id}
                        alignItems="flex-start"
                        sx={{
                            px: 1,
                            py: 1.5,
                            borderRadius: 2,
                            mb: 1,
                            transition: 'background-color 0.2s ease',
                            '&:hover': {
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
                            },
                            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                            '&:last-child': {
                                borderBottom: 'none',
                                mb: 0
                            }
                        }}
                    >
                        <ListItemAvatar sx={{ mt: 0.5 }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: change.is_rollback ? 'rgba(237, 108, 2, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                                    color: change.is_rollback ? 'warning.main' : 'primary.main',
                                    border: '1px solid',
                                    borderColor: change.is_rollback ? 'rgba(237, 108, 2, 0.2)' : 'rgba(25, 118, 210, 0.2)',
                                    fontWeight: 700,
                                    fontSize: '0.95rem'
                                }}
                            >
                                {change.is_rollback ? <RestoreIcon sx={{ fontSize: 18 }} /> : change.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
                                    <Typography
                                        variant="subtitle2"
                                        component="span"
                                        sx={{
                                            fontWeight: 700,
                                            '& a': {
                                                textDecoration: 'none',
                                                color: 'text.primary',
                                                transition: 'color 0.2s ease',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                }
                                            }
                                        }}
                                    >
                                        <Link to={`/user/${change.username}`}>
                                            {change.username}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" component="span" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                        a {change.is_rollback ? 'restauré' : 'modifié'}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        component="span"
                                        sx={{
                                            fontWeight: 700,
                                            '& a': {
                                                textDecoration: 'none',
                                                color: 'primary.main',
                                                transition: 'color 0.2s ease',
                                                '&:hover': {
                                                    color: 'primary.dark',
                                                    textDecoration: 'underline'
                                                }
                                            }
                                        }}
                                    >
                                        <Link to={`/concept/${change.concept_id}`}>
                                            {change.concept_nom}
                                        </Link>
                                    </Typography>
                                </Box>
                            }
                            secondary={
                                <Box mt={0.75} display="flex" alignItems="center" gap={1.25}>
                                    <Chip
                                        size="small"
                                        label={change.field_modified}
                                        variant="outlined"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            borderRadius: 1,
                                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                                            color: 'text.secondary'
                                        }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {dayjs(change.modified_at).fromNow()}
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