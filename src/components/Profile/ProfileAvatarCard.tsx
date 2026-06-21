import { alpha } from "@mui/material/styles";
import {
  Paper,
  Box,
  Avatar,
  Tooltip,
  IconButton,
  Typography,
  Stack,
  Chip,
  Button,
  useTheme,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { User } from "../../types/ApiTypes/user";
import { useTranslation } from "react-i18next";

interface ProfileAvatarCardProps {
  user: User;
  isDark: boolean;
  onEditAvatar: () => void;
}

export const ProfileAvatarCard = ({
  user,
  isDark,
  onEditAvatar,
}: ProfileAvatarCardProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 4,
        border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.06) : alpha(theme.palette.divider, 0.06)}`,
        background: isDark
          ? alpha(theme.palette.background.paper, 0.4)
          : "#ffffff",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
        <Avatar
          alt={`Avatar de ${user.username}`}
          src={user.avatar_url || "/default-avatar.png"}
          sx={{
            width: 150,
            height: 150,
            margin: "0 auto",
            border: `4px solid ${theme.palette.primary.main}`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        />
        <Tooltip title={t("profile.edit_avatar")} placement="top">
          <IconButton
            aria-label={t("profile.edit_avatar")}
            onClick={onEditAvatar}
            color="primary"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 4,
              bgcolor: "background.paper",
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
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
          label={user.is_active ? t("profile.active") : t("profile.inactive")}
          color={user.is_active ? "success" : "default"}
          sx={{ fontWeight: 700 }}
        />
      </Stack>

      <Button
        variant="outlined"
        size="small"
        onClick={onEditAvatar}
        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
      >
        {t("profile.manage_avatar")}
      </Button>
    </Paper>
  );
};
