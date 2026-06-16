import { alpha } from "@mui/material/styles";
import React, { useState, useRef, useEffect } from "react";
import {
  useTheme,
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
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { useGraphStore } from "../stores/useGraphStore";
import { useUIStore } from "../stores/useUIStore";
import { useTranslation } from "react-i18next";
import { Graph, NodeData } from "../types/ApiTypes/graph";
import "../styles/GraphHUD.css";

interface GraphHUDProps {
  graphData: Graph | null;
}

export const GraphHUD: React.FC<GraphHUDProps> = ({ graphData }) => {
  const darkMode = useUIStore((s) => s.darkMode);
  const { t } = useTranslation();
  const theme = useTheme();
  const triggerZoomAction = useUIStore((s) => s.triggerZoomAction);
  const currentView = useUIStore((s) => s.currentView);

  const {
    history,
    currentIndex,
    goBack,
    goForward,
    setTargetPosition,
    selectedNodeId,
    setSelectedNodeId,
  } = useGraphStore();

  // Shortcuts popover state
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const shortcutsButtonRef = useRef<HTMLButtonElement>(null);
  const hasSeenShortcuts = useUIStore((s) => s.hasSeenShortcuts);
  const setHasSeenShortcuts = useUIStore((s) => s.setHasSeenShortcuts);

  useEffect(() => {
    if (!hasSeenShortcuts && shortcutsButtonRef.current) {
      setAnchorEl(shortcutsButtonRef.current);
      setHasSeenShortcuts(true);
    }
  }, [hasSeenShortcuts, setHasSeenShortcuts]);

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

  const handlePrevConcept = () => {
    if (!graphData?.nodes || graphData.nodes.length === 0) return;
    if (selectedNodeId === null) {
      setSelectedNodeId(graphData.nodes[0].id);
      return;
    }
    const idx = graphData.nodes.findIndex(
      (n: NodeData) => n.id === selectedNodeId,
    );
    if (idx !== -1) {
      const prevNode =
        graphData.nodes[
          (idx - 1 + graphData.nodes.length) % graphData.nodes.length
        ];
      setSelectedNodeId(prevNode.id);
      const pos = prevNode.position[currentView] ||
        prevNode.position["grille"] ||
        prevNode.position["physique"] || { x: 0, y: 0, z: 0 };
      setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
    }
  };

  const handleNextConcept = () => {
    if (!graphData?.nodes || graphData.nodes.length === 0) return;
    if (selectedNodeId === null) {
      setSelectedNodeId(graphData.nodes[0].id);
      return;
    }
    const idx = graphData.nodes.findIndex(
      (n: NodeData) => n.id === selectedNodeId,
    );
    if (idx !== -1) {
      const nextNode = graphData.nodes[(idx + 1) % graphData.nodes.length];
      setSelectedNodeId(nextNode.id);
      const pos = nextNode.position[currentView] ||
        nextNode.position["grille"] ||
        nextNode.position["physique"] || { x: 0, y: 0, z: 0 };
      setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
    }
  };

  return (
    <Box className="graph-hud-container">
      <Box
        className="hud-pill"
        sx={{
          background: darkMode
            ? alpha(theme.palette.background.paper, 0.75)
            : alpha(theme.palette.background.paper, 0.75),
          backdropFilter: "blur(12px)",
          border: darkMode
            ? `1px solid ${alpha(theme.palette.divider, 0.08)}`
            : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
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

        {/* Concept Précédent */}
        <Tooltip title={t("graph_hud.prev_concept")}>
          <IconButton
            size="small"
            onClick={handlePrevConcept}
            sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
          >
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Concept Suivant */}
        <Tooltip title={t("graph_hud.next_concept")}>
          <IconButton
            size="small"
            onClick={handleNextConcept}
            sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
          >
            <SkipNextIcon fontSize="small" />
          </IconButton>
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
            ref={shortcutsButtonRef}
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
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(8px)",
              border: darkMode
                ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
                : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              boxShadow: `0 10px 20px ${alpha(theme.palette.common.black, 0.15)}`,
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
