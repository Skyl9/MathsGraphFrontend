import { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Drawer,
  IconButton,
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "../components/Search/SearchBar";
import { SearchEmptyState } from "../components/Search/SearchEmptyState";
import { SearchFilters } from "../components/SearchFilters";
import { SearchFilters as SearchFiltersType } from "../services/api";
import { SearchResults } from "../components/SearchResults";
import { nodeApi } from "../services/api";

// Icônes

import CloseIcon from "@mui/icons-material/Close";

import { ListSkeleton } from "../components/Skeletons";
import { useTranslation } from "react-i18next";
import { SEOMeta } from "../components/SEOMeta";

interface SearchResult {
  id: number | string;
  nom: string;
  entity_type: string;
  extrait?: string;
}

export const SearchPage = () => {
  const { t } = useTranslation();

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

  // Gestion des champs dates ()
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
      <SEOMeta
        title={t("search.title", "Recherche Avancée")}
        description={t(
          "search.description",
          "Recherchez parmi les concepts mathématiques, théorèmes, catégories et mathématiciens de la base de données MathGraph.",
        )}
      />
      {/* Header / Champ de recherche */}
      <SearchBar
        queryTerm={queryTerm}
        localQuery={localQuery}
        setLocalQuery={setLocalQuery}
        onSubmit={handleSearchSubmit}
        onOpenFilters={() => setDrawerOpen(true)}
      />

      {/* Layout principal */}
      <Grid container spacing={4}>
        {/* 1. Sidebar filtres pour Desktop */}
        <Grid
          size={{ xs: 0, md: 3.5 }}
          sx={{ display: { xs: "none", md: "block" } }}
          component="aside"
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
            <IconButton
              aria-label={t("common.aria.action_button")}
              onClick={() => setDrawerOpen(false)}
              size="small"
            >
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
        <Grid size={{ xs: 12, md: 8.5 }} component="main">
          {isLoading && (
            <Box py={4}>
              <ListSkeleton count={4} />
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
            <SearchEmptyState
              queryTerm={queryTerm}
              isDark={isDark}
              setLocalQuery={setLocalQuery}
              setSearchParams={setSearchParams}
            />
          )}

          {/* État vide (Empty State) */}
          {!isLoading && !error && results?.length === 0 && queryTerm && (
            <SearchEmptyState
              queryTerm={queryTerm}
              isDark={isDark}
              setLocalQuery={setLocalQuery}
              setSearchParams={setSearchParams}
            />
          )}

          {/* Grille des résultats */}
          {!isLoading && results && results.length > 0 && (
            <SearchResults results={results} isDark={isDark} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default SearchPage;
