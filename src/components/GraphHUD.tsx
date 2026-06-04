import React, { useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Popover,
  Typography,
  Divider,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { useGraphStore } from "../stores/useGraphStore";
import { useUIStore } from "../stores/useUIStore";
import { useTranslation } from "react-i18next";
import "../styles/GraphHUD.css";

export const GraphHUD: React.FC = () => {
  const darkMode = useUIStore((s) => s.darkMode);
  const { t } = useTranslation();
  const triggerZoomAction = useUIStore((s) => s.triggerZoomAction);
  const { history, currentIndex, goBack, goForward } = useGraphStore();

  // Shortcuts popover state
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpenShortcuts = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseShortcuts = () => {
    setAnchorEl(null);
  };

  const openShortcuts = Boolean(anchorEl);
  const id = openShortcuts ? "shortcuts-popover" : undefined;

  const triggerZoomIn = () => {
    triggerZoomAction("in");
  };

  const triggerZoomOut = () => {
    triggerZoomAction("out");
  };

  const triggerReset = () => {
    triggerZoomAction("reset");
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  return (
    <Box className="graph-hud-container">
      <Box
        className="hud-pill"
        sx={{
          background: darkMode
            ? "rgba(15, 23, 42, 0.75)"
            : "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(12px)",
          border: darkMode
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* Historique Précédent */}
        <Tooltip title={t("graph_hud.prev_concept")}>
          <span>
            <IconButton
              size="small"
              onClick={goBack}
              disabled={!canGoBack}
              sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Historique Suivant */}
        <Tooltip title={t("graph_hud.next_concept")}>
          <span>
            <IconButton
              size="small"
              onClick={goForward}
              disabled={!canGoForward}
              sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ opacity: 0.3, mx: 0.5 }}
        />

        {/* Zoom + */}
        <Tooltip title={t("graph_hud.zoom_in")}>
          <IconButton
            size="small"
            onClick={triggerZoomIn}
            sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Zoom - */}
        <Tooltip title={t("graph_hud.zoom_out")}>
          <IconButton
            size="small"
            onClick={triggerZoomOut}
            sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Reset caméra */}
        <Tooltip title={t("graph_hud.reset_view")}>
          <IconButton
            size="small"
            onClick={triggerReset}
            sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ opacity: 0.3, mx: 0.5 }}
        />

        {/* Aide raccourcis */}
        <Tooltip title={t("graph_hud.shortcuts")}>
          <IconButton
            aria-describedby={id}
            size="small"
            onClick={handleOpenShortcuts}
            sx={{ color: darkMode ? "#7DD3FC" : "#0EA5E9" }}
          >
            <KeyboardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Raccourcis Popover */}
      <Popover
        id={id}
        open={openShortcuts}
        anchorEl={anchorEl}
        onClose={handleCloseShortcuts}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
              background: darkMode
                ? "rgba(15, 23, 42, 0.9)"
                : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              border: darkMode
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
              color: darkMode ? "#E2E8F0" : "#0F172A",
            },
          },
        }}
      >
        <Box className="shortcuts-popover">
          <Typography variant="subtitle2" className="shortcuts-title">
            {t("graph_hud.shortcuts")}
          </Typography>

          <Box className="shortcut-row">
            <Typography variant="caption">
              {t("graph_hud.nav_right")}
            </Typography>
            <span className="shortcut-key">D</span>
          </Box>
          <Box className="shortcut-row">
            <Typography variant="caption">{t("graph_hud.nav_left")}</Typography>
            <span className="shortcut-key">Q</span>
          </Box>
          <Box className="shortcut-row">
            <Typography variant="caption">
              {t("graph_hud.next_concept")}
            </Typography>
            <span className="shortcut-key">→</span>
          </Box>
          <Box className="shortcut-row">
            <Typography variant="caption">
              {t("graph_hud.prev_concept")}
            </Typography>
            <span className="shortcut-key">←</span>
          </Box>
          <Box className="shortcut-row">
            <Typography variant="caption">
              {t("graph_hud.debug_mode")}
            </Typography>
            <span className="shortcut-key">M</span>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};
