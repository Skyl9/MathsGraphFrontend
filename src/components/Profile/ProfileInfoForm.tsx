import { alpha } from "@mui/material/styles";
import {
  useTheme,
  Paper,
  Typography,
  Stack,
  Box,
  Button,
  TextField,
  IconButton,
  MenuItem,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { User } from "../../types/ApiTypes/user";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

interface ProfileInfoFormProps {
  user: User;
  isDark: boolean;
  email: string;
  setEmail: (val: string) => void;
  lang: string;
  setLang: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  editField: "email" | "preferred_language" | "bio" | "avatar" | null;
  setEditField: (
    field: "email" | "preferred_language" | "bio" | "avatar" | null,
  ) => void;
  onSaveField: (field: "email" | "preferred_language" | "bio") => void;
}

export const ProfileInfoForm = ({
  user,
  isDark,
  email,
  setEmail,
  lang,
  setLang,
  bio,
  setBio,
  editField,
  setEditField,
  onSaveField,
}: ProfileInfoFormProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.06) : alpha(theme.palette.divider, 0.06)}`,
        background: isDark
          ? alpha(theme.palette.background.paper, 0.4)
          : "#ffffff",
        height: "100%",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
        {t("profile.personal_info")}
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
                {t("profile.email")}
              </Typography>
            </Stack>
            {editField !== "email" && (
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditField("email")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {t("profile.edit")}
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
                aria-label={t("common.save")}
                onClick={() => onSaveField("email")}
                color="success"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                aria-label={t("common.cancel")}
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
                {t("profile.preferred_language")}
              </Typography>
            </Stack>
            {editField !== "preferred_language" && (
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditField("preferred_language")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {t("profile.edit")}
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
                <MenuItem value="fr">{t("profile.french")}</MenuItem>
                <MenuItem value="en">{t("profile.english")}</MenuItem>
                <MenuItem value="es">{t("profile.spanish")}</MenuItem>
              </TextField>
              <IconButton
                aria-label={t("common.save")}
                onClick={() => onSaveField("preferred_language")}
                color="success"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                aria-label={t("common.cancel")}
                onClick={() => {
                  setEditField(null);
                  if (user.preferred_language) {
                    i18n.changeLanguage(user.preferred_language);
                  }
                  setLang(user.preferred_language || "fr");
                }}
                color="error"
              >
                <CancelIcon />
              </IconButton>
            </Stack>
          ) : (
            <Typography
              variant="body1"
              sx={{ pl: 3.5, fontWeight: 500, textTransform: "capitalize" }}
            >
              {user.preferred_language === "fr"
                ? t("profile.french")
                : user.preferred_language === "en"
                  ? t("profile.english")
                  : t("profile.spanish")}
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
                {t("profile.bio")}
              </Typography>
            </Stack>
            {editField !== "bio" && (
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditField("bio")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {t("profile.edit")}
              </Button>
            )}
          </Stack>

          {editField === "bio" ? (
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{ mt: 1 }}
            >
              <TextField
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                multiline
                rows={4}
                fullWidth
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <Stack>
                <IconButton
                  aria-label={t("common.save")}
                  onClick={() => onSaveField("bio")}
                  color="success"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  aria-label={t("common.cancel")}
                  onClick={() => {
                    setEditField(null);
                    setBio(user.bio || "");
                  }}
                  color="error"
                >
                  <CancelIcon />
                </IconButton>
              </Stack>
            </Stack>
          ) : (
            <Typography
              variant="body1"
              sx={{
                pl: 3.5,
                fontWeight: 500,
                color: user.bio ? "text.primary" : "text.secondary",
                fontStyle: user.bio ? "normal" : "italic",
                whiteSpace: "pre-wrap",
              }}
            >
              {user.bio || t("profile.no_bio")}
            </Typography>
          )}
        </Box>

        {/* Dates Système */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{
            pt: 2,
            borderTop: `1px solid ${isDark ? alpha(theme.palette.divider, 0.06) : alpha(theme.palette.divider, 0.06)}`,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarMonthIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {t("profile.registered_on")}{" "}
              <strong>
                {new Date(user.created_at).toLocaleDateString(
                  i18n.language === "en" ? "en-US" : "fr-FR",
                )}
              </strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {t("profile.last_login")}{" "}
              <strong>
                {user.updated_at
                  ? new Date(user.updated_at).toLocaleDateString(
                      i18n.language === "en" ? "en-US" : "fr-FR",
                    )
                  : t("profile.never")}
              </strong>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};
