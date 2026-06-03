import React, { useState } from "react";
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  Button,
  Stack,
  useTheme,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";
import ConstructionIcon from "@mui/icons-material/Construction";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { nodeApi } from "../services/api";

interface Settings {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
}

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [settings, setSettings] = useState<Settings>({
    siteName: "MathGraph",
    defaultLanguage: "fr",
    maintenanceMode: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const handleChange =
    (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((s) => ({ ...s, [key]: e.target.value }));
    };

  const handleToggle = () => {
    setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulation d'une sauvegarde API
    setTimeout(() => {
      setIsSaving(false);
      setSnackbarMessage("Les paramètres ont été sauvegardés avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }, 1200);
  };

  const handleRecalculateGraph = async () => {
    setIsRecalculating(true);
    try {
      await nodeApi.recalculateGraph();
      setSnackbarMessage("Le graphe a été recalculé avec succès !");
      setSnackbarSeverity("success");
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setSnackbarMessage(err.message || "Erreur lors du recalcul du graphe");
      setSnackbarSeverity("error");
    } finally {
      setIsRecalculating(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 1 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 3, letterSpacing: "-0.01em" }}
      >
        Paramètres du Site
      </Typography>

      <Stack spacing={3}>
        {/* Section 1: Configuration Générale */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <SettingsIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Configuration Générale
            </Typography>
          </Stack>

          <Stack spacing={3.5}>
            <TextField
              label="Nom du site"
              value={settings.siteName}
              onChange={handleChange("siteName")}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              select
              label="Langue par défaut"
              value={settings.defaultLanguage}
              onChange={handleChange("defaultLanguage")}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                startAdornment: <LanguageIcon color="action" sx={{ mr: 1 }} />,
              }}
            >
              <MenuItem value="fr">Français (FR)</MenuItem>
              <MenuItem value="en">Anglais (EN)</MenuItem>
              <MenuItem value="es">Espagnol (ES)</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        {/* Section 2: Mode Maintenance */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <ConstructionIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Maintenance & Sécurité
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2.5, lineHeight: 1.5 }}
          >
            Activer le mode maintenance redirige temporairement tous les
            visiteurs non administratifs vers une page d'information hors-ligne.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={settings.maintenanceMode}
                onChange={handleToggle}
                color="warning"
              />
            }
            label={
              settings.maintenanceMode
                ? "Mode maintenance activé"
                : "Mode maintenance désactivé"
            }
            sx={{ m: 0, fontWeight: 600 }}
          />
        </Paper>

        {/* Section 3: Recalcul du Graphe */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <AutoGraphIcon color="info" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recalcul du Graphe 3D
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2.5, lineHeight: 1.5 }}
          >
            Force le moteur physique du backend (ForceAtlas2) à recalculer les
            positions de tous les nœuds du graphe. Cette opération peut prendre
            quelques secondes.
          </Typography>

          <Button
            variant="outlined"
            color="info"
            onClick={handleRecalculateGraph}
            disabled={isRecalculating}
            startIcon={
              isRecalculating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AutoGraphIcon />
              )
            }
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            {isRecalculating ? "Recalcul en cours..." : "Recalculer le graphe"}
          </Button>
        </Paper>

        {/* Bouton de sauvegarde */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            disabled={isSaving}
            startIcon={
              isSaving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(14, 165, 233, 0.25)",
            }}
          >
            {isSaving ? "Enregistrement..." : "Sauvegarder les modifications"}
          </Button>
        </Box>
      </Stack>

      {/* Message de succès */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
