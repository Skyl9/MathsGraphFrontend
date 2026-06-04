import { useCallback, useState } from "react";
import { Vector3 } from "three";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchBar from "./SearchBar";
import "../styles/Menu.css";
import { Graph, NodeData } from "../types/ApiTypes/graph";
import { AutoGraph, GridOn, AccountTree, Timeline } from "@mui/icons-material";
import { useUIStore } from "../stores/useUIStore";
import { useFilterStore } from "../stores/useFilterStore";
import { useGraphStore } from "../stores/useGraphStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface MenuProps {
  graphData: Graph;
}

export default function Menu({ graphData }: MenuProps) {
  const darkMode = useUIStore((s) => s.darkMode);
  const setDarkMode = useUIStore((s) => s.setDarkMode);
  const currentView = useUIStore((s) => s.currentView);
  const setCurrentView = useUIStore((s) => s.setCurrentView);
  const graphTheme = useUIStore((s) => s.graphTheme);
  const setGraphTheme = useUIStore((s) => s.setGraphTheme);

  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);

  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const setTargetPosition = useGraphStore((s) => s.setTargetPosition);

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<NodeData[]>([]);
  const isSearchActive = useGraphStore((s) => s.isSearchActive);
  const setIsSearchActive = useGraphStore((s) => s.setIsSearchActive);

  const exportGraph = () => {
    const dataStr = JSON.stringify(graphData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graphData.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSearch = useCallback(
    (query: string) => {
      if (!query || typeof query !== "string") {
        setSearchResults([]);
        return;
      }

      if (graphData) {
        const results = graphData.nodes.filter((node) =>
          node.nom.toLowerCase().includes(query.toLowerCase()),
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    },
    [graphData],
  );

  function handleResultsSearch(node: NodeData) {
    if (node) {
      const pos = node.position[currentView] ||
        node.position["grille"] ||
        node.position["physique"] || { x: 0, y: 0, z: 0 };
      setTargetPosition(new Vector3(pos.x, pos.y, pos.z));
      setSelectedNodeId(node.id);
      setIsSearchActive(false); // fermer la recherche après sélection
    } else {
      console.warn("Position introuvable pour le nœud.");
    }
  }

  const renderMode = useUIStore((s) => s.renderMode);
  const setRenderMode = useUIStore((s) => s.setRenderMode);

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
                    ? "rgba(15, 23, 42, 0.75)"
                    : "rgba(255, 255, 255, 0.75)",
                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "1px solid rgba(15, 23, 42, 0.08)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                  p: 1.5,
                  "&:hover": {
                    background: darkMode
                      ? "rgba(30, 41, 59, 0.85)"
                      : "rgba(241, 245, 249, 0.85)",
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
                background: darkMode
                  ? "rgba(15, 23, 42, 0.75)"
                  : "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(16px)",
                border: darkMode
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(15, 23, 42, 0.08)",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                color: darkMode ? "#E2E8F0" : "#0F172A",
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
                  Configuration
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
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(15, 23, 42, 0.15)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 1,
                  "&:hover": {
                    background: darkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(15, 23, 42, 0.03)",
                    borderColor: darkMode
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(15, 23, 42, 0.3)",
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
                {t("menu.visibleCategories")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  mb: 1.5,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.axiome}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          axiome: !prev.axiome,
                        }))
                      }
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {t("categories.axioms")}
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.théorème}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          théorème: !prev.théorème,
                        }))
                      }
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {t("categories.theorems")}
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.lemme}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, lemme: !prev.lemme }))
                      }
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {t("categories.lemmas")}
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.réciproque}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          réciproque: !prev.réciproque,
                        }))
                      }
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {t("categories.reciprocals")}
                    </Typography>
                  }
                />
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
                    background: darkMode
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(15, 23, 42, 0.9)",
                    color: darkMode ? "#ffffff" : "#ffffff",
                    "&:hover": {
                      background: darkMode
                        ? "rgba(255, 255, 255, 0.25)"
                        : "rgba(15, 23, 42, 1)",
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
                ? "rgba(15, 23, 42, 0.85)"
                : "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(16px)",
              border: darkMode
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(15, 23, 42, 0.08)",
              color: darkMode ? "#F1F5F9" : "#0F172A",
            }}
          >
            {searchResults.map((result) => {
              let badgeColor = "#7DD3FC";
              if (result.typeMath === "axiome") badgeColor = "#52C575";
              else if (result.typeMath === "théorème") badgeColor = "#F99D1C";
              else if (result.typeMath === "lemme") badgeColor = "#AE66CC";

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
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(0, 0, 0, 0.04)";
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
                ? "rgba(15, 23, 42, 0.85)"
                : "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(16px)",
              border: darkMode
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(15, 23, 42, 0.08)",
              color: darkMode ? "#F1F5F9" : "#0F172A",
            }}
          >
            <div className="search-no-results">Aucun concept trouvé</div>
          </div>
        )}
      </div>
    </>
  );
}
