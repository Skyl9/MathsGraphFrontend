import {
  IconButton,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Divider,
  Switch,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchBar from "./SearchBar";
import MenuLayoutSettings from "./MenuSettings/MenuLayoutSettings";
import MenuColorsSettings from "./MenuSettings/MenuColorsSettings";
import MenuSearchResults from "./MenuSettings/MenuSearchResults";
import "../styles/Menu.css";
import { Graph } from "../types/ApiTypes/graph";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMenuLogic } from "../hooks/useMenuLogic";
import FocusTrap from "focus-trap-react";
import { useEffect } from "react";
import { GlassPaper } from "./GlassPaper";
import { slideInLeft } from "../utils/animations";
interface MenuProps {
  graphData: Graph;
}

const MenuButtonToggle = styled(IconButton)(({ theme }) => ({
  backdropFilter: "blur(12px)",
  background: alpha(theme.palette.background.paper, 0.75),
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  boxShadow: `0 4px 15px ${alpha(theme.palette.common.black, 0.15)}`,
  padding: theme.spacing(1.5),
  "&:hover": {
    background: alpha(theme.palette.background.paper, 0.85),
  },
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  justifyContent: "flex-start",
  borderColor: alpha(theme.palette.text.primary, 0.15),
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "0.875rem",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  "&:hover": {
    background: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.05 : 0.03,
    ),
    borderColor: alpha(theme.palette.text.primary, 0.3),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  fontWeight: 600,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  "&:hover": {
    background: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.05 : 0.03,
    ),
  },
  "&:active": {
    background: alpha(
      theme.palette.text.primary,
      theme.palette.mode === "dark" ? 0.15 : 0.1,
    ),
  },
}));

export default function Menu({ graphData }: MenuProps) {
  const { t } = useTranslation();

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

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
              <MenuButtonToggle
                color="primary"
                aria-label={t("menu.open")}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </MenuButtonToggle>
            </motion.div>
          ) : (
            <FocusTrap
              focusTrapOptions={{
                escapeDeactivates: false,
                clickOutsideDeactivates: true,
              }}
            >
              <motion.div
                variants={slideInLeft}
                initial="hidden"
                animate="show"
                exit="exit"
                className="floating-glass-menu"
                style={{
                  color: "text.primary",
                  maxHeight: "88vh",
                }}
              >
                <GlassPaper
                  blur={20}
                  opacity={0.75}
                  sx={{
                    width: 280,
                    p: "20px",
                    overflowY: "auto",
                    maxHeight: "88vh",
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
                    <IconButton
                      aria-label={t("common.close")}
                      size="small"
                      onClick={() => setOpen(false)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <NavigationButton
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    href="/"
                    startIcon={<HomeIcon />}
                  >
                    {t("menu.backToPortal")}
                  </NavigationButton>

                  <Divider sx={{ my: 1.5, opacity: 0.4 }} />

                  <MenuLayoutSettings
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    renderMode={renderMode}
                    setRenderMode={setRenderMode}
                    useInstancedEdges={useInstancedEdges}
                    setUseInstancedEdges={setUseInstancedEdges}
                    graphTheme={graphTheme}
                    setGraphTheme={setGraphTheme}
                  />

                  <MenuColorsSettings
                    darkMode={darkMode}
                    colorAxiome={colorAxiome}
                    colorLemme={colorLemme}
                    colorTheoreme={colorTheoreme}
                    colorReciproque={colorReciproque}
                    colorDefinition={colorDefinition}
                    colorCorollaire={colorCorollaire}
                    colorProposition={colorProposition}
                    colorPropriete={colorPropriete}
                    setColorAxiome={setColorAxiome}
                    setColorLemme={setColorLemme}
                    setColorTheoreme={setColorTheoreme}
                    setColorReciproque={setColorReciproque}
                    setColorDefinition={setColorDefinition}
                    setColorCorollaire={setColorCorollaire}
                    setColorProposition={setColorProposition}
                    setColorPropriete={setColorPropriete}
                    filters={filters}
                    setFilters={setFilters}
                  />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
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

                    <ActionButton
                      variant="contained"
                      onClick={exportGraph}
                      startIcon={<FileDownloadIcon />}
                      fullWidth
                    >
                      {t("menu.exportJson")}
                    </ActionButton>
                  </Box>
                </GlassPaper>
              </motion.div>
            </FocusTrap>
          )}
        </AnimatePresence>
      </div>

      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} setIsSearch={setIsSearchActive} />
        <MenuSearchResults
          searchResults={searchResults}
          isSearchActive={isSearchActive}
          handleResultsSearch={handleResultsSearch}
          darkMode={darkMode}
          colorAxiome={colorAxiome}
          colorLemme={colorLemme}
          colorTheoreme={colorTheoreme}
          colorReciproque={colorReciproque}
          colorDefinition={colorDefinition}
          colorCorollaire={colorCorollaire}
          colorProposition={colorProposition}
          colorPropriete={colorPropriete}
        />
      </div>
    </>
  );
}
