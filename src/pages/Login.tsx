import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Grid,
  Paper,
  useTheme,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Token from "../services/token.ts";
import FunctionsIcon from "@mui/icons-material/Functions";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { SEOMeta } from "../components/SEOMeta";

const loginSchema = z.object({
  username: z.string().min(1, i18n.t("auth.username_req") as string),
  password: z.string().min(1, i18n.t("auth.password_req") as string),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const responseData = await nodeApi.getToken(formData);
      const payload = Token.decodeToken(responseData.access_token);
      if (payload) Token.saveUserInfo(payload);

      navigate("/");
    } catch (e) {
      setApiError((e as Error).message || t("auth.error_default"));
      console.error(e);
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
      <SEOMeta
        title={t("auth.login")}
        description={t(
          "auth.login_description",
          "Connectez-vous à votre compte MathGraph pour sauvegarder vos favoris et contribuer.",
        )}
      />
      <TopBar />

      <Grid container sx={{ flexGrow: 1 }}>
        {/* Colonne Gauche : Visuel & Citation (Masqué sur mobile) */}
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
              MathGraph
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "grey.400", mb: 4, lineHeight: 1.6 }}
            >
              {t("auth.login_desc")}
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
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 800, mb: 1 }}
              >
                {t("auth.login_title")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t("auth.login_subtitle")}
              </Typography>

              {apiError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {apiError}
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  label={t("auth.username")}
                  type="text"
                  variant="outlined"
                  fullWidth
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
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
                  {isSubmitting ? t("auth.logging_in") : t("auth.login_btn")}
                </Button>
              </Stack>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t("auth.no_account")}{" "}
                  <Link
                    href="/register"
                    underline="hover"
                    sx={{ fontWeight: 600 }}
                  >
                    {t("auth.register")}
                  </Link>
                </Typography>
                <Link
                  href="/reset-password"
                  underline="hover"
                  variant="body2"
                  sx={{ fontWeight: 500, color: "text.secondary" }}
                >
                  {t("auth.forgot_pwd")}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
