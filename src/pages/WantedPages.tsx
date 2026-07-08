import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Stack,
} from "@mui/material";
import { nodeApi } from "../services/api";
import { WantedConcept } from "../types/ApiTypes/concept";
import { useNavigate } from "react-router-dom";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { motion } from "framer-motion";

const WantedPages: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const [wantedConcepts, setWantedConcepts] = useState<WantedConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>("Tous");

  useEffect(() => {
    nodeApi
      .getWantedConcepts()
      .then((data) => setWantedConcepts(data))
      .catch((err) => console.error("Erreur chargement wanted concepts", err))
      .finally(() => setLoading(false));
  }, []);

  const domains = useMemo(() => {
    const d = new Set<string>();
    wantedConcepts.forEach((c) => {
      if (c.categorie) d.add(c.categorie);
    });
    return ["Tous", ...Array.from(d).sort()];
  }, [wantedConcepts]);

  const filteredConcepts = useMemo(() => {
    if (selectedDomain === "Tous") return wantedConcepts;
    return wantedConcepts.filter((c) => c.categorie === selectedDomain);
  }, [wantedConcepts, selectedDomain]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: "50%",
              bgcolor: "warning.main",
              color: "warning.contrastText",
              mb: 2,
            }}
          >
            <AssignmentLateIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h3" fontWeight={900} gutterBottom>
            Appel à Contributions
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            maxWidth={600}
            mx="auto"
          >
            Le graphe a besoin de vous ! Voici les concepts incomplets
            (ébauches, théorèmes sans démonstration, sans sources). Choisissez
            un domaine et complétez les pages.
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="domain-select-label">
              Filtrer par domaine
            </InputLabel>
            <Select
              labelId="domain-select-label"
              id="domain-select"
              value={selectedDomain}
              label="Filtrer par domaine"
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {domains.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {filteredConcepts.map((concept, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={concept.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    boxShadow: 3,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {concept.nom}
                    </Typography>
                    {concept.categorie && (
                      <Chip
                        label={concept.categorie}
                        size="small"
                        sx={{ mb: 2 }}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Champs manquants :
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mt: 1 }}
                    >
                      {concept.missing_fields.map((mf) => (
                        <Chip
                          key={mf}
                          label={
                            mf === "demonstration" ? "Démonstration" : "Sources"
                          }
                          size="small"
                          color="warning"
                        />
                      ))}
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<AutoFixHighIcon />}
                      onClick={() => navigate(`/concept/${concept.id}`)}
                    >
                      Contribuer
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        {filteredConcepts.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              Aucun concept incomplet trouvé dans ce domaine.
            </Typography>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default WantedPages;
