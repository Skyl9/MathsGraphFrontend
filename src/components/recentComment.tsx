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
  CircularProgress,
  useTheme
} from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import { nodeApi } from '../services/api';
import { useQuery } from '@tanstack/react-query';

dayjs.extend(relativeTime);
dayjs.locale('fr');

export interface RecentComment {
    id: number;
    concept_id: number;
    concept_nom: string;
    username: string;
    content: string;
    created_at: string;
    field: string;
}

export const RecentComments: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { data: comments = [], isLoading: loading, error } = useQuery({
        queryKey: ['recentComments'],
        queryFn: () => nodeApi.getRecentComments(15)
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
                Erreur lors de la récupération des commentaires : {error instanceof Error ? error.message : String(error)}
            </Typography>
        );
    }
    if (comments.length === 0) {
        return (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ p: 4 }}>
                Aucun commentaire récent.
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
                <ForumIcon color="secondary" sx={{ color: 'secondary.main' }} /> Dernières discussions
            </Typography>
            <List sx={{ py: 0 }}>
                {comments.map((comment: RecentComment) => (
                    <ListItem
                        key={comment.id}
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
                                    bgcolor: 'rgba(156, 39, 176, 0.1)',
                                    color: 'secondary.main',
                                    border: '1px solid rgba(156, 39, 176, 0.2)',
                                    fontWeight: 700,
                                    fontSize: '0.95rem'
                                }}
                            >
                                {comment.username.charAt(0).toUpperCase()}
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
                                                    color: 'secondary.main',
                                                }
                                            }
                                        }}
                                    >
                                        <Link to={`/user/${comment.username}`}>
                                            {comment.username}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" component="span" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                        sur
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
                                        <Link to={`/concept/${comment.concept_id}`}>
                                            {comment.concept_nom}
                                        </Link>
                                    </Typography>
                                </Box>
                            }
                            secondary={
                                <Box mt={0.75}>
                                    <Typography
                                        variant="body2"
                                        color="text.primary"
                                        sx={{
                                            fontStyle: 'italic',
                                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                                            px: 1.5,
                                            py: 1,
                                            borderRadius: 2,
                                            borderLeft: '2px solid',
                                            borderColor: 'secondary.light',
                                            my: 0.75,
                                            fontSize: '0.9rem',
                                            color: 'text.primary'
                                        }}
                                    >
                                        « {comment.content.length > 70 ? comment.content.substring(0, 70) + '...' : comment.content} »
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {dayjs(comment.created_at).fromNow()} • Champ : {comment.field}
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