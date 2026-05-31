import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Alert,
  Grid,
  Stack,
  useTheme,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../../services/api";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NewContentPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    nom: "",
    type: "théorème",
    enonce: "",
    demonstration: "",
    categorie_id: "" as number | "",
    mathematicien_id: "" as number | "",
  });
  const [error, setError] = useState<string | null>(null);

  // Récupération des données pour les listes déroulantes
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: nodeApi.getAllCategories,
  });
  const { data: types } = useQuery({
    queryKey: ["types"],
    queryFn: nodeApi.getAllTypeNames,
  });
  const { data: mathematiciens } = useQuery({
    queryKey: ["mathematiciens"],
    queryFn: nodeApi.getAllMathematicienName,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categorie_id:
          formData.categorie_id === "" ? null : formData.categorie_id,
        mathematicien_id:
          formData.mathematicien_id === "" ? null : formData.mathematicien_id,
      };
      const result = await nodeApi.createConcept(payload);
      // Redirection vers la page du concept nouvellement créé
      navigate(`/concept/${result.id}`);
    } catch (err) {
      setError((err as Error).message || "Erreur lors de la création.");
    }
  };

  const glassPaperStyle = {
    p: 3,
    borderRadius: 4,
    background: isDark
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(16px)",
    border: "1px solid",
    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    boxShadow: isDark
      ? "0 8px 32px 0 rgba(0, 0, 0, 0.2)"
      : "0 8px 32px 0 rgba(31, 38, 135, 0.04)",
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}
          >
            Créer un nouveau contenu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ajoutez une nouvelle fiche conceptuelle, théorème ou définition à la
            base de connaissances.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/contents")}
          sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600 }}
        >
          Retour
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Left Column - Main Content Fields */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={glassPaperStyle}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Informations principales
              </Typography>
              <Stack spacing={3}>
                <TextField
                  label="Nom du concept"
                  required
                  fullWidth
                  placeholder="Ex: Théorème de Pythagore"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                    },
                  }}
                />

                <TextField
                  label="Énoncé"
                  required
                  multiline
                  rows={6}
                  fullWidth
                  placeholder="Décrivez l'énoncé. Le Markdown et le LaTeX (ex: $a^2 + b^2 = c^2$) sont supportés."
                  value={formData.enonce}
                  onChange={(e) =>
                    setFormData({ ...formData, enonce: e.target.value })
                  }
                  helperText="Utilisez le symbole $ pour le LaTeX en ligne (ex: $x^2$) et $$ pour le LaTeX centré."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                    },
                  }}
                />

                <TextField
                  label="Démonstration (Optionnelle)"
                  multiline
                  rows={8}
                  fullWidth
                  placeholder="Écrivez la démonstration étape par étape si applicable."
                  value={formData.demonstration}
                  onChange={(e) =>
                    setFormData({ ...formData, demonstration: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                    },
                  }}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column - Meta / Association fields */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={glassPaperStyle}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Classification & Liens
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    select
                    label="Type"
                    required
                    fullWidth
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                      },
                    }}
                  >
                    {types?.map((t) => (
                      <MenuItem key={t.id} value={t.nom}>
                        {t.nom}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Catégorie"
                    fullWidth
                    value={formData.categorie_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categorie_id:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Aucune catégorie</em>
                    </MenuItem>
                    {categories?.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.nom}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Mathématicien associé"
                    fullWidth
                    value={formData.mathematicien_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mathematicien_id:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Aucun mathématicien</em>
                    </MenuItem>
                    {mathematiciens?.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.nom}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Paper>

              {/* Actions Card */}
              <Paper elevation={0} sx={{ ...glassPaperStyle, p: 2.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  Validation
                </Typography>
                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/admin/contents")}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<SaveIcon />}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "0 4px 14px 0 rgba(25, 118, 210, 0.25)",
                      "&:hover": {
                        boxShadow: "0 6px 20px 0 rgba(25, 118, 210, 0.35)",
                      },
                    }}
                  >
                    Enregistrer
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default NewContentPage;
