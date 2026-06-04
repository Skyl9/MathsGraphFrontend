import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  InputAdornment,
  Box,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nodeApi } from "../services/api";

interface SearchResult {
  id: number;
  nom: string;
  entity_type: "concept" | "mathematicien" | "category";
}

export const GlobalSearchBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  // L'effet qui déclenche la recherche quand on tape
  useEffect(() => {
    let active = true;

    if (inputValue.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptions([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await nodeApi.quickSearch(inputValue);
        if (active) {
          setOptions(results as SearchResult[]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    // Petit délai (debounce) pour ne pas spammer l'API à chaque lettre tapée
    const timeoutId = setTimeout(() => fetchResults(), 300);
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  // Gère la sélection d'un item dans le menu déroulant
  const handleSelect = (
    _event: React.SyntheticEvent,
    newValue: SearchResult | string | null,
  ) => {
    if (typeof newValue === "object" && newValue !== null) {
      // L'utilisateur a cliqué sur un aperçu !
      if (newValue.entity_type === "concept")
        navigate(`/concept/${newValue.id}`);
      if (newValue.entity_type === "mathematicien")
        navigate(`/mathematicien/${newValue.id}`);
      if (newValue.entity_type === "category")
        navigate(`/category/${newValue.id}`);
      setOpen(false);
    }
  };

  // Gère l'appui sur "Entrée"
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault(); // Empêche le comportement par défaut
      setOpen(false); // Ferme le menu
      navigate(`/search?q=${encodeURIComponent(inputValue)}`); // Redirige vers ta future page !
    }
  };

  return (
    <Autocomplete
      sx={{
        width: 300,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.03)",
        borderRadius: 2,
        transition:
          "background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        "&:hover": {
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
          borderColor: "primary.main",
        },
        "&.Mui-focused": {
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.01)",
          boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
          borderColor: "primary.main",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) =>
        option.id === value.id && option.entity_type === value.entity_type
      }
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.nom
      }
      options={options}
      loading={loading}
      freeSolo // 🌟 Permet de taper ce qu'on veut et de faire "Entrée" sans choisir dans la liste
      onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
      onChange={handleSelect}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <li {...restProps} key={`${option.entity_type}-${option.id}`}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              sx={{ py: 0.5 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 550 }}>
                {option.nom}
              </Typography>
              <Chip
                size="small"
                label={
                  option.entity_type === "concept"
                    ? t("search.concept")
                    : option.entity_type === "mathematicien"
                      ? t("search.mathematician")
                      : t("search.category")
                }
                color={
                  option.entity_type === "concept"
                    ? "info"
                    : option.entity_type === "mathematicien"
                      ? "secondary"
                      : "warning"
                }
                sx={{
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  height: 18,
                  borderRadius: 1.5,
                }}
              />
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("search.placeholder")}
          onKeyDown={handleKeyDown} // 🌟 Capture la touche Entrée
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{ pl: 1 }}>
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};
