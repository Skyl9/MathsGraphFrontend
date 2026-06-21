import { FormEvent } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  queryTerm: string;
  localQuery: string;
  setLocalQuery: (q: string) => void;
  onSubmit: (e: FormEvent) => void;
  onOpenFilters: () => void;
}

export const SearchBar = ({
  queryTerm,
  localQuery,
  setLocalQuery,
  onSubmit,
  onOpenFilters,
}: SearchBarProps) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 5 }}>
      <Typography
        variant="h3"
        sx={{ fontWeight: 900, mb: 3, letterSpacing: "-0.02em" }}
      >
        {queryTerm ? `Résultats pour "${queryTerm}"` : "Recherche Avancée"}
      </Typography>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", gap: 1.5 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={t("search.bar.placeholder")}
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
              <IconButton
                aria-label={t("search.action")}
                type="submit"
                color="primary"
                sx={{ mr: 0.5 }}
              >
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
        onClick={onOpenFilters}
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
  );
};
