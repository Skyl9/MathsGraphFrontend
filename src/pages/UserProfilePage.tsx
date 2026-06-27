import { alpha } from "@mui/material/styles";
import React, { useState } from "react";
import { Box, Typography, Paper, Grid, useTheme } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { useParams, Navigate } from "react-router-dom";
import { AvatarEditModal } from "../components/AvatarEditModal";
import FavoriteList from "../components/FavoriteList";
import UserContributions from "../components/UserContributions.tsx";
import { User } from "../types/ApiTypes/user";
import { useTranslation } from "react-i18next";
import { ProfileSkeleton } from "../components/Skeletons";
import { ProfileAvatarCard } from "../components/Profile/ProfileAvatarCard";
import { ProfileInfoForm } from "../components/Profile/ProfileInfoForm";

import { ReportIssueButton } from "../components/Issue";

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation();

  const {
    data: queryUser,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["userProfile", id],
    queryFn: () => nodeApi.getUserInfo(id || ""),
    enabled: !!id,
  });

  const [editField, setEditField] = useState<
    null | "email" | "preferred_language" | "bio" | "avatar"
  >(null);
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("");
  const [bio, setBio] = useState("");

  const [prevQueryUser, setPrevQueryUser] = useState<User | null>(null);

  if (queryUser && queryUser !== prevQueryUser) {
    setPrevQueryUser(queryUser);
    setEmail(queryUser.email);
    setLang(queryUser.preferred_language || "fr");
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
    return <ProfileSkeleton />;
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
          {/* Colonne Gauche :  et Info basique */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileAvatarCard
              user={user}
              isDark={isDark}
              onEditAvatar={() => setEditField("avatar")}
            />
          </Grid>

          {/* Colonne Droite : Formulaires / Infos éditables */}
          <Grid size={{ xs: 12, md: 8 }}>
            <ProfileInfoForm
              user={user}
              isDark={isDark}
              email={email}
              setEmail={setEmail}
              lang={lang}
              setLang={setLang}
              bio={bio}
              setBio={setBio}
              editField={editField}
              setEditField={setEditField}
              onSaveField={handleFieldSave}
            />
          </Grid>
        </Grid>

        {/* Section Favoris & Contributions */}
        <Box sx={{ mt: 5, mb: 4 }}>
          <Grid container spacing={4}>
            {/* Colonne de gauche : Favoris */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
                {t("profile.my_favorites")}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  minHeight: "260px",
                  borderRadius: 4,
                  border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.06) : alpha(theme.palette.divider, 0.06)}`,
                  background: isDark
                    ? alpha(theme.palette.background.paper, 0.4)
                    : "#ffffff",
                }}
              >
                <FavoriteList userId={id} />
              </Paper>
            </Grid>

            {/* Colonne de droite : Historique des contributions */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
                {t("profile.my_contributions")}
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
            borderTop: `1px solid ${isDark ? alpha(theme.palette.divider, 0.06) : alpha(theme.palette.divider, 0.06)}`,
          }}
        >
          <ReportIssueButton />
        </Box>
      </Box>
    </>
  );
};

export default UserProfilePage;
