import { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  Button,
  Drawer,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardActions,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi, SearchFilters } from "../services/api";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Icônes
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import FunctionsIcon from "@mui/icons-material/Functions";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
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
  const { t } = useTranslation();

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
  const [filters, setFilters] = useState<SearchFilters>({
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

  const renderFilters = () => (
    <Stack spacing={3.5}>
      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          {t("search.content_type")}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.concept}
                onChange={handleFilterChange}
                name="concept"
                color="primary"
              />
            }
            label={t("search.concepts")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.mathematicien}
                onChange={handleFilterChange}
                name="mathematicien"
                color="primary"
              />
            }
            label={t("search.mathematicians")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.category}
                onChange={handleFilterChange}
                name="category"
                color="primary"
              />
            }
            label="Catégories"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
        </FormGroup>
      </Box>

      <Divider />

      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          Statut / Qualité
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.verifiedOnly}
                onChange={handleFilterChange}
                name="verifiedOnly"
                color="primary"
              />
            }
            label="Concepts vérifiés uniquement"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
        </FormGroup>
      </Box>

      <Divider />

      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          Spécificités
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="categorie_id"
              value={filters.categorie_id === null ? "" : filters.categorie_id}
              onChange={handleSelectChange}
              label="Catégorie"
              disabled={!categories}
            >
              <MenuItem value="">
                <em>Toutes</em>
              </MenuItem>
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              name="type_id"
              value={filters.type_id === null ? "" : filters.type_id}
              onChange={handleSelectChange}
              label="Type"
              disabled={!types}
            >
              <MenuItem value="">
                <em>Tous</em>
              </MenuItem>
              {types?.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Mathématicien</InputLabel>
            <Select
              name="mathematicien_id"
              value={
                filters.mathematicien_id === null
                  ? ""
                  : filters.mathematicien_id
              }
              onChange={handleSelectChange}
              label="Mathématicien"
              disabled={!mathematiciens}
            >
              <MenuItem value="">
                <em>Tous</em>
              </MenuItem>
              {mathematiciens?.map((math) => (
                <MenuItem key={math.id} value={math.id}>
                  {math.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          Période (Années)
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <TextField
            name="date_start"
            label="De (ex: -300)"
            variant="outlined"
            size="small"
            placeholder="-300"
            onChange={handleDateChange}
            sx={{ flex: 1 }}
          />
          <TextField
            name="date_end"
            label="À (ex: 1800)"
            variant="outlined"
            size="small"
            placeholder="1800"
            onChange={handleDateChange}
            sx={{ flex: 1 }}
          />
        </Stack>
      </Box>
    </Stack>
  );

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
            {renderFilters()}
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
          {renderFilters()}
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
            <Grid container spacing={3}>
              {results.map((item, index) => {
                const isConcept = item.entity_type === "concept";
                const isMath = item.entity_type === "mathematicien";

                return (
                  <Grid
                    size={{ xs: 12, sm: 6 }}
                    key={item.id}
                    sx={{ display: "flex" }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.05, 0.3),
                      }}
                      style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          minHeight: 200,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: 4,
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                          background: isDark
                            ? "rgba(15, 20, 40, 0.4)"
                            : "#ffffff",
                          transition:
                            "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            borderColor: "primary.main",
                            boxShadow: isDark
                              ? "0 12px 30px rgba(0,0,0,0.25)"
                              : "0 12px 30px rgba(0,0,0,0.04)",
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 3,
                            pb: 1,
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            mb={2}
                          >
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: isConcept
                                  ? "rgba(14, 165, 233, 0.15)"
                                  : isMath
                                    ? "rgba(139, 92, 246, 0.15)"
                                    : "rgba(249, 115, 22, 0.15)",
                                color: isConcept
                                  ? "#0ea5e9"
                                  : isMath
                                    ? "#8b5cf6"
                                    : "#f97316",
                                display: "inline-flex",
                              }}
                            >
                              {isConcept ? (
                                <FunctionsIcon />
                              ) : isMath ? (
                                <PeopleIcon />
                              ) : (
                                <CategoryIcon />
                              )}
                            </Box>
                            <Chip
                              size="small"
                              label={
                                isConcept
                                  ? "Concept"
                                  : isMath
                                    ? "Mathématicien"
                                    : "Catégorie"
                              }
                              color={
                                isConcept
                                  ? "info"
                                  : isMath
                                    ? "secondary"
                                    : "warning"
                              }
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                height: 20,
                                borderRadius: 1.5,
                              }}
                            />
                          </Box>

                          <Link
                            to={`/${item.entity_type}/${item.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                fontWeight: 700,
                                color: "text.primary",
                                mb: 1.5,
                                lineHeight: 1.3,
                                "&:hover": {
                                  color: "primary.main",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {item.nom}
                            </Typography>
                          </Link>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              flexGrow: 1,
                            }}
                          >
                            {item.extrait || "Aucune description disponible..."}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ p: 3, pt: 0 }}>
                          <Button
                            variant="text"
                            size="small"
                            color="primary"
                            href={`/${item.entity_type}/${item.id}`}
                            sx={{
                              fontWeight: 700,
                              textTransform: "none",
                              p: 0,
                              "&:hover": { bgcolor: "transparent" },
                            }}
                          >
                            Consulter la fiche →
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default SearchPage;
