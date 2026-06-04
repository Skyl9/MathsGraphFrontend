import { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  Button,
  Drawer,
  IconButton,
  Stack,
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { SearchFilters } from "../components/SearchFilters";
import { SearchResults } from "../components/SearchResults";
import { SearchFilters as SearchFiltersType } from "../services/api";
import { motion } from "framer-motion";

// Icônes
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import SearchOffIcon from "@mui/icons-material/SearchOff";

interface SearchResult {
  id: number | string;
  nom: string;
  entity_type: string;
  extrait?: string;
}

export const SearchPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [searchParams, setSearchParams] = useSearchParams();
  const queryTerm = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(queryTerm);
  const [prevQueryTerm, setPrevQueryTerm] = useState(queryTerm);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Synchronise la recherche locale avec l'URL (mise à jour pendant le rendu - React 18 Best Practice)
  if (queryTerm !== prevQueryTerm) {
    setPrevQueryTerm(queryTerm);
    setLocalQuery(queryTerm);
  }

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchParams(localQuery ? { q: localQuery } : {});
  };

  // État de nos filtres (Tier gauche)
  const [filters, setFilters] = useState<SearchFiltersType>({
    concept: true,
    mathematicien: true,
    category: true,
    verifiedOnly: false,
    categorie_id: null,
    type_id: null,
    mathematicien_id: null,
    date_start: null,
    date_end: null,
  });

  // Gestion du clic sur un filtre (checkbox)
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  // Gestion des listes déroulantes (Select)
  const handleSelectChange = (event: SelectChangeEvent<number | "">) => {
    const name = event.target.name;
    const value = event.target.value;
    setFilters({
      ...filters,
      [name]: value === "" ? null : Number(value),
    });
  };

  // Gestion des champs dates (TextField)
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    // Si vide, on met null. Sinon on formate en YYYY-01-01
    let formattedDate = null;
    if (value.trim() !== "") {
      // Nettoie l'entrée (on accepte les nombres négatifs pour l'Antiquité)
      const year = parseInt(value, 10);
      if (!isNaN(year)) {
        // Formate sur au moins 4 chiffres avec des zéros devant si besoin
        // Le backend PostgreSQL / Pydantic accepte généralement YYYY-01-01
        // Pour les années avant J.C, il faudra peut-être une string spéciale ou juste l'envoyer tel quel
        const absYear = Math.abs(year).toString().padStart(4, "0");
        const sign = year < 0 ? "-" : "";
        formattedDate = `${sign}${absYear}-01-01`;
      }
    }

    setFilters({
      ...filters,
      [name]: formattedDate,
    });
  };

  // Requêtes pour pré-remplir les listes de sélection
  const { data: categories } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => nodeApi.getAllCategories(),
  });

  const { data: types } = useQuery({
    queryKey: ["allTypes"],
    queryFn: () => nodeApi.getAllTypeNames(),
  });

  const { data: mathematiciens } = useQuery({
    queryKey: ["allMathematiciens"],
    queryFn: () => nodeApi.getAllMathematicienName(),
  });

  // Appel API avec React Query
  const {
    data: results,
    isLoading,
    error,
  } = useQuery<SearchResult[]>({
    queryKey: ["advancedSearch", queryTerm, filters],
    queryFn: async () => {
      if (!queryTerm) return [];
      return await nodeApi.advanceSearch(queryTerm, filters);
    },
    enabled: queryTerm.length > 0,
  });

  return (
    <Box
      sx={{ p: 1, maxWidth: 1200, margin: "0 auto", minHeight: "85vh", py: 6 }}
    >
      {/* Header / Champ de recherche */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 900, mb: 3, letterSpacing: "-0.02em" }}
        >
          {queryTerm ? `Résultats pour "${queryTerm}"` : "Recherche Avancée"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ display: "flex", gap: 1.5 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Modifier ou lancer une recherche..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
            InputProps={{
              startAdornment: (
                <IconButton type="submit" color="primary" sx={{ mr: 0.5 }}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Rechercher
          </Button>
        </Box>

        {/* Filtres bouton pour version mobile uniquement */}
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{
            mt: 2,
            display: { xs: "flex", md: "none" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Filtrer les résultats
        </Button>
      </Box>

      {/* Layout principal */}
      <Grid container spacing={4}>
        {/* 1. Sidebar filtres pour Desktop */}
        <Grid
          size={{ xs: 0, md: 3.5 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
              position: "sticky",
              top: 24,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Filtres
            </Typography>
            <SearchFilters
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleSelectChange={handleSelectChange}
              handleDateChange={handleDateChange}
              categories={categories}
              types={types}
              mathematiciens={mathematiciens}
            />
          </Paper>
        </Grid>

        {/* 2. Drawer filtres pour Mobile */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 290,
              p: 3,
              bgcolor: "background.default",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Filtres
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <SearchFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleSelectChange={handleSelectChange}
            handleDateChange={handleDateChange}
            categories={categories}
            types={types}
            mathematiciens={mathematiciens}
          />
        </Drawer>

        {/* 3. Section des résultats */}
        <Grid size={{ xs: 12, md: 8.5 }}>
          {isLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={8}
            >
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Paper
              sx={{
                p: 3,
                bgcolor: "error.light",
                color: "error.contrastText",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Une erreur est survenue pendant la recherche.
              </Typography>
            </Paper>
          )}

          {/* Page d'accueil de la recherche / Aucun terme saisi */}
          {!queryTerm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: 4,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <SearchIcon
                  sx={{ fontSize: 48, color: "primary.main", opacity: 0.8 }}
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    Que recherchez-vous aujourd'hui ?
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 450, mx: "auto", lineHeight: 1.5 }}
                  >
                    Saisissez un mot-clé ou un nom dans la barre de recherche
                    ci-dessus pour explorer les théorèmes, les mathématiciens ou
                    les catégories.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 1,
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.02)",
                    width: "100%",
                    maxWidth: 450,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary" }}
                  >
                    Suggestions rapides de recherche :
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexWrap="wrap"
                    gap={1}
                  >
                    {[
                      "Algèbre",
                      "Géométrie",
                      "Analyse",
                      "Probabilités",
                      "Théorème",
                    ].map((word) => (
                      <Chip
                        key={word}
                        label={word}
                        clickable
                        onClick={() => {
                          setLocalQuery(word);
                          setSearchParams({ q: word });
                        }}
                        size="small"
                        sx={{ fontWeight: 650 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          )}

          {/* État vide (Empty State) */}
          {!isLoading && !error && results?.length === 0 && queryTerm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 4,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: isDark
                      ? "rgba(244, 63, 94, 0.12)"
                      : "rgba(244, 63, 94, 0.06)",
                    color: "error.main",
                  }}
                >
                  <SearchOffIcon sx={{ fontSize: 48 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    Aucun résultat pour "{queryTerm}"
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 450, mx: "auto", lineHeight: 1.5 }}
                  >
                    Désolé, nous n'avons trouvé aucune fiche correspondante.
                    Vérifiez l'orthographe ou essayez l'un des termes
                    ci-dessous.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.02)",
                    width: "100%",
                    maxWidth: 450,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, color: "primary.main" }}
                  >
                    Suggestions populaires :
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexWrap="wrap"
                    gap={1}
                  >
                    {[
                      "Pythagore",
                      "Thalès",
                      "Axiome",
                      "Géométrie",
                      "Algèbre",
                    ].map((word) => (
                      <Chip
                        key={word}
                        label={word}
                        clickable
                        onClick={() => {
                          setLocalQuery(word);
                          setSearchParams({ q: word });
                        }}
                        size="small"
                        sx={{ fontWeight: 650 }}
                      />
                    ))}
                  </Box>
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 1 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    href="/contribution"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 3.5,
                      py: 1,
                      textTransform: "none",
                    }}
                  >
                    Contribuer au site
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setLocalQuery("");
                      setSearchParams({});
                    }}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 3.5,
                      py: 1,
                      textTransform: "none",
                    }}
                  >
                    Réinitialiser
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          )}

          {/* Grille des résultats */}
          {!isLoading && results && results.length > 0 && (
            <SearchResults results={results as any} isDark={isDark} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default SearchPage;
