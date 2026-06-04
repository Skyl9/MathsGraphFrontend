import React, { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Link,
  useTheme,
} from "@mui/material";
import { nodeApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar.tsx";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FunctionsIcon from "@mui/icons-material/Functions";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, i18n.t("auth.username_min_length") as string)
    .max(20, i18n.t("auth.username_max_length") as string)
    .regex(/^[a-zA-Z0-9_]+$/, i18n.t("auth.username_regex") as string),
  email: z.string().email(i18n.t("auth.email_invalid") as string),
  password: z
    .string()
    .min(8, i18n.t("auth.password_min_length") as string)
    .regex(/[A-Z]/, i18n.t("auth.password_uppercase") as string)
    .regex(/[0-9]/, i18n.t("auth.password_number") as string),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setApiError(null);
    setApiSuccess(null);
    try {
      await nodeApi.register(data.username, data.email, data.password);
      setApiSuccess(t("auth.register_success"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setApiError((err as Error).message || t("auth.register_error"));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <TopBar />

      <Grid container sx={{ flexGrow: 1 }}>
        {/* Colonne Gauche : Visuel (Masqué sur mobile) */}
        <Grid
          size={{ xs: 0, md: 5, lg: 6 }}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 6,
            textAlign: "center",
            color: "#ffffff",
            background: isDark
              ? "linear-gradient(135deg, #090d16 0%, #111827 100%)"
              : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            position: "relative",
            overflow: "hidden",
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          }}
        >
          {/* Motif Géométrique Subtil en arrière-plan */}
          <Box
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -150,
              left: -150,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />

          <Box sx={{ zIndex: 1, maxWidth: 460 }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 1.5,
                borderRadius: 3,
                bgcolor: "rgba(14, 165, 233, 0.15)",
                color: "#7dd3fc",
                mb: 3,
              }}
            >
              <FunctionsIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mb: 2, letterSpacing: "-0.02em" }}
            >
              {t("auth.register_title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "grey.400", mb: 4, lineHeight: 1.6 }}
            >
              {t("auth.register_desc")}
            </Typography>
          </Box>
        </Grid>

        {/* Colonne Droite : Formulaire */}
        <Grid
          size={{ xs: 12, md: 7, lg: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 420,
              p: 4,
              borderRadius: 4,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              background: isDark
                ? "rgba(15, 20, 40, 0.5)"
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {t("auth.register_form_title")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t("auth.register_subtitle")}
              </Typography>

              {apiError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {apiError}
                </Alert>
              )}
              {apiSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {apiSuccess}
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  label={t("auth.username")}
                  variant="outlined"
                  fullWidth
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <TextField
                  label={t("auth.email")}
                  type="email"
                  variant="outlined"
                  fullWidth
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <TextField
                  label={t("auth.password")}
                  type="password"
                  variant="outlined"
                  fullWidth
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.25)",
                  }}
                >
                  {isSubmitting
                    ? t("auth.registering")
                    : t("auth.register_btn")}
                </Button>
              </Stack>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {t("auth.already_account")}{" "}
                  <Link
                    href="/login"
                    underline="hover"
                    sx={{ fontWeight: 600 }}
                  >
                    {t("auth.login_link")}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
