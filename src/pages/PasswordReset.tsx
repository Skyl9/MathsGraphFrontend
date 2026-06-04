import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { nodeApi, isApiError } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReportIssueButton } from "../components/Issue";

interface PasswordResetFormData {
  email: string;
}

const PasswordReset: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const isDark = theme.palette.mode === "dark";
  const [formData, setFormData] = useState<PasswordResetFormData>({
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await nodeApi.requestPasswordReset(formData.email);
      setIsSubmitted(true);
      setError("");
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("error_default"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        py: 8,
        px: 2,
        background: isDark
          ? "radial-gradient(circle at 50% 35%, rgba(99, 102, 241, 0.12) 0%, rgba(9, 13, 22, 0) 55%)"
          : "radial-gradient(circle at 50% 35%, rgba(99, 102, 241, 0.06) 0%, rgba(255, 255, 255, 0) 55%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 5 },
          width: "100%",
          maxWidth: 450,
          borderRadius: 6,
          background: isDark
            ? "rgba(15, 20, 35, 0.45)"
            : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.07)",
          boxShadow: isDark
            ? "0 12px 40px 0 rgba(0, 0, 0, 0.3)"
            : "0 12px 40px 0 rgba(31, 38, 135, 0.06)",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "55px",
            bgcolor: isDark
              ? "rgba(99, 102, 241, 0.15)"
              : "rgba(99, 102, 241, 0.08)",
            border: "1px solid",
            borderColor: isDark
              ? "rgba(99, 102, 241, 0.3)"
              : "rgba(99, 102, 241, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            color: "primary.main",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 1 }}
        >
          {t("auth.forgot_password_title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t("auth.forgot_password_desc")}
        </Typography>

        {isSubmitted ? (
          <Alert
            severity="success"
            sx={{ mt: 2, borderRadius: 3, textAlign: "left" }}
          >
            {t("auth.forgot_password_success")}
          </Alert>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%", textAlign: "left" }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("auth.email")}
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              type="email"
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!formData.email || isLoading}
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                height: 48,
                boxShadow: "0 4px 14px 0 rgba(25, 118, 210, 0.25)",
                "&:hover": {
                  boxShadow: "0 6px 20px 0 rgba(25, 118, 210, 0.35)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("auth.reset_password_btn")
              )}
            </Button>
          </Box>
        )}

        <Button
          variant="text"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={() => navigate("/login")}
          sx={{
            mt: 2,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {t("auth.back_to_login")}
        </Button>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <ReportIssueButton />
      </Box>
    </Box>
  );
};

export default PasswordReset;
