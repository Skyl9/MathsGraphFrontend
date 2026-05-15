import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, CircularProgress } from '@mui/material';
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
    const { data: comments = [], isLoading: loading, error } = useQuery({
        queryKey: ['recentComments'],
        queryFn: () => nodeApi.getRecentComments(15)
    });

    if (loading) return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
    if (error) return <Typography color="error" align="center">Erreur récupération commentaires : {(error as any).message}</Typography>;
    if (comments.length === 0) return <Typography variant="body2" color="textSecondary" align="center">Aucun commentaire récent.</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, maxHeight: '500px', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ForumIcon color="secondary" /> Dernières discussions
            </Typography>
            <List>
                {comments.map((comment: RecentComment) => (
                    <ListItem key={comment.id} divider alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                {comment.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="baseline" gap={1} flexWrap="wrap">
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        <Link to={`/user/${comment.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {comment.username}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        sur <Link to={`/concept/${comment.concept_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {comment.concept_nom}
                                    </Link>
                                    </Typography>
                                </Box>
                            }
                            secondary={
                                <Box mt={0.5}>
                                    <Typography variant="body2" color="textPrimary" sx={{ fontStyle: 'italic' }}>
                                        "{comment.content.length > 60 ? comment.content.substring(0, 60) + '...' : comment.content}"
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
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