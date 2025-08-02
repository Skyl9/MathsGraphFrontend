import React, { useEffect, useState } from 'react';
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
import { nodeApi } from '../services/api';
import {useParams} from "react-router-dom";
import {TopBar} from "../components/TopBar";
import { EditModalAvatar } from '../components/EditModalAvatar';
import {ReportIssueButton} from "../components/Issue";
import FavoriteList from "../components/FavoriteList";

interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  role: 'admin' | 'user' | 'moderator';
  last_login: string;
  preferred_language: string;
  avatar_url: string;
  bio: string;
}

const UserProfilePage: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  // Champs individuels
  const [editField, setEditField] = useState<null | "email" | "preferred_language" | "bio" | "avatar">(null);
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await nodeApi.getUserInfo(id||"");
        setUser(data);
        setEmail(data.email);
        setLang(data.preferred_language);
        setBio(data.bio);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleFieldSave = async (field: "email" | "preferred_language" | "bio") => {
    try {
      if (!id) return;
      let value = "";
      if (field === "email") value = email;
      if (field === "preferred_language") value = lang;
      if (field === "bio") value = bio;
      await nodeApi.patchUser({ field, value }, id);
      const data = await nodeApi.getUserInfo(id);
      setUser(data);
      setEditField(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleAvatarSubmit = async (avatarUrl: string) => {
    try {
      if(id){
        await nodeApi.patchUser({ field:"avatar_url", value: avatarUrl }, id);
        setEditField(null);
        const data = await nodeApi.getUserInfo(id||"");
        setUser(data);
      }
    } catch (error) {
      console.error("Erreur lors de la modification de l'avatar:", error);
    }
  };
  if (!user) {
    return <Typography>Chargement...</Typography>;
  }

  return (
      <>
        <TopBar/>
        <EditModalAvatar
            open={editField === "avatar"}
            onClose={() => setEditField(null)}
            onSubmit={handleAvatarSubmit}
        />

        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid size={6} sx={{ textAlign: 'center' }}>
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
              <Grid size={6}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Informations personnelles
                    </Typography>
                  </Grid>
                  {/* Email */}
                  <Grid size={12}>
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
                          <Button onClick={() => handleFieldSave("email")} variant="contained" size="small" sx={{mr:1}}>Enregistrer</Button>
                          <Button onClick={() => { setEditField(null); setEmail(user.email); }} size="small">Annuler</Button>
                        </>
                    ) : (
                        <>
                          <Typography>{user.email}</Typography>
                          <Button onClick={() => setEditField("email")} size="small" sx={{ml:1}}>Modifier</Button>
                        </>
                    )}
                  </Grid>
                  {/* Langue préférée */}
                  <Grid size={12}>
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
                            {/* Exemples de valeurs, personnalisez cette liste */}
                            <MenuItem value="fr">Français</MenuItem>
                            <MenuItem value="en">Anglais</MenuItem>
                            <MenuItem value="es">Espagnol</MenuItem>
                          </TextField>
                          <Button onClick={() => handleFieldSave("preferred_language")} variant="contained" size="small" sx={{mr:1}}>Enregistrer</Button>
                          <Button onClick={() => { setEditField(null); setLang(user.preferred_language); }} size="small">Annuler</Button>
                        </>
                    ) : (
                        <>
                          <Typography>{user.preferred_language}</Typography>
                          <Button onClick={() => setEditField("preferred_language")} size="small" sx={{ml:1}}>Modifier</Button>
                        </>
                    )}
                  </Grid>
                  {/* Bio */}
                  <Grid size={12}>
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
                          <Button onClick={() => handleFieldSave("bio")} variant="contained" size="small" sx={{mr:1}}>Enregistrer</Button>
                          <Button onClick={() => { setEditField(null); setBio(user.bio); }} size="small">Annuler</Button>
                        </>
                    ) : (
                        <>
                          <Typography sx={{ mt: 1 }}>{user.bio || 'Aucune biographie'}</Typography>
                          <Button onClick={() => setEditField("bio")} size="small" sx={{ml:1}}>Modifier</Button>
                        </>
                    )}
                  </Grid>
                  {/* Date d'inscription */}
                  <Grid size={12}>
                    <Typography variant="subtitle2" color="textSecondary">Date d'inscription</Typography>
                    <Typography>
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Grid>
                  {/* Dernière connexion */}
                  <Grid size={12}>
                    <Typography variant="subtitle2" color="textSecondary">Dernière connexion</Typography>
                    <Typography>
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <ReportIssueButton/>
          <Box>
          <FavoriteList userId={id}></FavoriteList>
          </Box>
        </Box>
      </>
  );
};

export default UserProfilePage;