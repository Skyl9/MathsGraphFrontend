import React, { useState } from "react";
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
  Stack,
  useTheme,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { useParams, Navigate } from "react-router-dom";
import { AvatarEditModal } from "../components/AvatarEditModal";
import { ReportIssueButton } from "../components/Issue";
import FavoriteList from "../components/FavoriteList";
import UserContributions from "../components/UserContributions.tsx";
import { User } from "../types/ApiTypes/user";

// Icônes
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    data: queryUser,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["userProfile", id],
    queryFn: () => nodeApi.getUserInfo(id || ""),
    enabled: !!id,
  });

  // Champs individuels (état local pour l'édition)
  const [editField, setEditField] = useState<
    null | "email" | "preferred_language" | "bio" | "avatar"
  >(null);
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("");
  const [bio, setBio] = useState("");

  // Synchroniser l'état local avec les données reçues pour l'édition (React 18 Best Practice)
  const [prevQueryUser, setPrevQueryUser] = useState<User | null>(null);

  if (queryUser && queryUser !== prevQueryUser) {
    setPrevQueryUser(queryUser);
    setEmail(queryUser.email);
    setLang(queryUser.preferred_language);
    setBio(queryUser.bio || "");
  }

  const updateUserMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string }) => {
      if (!id) throw new Error("ID manquant");
      return nodeApi.patchUser({ field, value }, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
      setEditField(null);
    },
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

  if (error || (!isLoading && !queryUser)) {
    return <Navigate to="/404" replace />;
  }

  if (isLoading || !queryUser) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="60vh"
        gap={2}
      >
        <CircularProgress />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          Chargement du profil...
        </Typography>
      </Box>
    );
  }

  const user = queryUser;

  return (
    <>
      <AvatarEditModal
        open={editField === "avatar"}
        onClose={() => setEditField(null)}
        onSubmit={handleAvatarSubmit}
      />

      <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto", py: 4 }}>
        <Grid container spacing={4}>
          {/* Colonne Gauche : Identité de l'utilisateur */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                position: "relative",
              }}
            >
              <Box
                sx={{ position: "relative", display: "inline-block", mb: 3 }}
              >
                <Avatar
                  src={user.avatar_url || "/default-avatar.png"}
                  sx={{
                    width: 150,
                    height: 150,
                    margin: "0 auto",
                    border: `4px solid ${theme.palette.primary.main}`,
                    boxShadow: "0 8px 24px rgba(14, 165, 233, 0.15)",
                  }}
                />
                <Tooltip title="Modifier la photo de profil" placement="top">
                  <IconButton
                    onClick={() => setEditField("avatar")}
                    color="primary"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 4,
                      bgcolor: "background.paper",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      "&:hover": { bgcolor: "primary.main", color: "#ffffff" },
                    }}
                    size="small"
                  >
                    <PhotoCameraIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography
                variant="h4"
                sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}
              >
                {user.username}
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="center"
                sx={{ mb: 3 }}
              >
                <Chip
                  label={user.role}
                  color={
                    user.role === "admin"
                      ? "error"
                      : user.role === "moderator"
                        ? "warning"
                        : "primary"
                  }
                  sx={{ fontWeight: 700, textTransform: "capitalize" }}
                />
                <Chip
                  label={user.is_active ? "Actif" : "Inactif"}
                  color={user.is_active ? "success" : "default"}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditField("avatar")}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Gérer l'avatar
              </Button>
            </Paper>
          </Grid>

          {/* Colonne Droite : Formulaires / Infos éditables */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                height: "100%",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
                Informations Personnelles
              </Typography>

              <Stack spacing={4}>
                {/* Champ Email */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: "text.secondary" }}
                    >
                      <EmailIcon sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Email
                      </Typography>
                    </Stack>
                    {editField !== "email" && (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditField("email")}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Modifier
                      </Button>
                    )}
                  </Stack>

                  {editField === "email" ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                      <IconButton
                        onClick={() => handleFieldSave("email")}
                        color="success"
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditField(null);
                          setEmail(user.email);
                        }}
                        color="error"
                      >
                        <CancelIcon />
                      </IconButton>
                    </Stack>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ pl: 3.5, fontWeight: 500, color: "text.primary" }}
                    >
                      {user.email}
                    </Typography>
                  )}
                </Box>

                {/* Champ Langue */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: "text.secondary" }}
                    >
                      <LanguageIcon sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Langue Préférée
                      </Typography>
                    </Stack>
                    {editField !== "preferred_language" && (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditField("preferred_language")}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Modifier
                      </Button>
                    )}
                  </Stack>

                  {editField === "preferred_language" ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        select
                        fullWidth
                        size="small"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        <MenuItem value="fr">Français</MenuItem>
                        <MenuItem value="en">Anglais</MenuItem>
                        <MenuItem value="es">Espagnol</MenuItem>
                      </TextField>
                      <IconButton
                        onClick={() => handleFieldSave("preferred_language")}
                        color="success"
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditField(null);
                          setLang(user.preferred_language);
                        }}
                        color="error"
                      >
                        <CancelIcon />
                      </IconButton>
                    </Stack>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        pl: 3.5,
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {user.preferred_language === "fr"
                        ? "Français"
                        : user.preferred_language === "en"
                          ? "Anglais"
                          : "Espagnol"}
                    </Typography>
                  )}
                </Box>

                {/* Champ Biographie */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ color: "text.secondary" }}
                    >
                      <EditIcon sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Biographie
                      </Typography>
                    </Stack>
                    {editField !== "bio" && (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditField("bio")}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Modifier
                      </Button>
                    )}
                  </Stack>

                  {editField === "bio" ? (
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          onClick={() => handleFieldSave("bio")}
                          variant="contained"
                          size="small"
                          startIcon={<SaveIcon />}
                          sx={{ borderRadius: 1.5 }}
                        >
                          Enregistrer
                        </Button>
                        <Button
                          onClick={() => {
                            setEditField(null);
                            setBio(user.bio);
                          }}
                          variant="outlined"
                          size="small"
                          startIcon={<CancelIcon />}
                          sx={{ borderRadius: 1.5 }}
                        >
                          Annuler
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        pl: 3.5,
                        fontWeight: 500,
                        fontStyle: user.bio ? "normal" : "italic",
                        color: user.bio ? "text.primary" : "text.secondary",
                      }}
                    >
                      {user.bio || "Aucune biographie rédigée."}
                    </Typography>
                  )}
                </Box>

                {/* Dates Système */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={4}
                  sx={{
                    pt: 2,
                    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Inscrit le :{" "}
                      <strong>
                        {new Date(user.created_at).toLocaleDateString("fr-FR")}
                      </strong>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Dernière connexion :{" "}
                      <strong>
                        {user.updated_at
                          ? new Date(user.updated_at).toLocaleDateString(
                              "fr-FR",
                            )
                          : "Jamais"}
                      </strong>
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Section Favoris & Contributions */}
        <Box sx={{ mt: 5, mb: 4 }}>
          <Grid container spacing={4}>
            {/* Colonne de gauche : Favoris */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
                Mes Favoris
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  minHeight: "260px",
                  borderRadius: 4,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                }}
              >
                <FavoriteList userId={id} />
              </Paper>
            </Grid>

            {/* Colonne de droite : Historique des contributions */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
                Mes Contributions
              </Typography>
              <Box sx={{ minHeight: "260px" }}>
                {id && <UserContributions userId={id} />}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          textAlign="center"
          mt={6}
          sx={{
            pt: 3,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          <ReportIssueButton />
        </Box>
      </Box>
    </>
  );
};

export default UserProfilePage;
