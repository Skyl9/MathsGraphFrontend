import { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nodeApi } from '../services/api';
import { useParams } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { EditModalAvatar } from '../components/EditModalAvatar';
import { ReportIssueButton } from "../components/Issue";
import FavoriteList from "../components/FavoriteList";
import UserContributions from "../components/UserContributions.tsx";
import { User } from '../types/ApiTypes/user';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['userProfile', id],
    queryFn: () => nodeApi.getUserInfo(id || ""),
    enabled: !!id
  });

  // Champs individuels (état local pour l'édition)
  const [editField, setEditField] = useState<null | "email" | "preferred_language" | "bio" | "avatar">(null);
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("");
  const [bio, setBio] = useState("");

  // Synchroniser l'état local avec les données reçues pour l'édition
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setLang(user.preferred_language);
      setBio(user.bio);
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string, value: string }) => {
      if (!id) throw new Error("ID manquant");
      return nodeApi.patchUser({ field, value }, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', id] });
      setEditField(null);
    }
  });

  const handleFieldSave = (field: "email" | "preferred_language" | "bio") => {
    let value = "";
    if (field === "email") value = email;
    if (field === "preferred_language") value = lang;
    if (field === "bio") value = bio;
    updateUserMutation.mutate({ field, value });
  };

  const handleAvatarSubmit = (avatarUrl: string) => {
    updateUserMutation.mutate({ field: "avatar_url", value: avatarUrl });
  };

  if (isLoading || !user) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <>
      <TopBar />
      <EditModalAvatar
        open={editField === "avatar"}
        onClose={() => setEditField(null)}
        onSubmit={handleAvatarSubmit}
      />

      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
              <Avatar
                src={user.avatar_url || '/default-avatar.png'}
                sx={{ width: 200, height: 200, margin: '0 auto', mb: 2 }}
              />
              <Button onClick={() => setEditField("avatar")}>
                {user.avatar_url
                  ? "Modifier la photo de profil"
                  : "Ajouter une photo de profil"
                }
              </Button>

              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Chip
                label={user.role}
                color={
                  user.role === 'admin'
                    ? 'error'
                    : user.role === 'moderator'
                      ? 'warning'
                      : 'primary'
                }
                sx={{ mb: 2 }}
              />
              <Chip
                label={user.is_active ? 'Actif' : 'Inactif'}
                color={user.is_active ? 'success' : 'default'}
                sx={{ ml: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Informations personnelles
                  </Typography>
                </Grid>
                {/* Email */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  {editField === "email" ? (
                    <>
                      <TextField
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mt: 1, mb: 1 }}
                      />
                      <Button onClick={() => handleFieldSave("email")} variant="contained" size="small" sx={{ mr: 1 }}>Enregistrer</Button>
                      <Button onClick={() => { setEditField(null); setEmail(user.email); }} size="small">Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Typography>{user.email}</Typography>
                      <Button onClick={() => setEditField("email")} size="small" sx={{ ml: 1 }}>Modifier</Button>
                    </>
                  )}
                </Grid>
                {/* Langue préférée */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">Langue préférée</Typography>
                  {editField === "preferred_language" ? (
                    <>
                      <TextField
                        value={lang}
                        onChange={e => setLang(e.target.value)}
                        select
                        fullWidth
                        size="small"
                        sx={{ mt: 1, mb: 1 }}
                      >
                        <MenuItem value="fr">Français</MenuItem>
                        <MenuItem value="en">Anglais</MenuItem>
                        <MenuItem value="es">Espagnol</MenuItem>
                      </TextField>
                      <Button onClick={() => handleFieldSave("preferred_language")} variant="contained" size="small" sx={{ mr: 1 }}>Enregistrer</Button>
                      <Button onClick={() => { setEditField(null); setLang(user.preferred_language); }} size="small">Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Typography>{user.preferred_language}</Typography>
                      <Button onClick={() => setEditField("preferred_language")} size="small" sx={{ ml: 1 }}>Modifier</Button>
                    </>
                  )}
                </Grid>
                {/* Bio */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">Biographie</Typography>
                  {editField === "bio" ? (
                    <>
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        sx={{ mt: 1, mb: 1 }}
                      />
                      <Button onClick={() => handleFieldSave("bio")} variant="contained" size="small" sx={{ mr: 1 }}>Enregistrer</Button>
                      <Button onClick={() => { setEditField(null); setBio(user.bio); }} size="small">Annuler</Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ mt: 1 }}>{user.bio || 'Aucune biographie'}</Typography>
                      <Button onClick={() => setEditField("bio")} size="small" sx={{ ml: 1 }}>Modifier</Button>
                    </>
                  )}
                </Grid>
                {/* Date d'inscription */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">Date d'inscription</Typography>
                  <Typography>
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </Grid>
                {/* Dernière connexion */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">Dernière connexion</Typography>
                  <Typography>
                    {user.updated_at ? new Date(user.updated_at).toLocaleDateString('fr-FR') : 'Jamais'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <ReportIssueButton />
        <Box sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={4}>
            {/* Colonne de gauche : Favoris */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>Favoris</Typography>
              <Paper elevation={2} sx={{ p: 2, minHeight: '200px' }}>
                <FavoriteList userId={id}></FavoriteList>
              </Paper>
            </Grid>

            {/* Colonne de droite : Historique des contributions */}
            <Grid size={{ xs: 12, md: 6 }}>
              {id && <UserContributions userId={id} />}
            </Grid>
          </Grid>
        </Box>

        <Box textAlign="center" mt={4}>
          <ReportIssueButton />
        </Box>

      </Box>
    </>
  );
};

export default UserProfilePage;

