import {
  IconButton,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchBar from "./SearchBar";
import "../styles/Menu.css";
import { Graph } from "../types/ApiTypes/graph";
import { AutoGraph, GridOn, AccountTree, Timeline } from "@mui/icons-material";
import { getNodeColor } from "../utils/nodeColors";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMenuLogic } from "../hooks/useMenuLogic";

interface MenuProps {
  graphData: Graph;
}

export default function Menu({ graphData }: MenuProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    open,
    setOpen,
    darkMode,
    setDarkMode,
    currentView,
    setCurrentView,
    useInstancedEdges,
    setUseInstancedEdges,
    graphTheme,
    setGraphTheme,
    renderMode,
    setRenderMode,
    colorAxiome,
    colorLemme,
    colorTheoreme,
    colorReciproque,
    colorDefinition,
    colorCorollaire,
    colorProposition,
    colorPropriete,
    setColorAxiome,
    setColorLemme,
    setColorTheoreme,
    setColorReciproque,
    setColorDefinition,
    setColorCorollaire,
    setColorProposition,
    setColorPropriete,
    filters,
    setFilters,
    searchResults,
    handleSearch,
    handleResultsSearch,
    isSearchActive,
    setIsSearchActive,
    exportGraph,
  } = useMenuLogic(graphData);

  return (
    <>
      <div className="menu-container">
        <AnimatePresence>
          {!open ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <IconButton
                color="primary"
                aria-label="menu"
                onClick={() => setOpen(true)}
                sx={{
                  backdropFilter: "blur(12px)",
                  background: darkMode
                    ? alpha(theme.palette.background.paper, 0.75)
                    : alpha(theme.palette.background.paper, 0.75),
                  border: darkMode
                    ? `1px solid ${alpha(theme.palette.divider, 0.08)}`
                    : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.15)}`,
                  p: 1.5,
                  "&:hover": {
                    background: darkMode
                      ? alpha(theme.palette.background.paper, 0.85)
                      : alpha(theme.palette.background.paper, 0.85),
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="floating-glass-menu"
              style={{
                width: 280,
                padding: 20,
                backdropFilter: "blur(20px)",
                background: darkMode
                  ? alpha(theme.palette.background.paper, 0.75)
                  : alpha(theme.palette.background.paper, 0.75),
                borderRight: darkMode
                  ? `1px solid ${alpha(theme.palette.divider, 0.08)}`
                  : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.2)}`,
                color: "text.primary",
                maxHeight: "88vh",
                overflowY: "auto",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  {t("menu.configuration")}
                </Typography>
                <IconButton size="small" onClick={() => setOpen(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                href="/"
                startIcon={<HomeIcon />}
                sx={{
                  mb: 2,
                  justifyContent: "flex-start",
                  borderColor: darkMode
                    ? alpha(theme.palette.text.primary, 0.15)
                    : alpha(theme.palette.text.primary, 0.15),
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 1,
                  "&:hover": {
                    background: darkMode
                      ? alpha(theme.palette.text.primary, 0.05)
                      : alpha(theme.palette.text.primary, 0.03),
                    borderColor: darkMode
                      ? alpha(theme.palette.text.primary, 0.3)
                      : alpha(theme.palette.text.primary, 0.3),
                  },
                }}
              >
                {t("menu.backToPortal")}
              </Button>

              <Divider sx={{ my: 1.5, opacity: 0.4 }} />

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 700, opacity: 0.8 }}
              >
                {t("menu.displayMode")}
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="current-view-label">
                  {t("menu.layout")}
                </InputLabel>
                <Select
                  labelId="current-view-label"
                  value={currentView}
                  label={t("menu.layout")}
                  onChange={(e) => setCurrentView(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="grille">
                    <GridOn sx={{ mr: 1, fontSize: 18 }} /> {t("menu.grid")}
                  </MenuItem>
                  <MenuItem value="physique">
                    <AutoGraph sx={{ mr: 1, fontSize: 18 }} />{" "}
                    {t("menu.physics")}
                  </MenuItem>
                  <MenuItem value="arbre">
                    <AccountTree sx={{ mr: 1, fontSize: 18 }} />{" "}
                    {t("menu.tree")}
                  </MenuItem>
                  <MenuItem value="timeline">
                    <Timeline sx={{ mr: 1, fontSize: 18 }} />{" "}
                    {t("menu.timeline")}
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="render-mode-label">
                  {t("menu.engine")}
                </InputLabel>
                <Select
                  labelId="render-mode-label"
                  value={renderMode}
                  label={t("menu.engine")}
                  onChange={(e) =>
                    setRenderMode(e.target.value as "quality" | "performance")
                  }
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="quality">{t("menu.quality")}</MenuItem>
                  <MenuItem value="performance">
                    {t("menu.performance")}
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="edges-mode-label">Moteur des arêtes</InputLabel>
                <Select
                  labelId="edges-mode-label"
                  value={useInstancedEdges ? "instanced" : "standard"}
                  label="Moteur des arêtes"
                  onChange={(e) =>
                    setUseInstancedEdges(e.target.value === "instanced")
                  }
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="standard">Standard (Beauté)</MenuItem>
                  <MenuItem value="instanced">
                    Instancié (Performance +)
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="theme-select-label">
                  {t("menu.visualTheme")}
                </InputLabel>
                <Select
                  labelId="theme-select-label"
                  value={graphTheme}
                  label={t("menu.visualTheme")}
                  onChange={(e) =>
                    setGraphTheme(
                      e.target.value as "classique" | "neon" | "focus",
                    )
                  }
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="classique">
                    {t("menu.themeClassic")}
                  </MenuItem>
                  <MenuItem value="neon">{t("menu.themeNeon")}</MenuItem>
                  <MenuItem value="focus">{t("menu.themeFocus")}</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 1.5, opacity: 0.4 }} />

              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 700, opacity: 0.8 }}
              >
                {t("menu.visibleCategories")} & Couleurs
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                {[
                  {
                    key: "axiome",
                    label: t("categories.axioms"),
                    filter: filters.axiome,
                    color: colorAxiome,
                    setColor: setColorAxiome,
                  },
                  {
                    key: "théorème",
                    label: t("categories.theorems"),
                    filter: filters.théorème,
                    color: colorTheoreme,
                    setColor: setColorTheoreme,
                  },
                  {
                    key: "lemme",
                    label: t("categories.lemmas"),
                    filter: filters.lemme,
                    color: colorLemme,
                    setColor: setColorLemme,
                  },
                  {
                    key: "réciproque",
                    label: t("categories.reciprocals"),
                    filter: filters.réciproque,
                    color: colorReciproque,
                    setColor: setColorReciproque,
                  },
                  {
                    key: "définition",
                    label: "Définitions",
                    filter: filters.définition,
                    color: colorDefinition,
                    setColor: setColorDefinition,
                  },
                  {
                    key: "corollaire",
                    label: "Corollaires",
                    filter: filters.corollaire,
                    color: colorCorollaire,
                    setColor: setColorCorollaire,
                  },
                  {
                    key: "proposition",
                    label: "Propositions",
                    filter: filters.proposition,
                    color: colorProposition,
                    setColor: setColorProposition,
                  },
                  {
                    key: "propriété",
                    label: "Propriétés",
                    filter: filters.propriété,
                    color: colorPropriete,
                    setColor: setColorPropriete,
                  },
                ].map((item) => (
                  <Box
                    key={item.key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      background: darkMode
                        ? alpha(theme.palette.text.primary, 0.03)
                        : alpha(theme.palette.text.primary, 0.03),
                      padding: "4px 8px",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: darkMode
                            ? alpha(theme.palette.divider, 0.1)
                            : alpha(theme.palette.divider, 0.1),
                        },
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Checkbox
                        size="small"
                        checked={item.filter}
                        onChange={(e) =>
                          setFilters({ [item.key]: e.target.checked })
                        }
                        sx={{ padding: 0 }}
                      />
                      <Typography variant="body2">{item.label}</Typography>
                    </Box>
                    <input
                      type="color"
                      value={item.color}
                      onChange={(e) => item.setColor(e.target.value)}
                      style={{
                        border: "none",
                        width: 24,
                        height: 24,
                        cursor: "pointer",
                        background: "transparent",
                        padding: 0,
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 1.5, opacity: 0.4 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {darkMode ? t("theme.dark") : t("theme.light")}
                    </Typography>
                  }
                />

                <Button
                  variant="contained"
                  onClick={exportGraph}
                  startIcon={<FileDownloadIcon />}
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 600,
                    py: 1,
                    color: "text.primary",
                    "&:hover": {
                      background: darkMode
                        ? alpha(theme.palette.text.primary, 0.05)
                        : alpha(theme.palette.text.primary, 0.03),
                    },
                    "&:active": {
                      background: darkMode
                        ? alpha(theme.palette.text.primary, 0.15)
                        : alpha(theme.palette.text.primary, 0.1),
                    },
                  }}
                >
                  {t("menu.exportJson")}
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} setIsSearch={setIsSearchActive} />
        {searchResults.length > 0 && isSearchActive && (
          <div
            className="search-results"
            style={{
              background: darkMode
                ? alpha(theme.palette.background.paper, 0.85)
                : alpha(theme.palette.background.paper, 0.85),
              backdropFilter: "blur(16px)",
              border: darkMode
                ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
                : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              color: darkMode ? "#F1F5F9" : "#0F172A",
            }}
          >
            {searchResults.map((result) => {
              const badgeColor = getNodeColor(result.typeMath, [
                colorLemme,
                colorAxiome,
                colorTheoreme,
                colorReciproque,
                colorDefinition,
                colorCorollaire,
                colorProposition,
                colorPropriete,
              ]);

              return (
                <div
                  key={result.id}
                  className="search-result-item"
                  onClick={() => handleResultsSearch(result)}
                  style={{
                    borderLeft: `3px solid ${badgeColor}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode
                      ? alpha(theme.palette.divider, 0.06)
                      : alpha(theme.palette.divider, 0.04);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span className="search-result-title">{result.nom}</span>
                  <span
                    className="search-result-meta"
                    style={{ color: badgeColor }}
                  >
                    {result.typeMath}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {searchResults.length === 0 && isSearchActive && (
          <div
            className="search-results"
            style={{
              background: darkMode
                ? alpha(theme.palette.background.paper, 0.85)
                : alpha(theme.palette.background.paper, 0.85),
              backdropFilter: "blur(16px)",
              border: darkMode
                ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
                : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              color: darkMode ? "#F1F5F9" : "#0F172A",
            }}
          >
            <div className="search-no-results">
              {t("search.no_concept_found")}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
