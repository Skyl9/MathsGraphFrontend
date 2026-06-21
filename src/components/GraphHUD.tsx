import { alpha } from "@mui/material/styles";
import React, { useState, useRef, useEffect } from "react";
import {
  useTheme,
  IconButton,
  Tooltip,
  Popover,
  Typography,
  Divider,
  Breadcrumbs,
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
import {
  GraphHUDContainer,
  HUDPill,
  ShortcutsPopoverContainer,
  ShortcutsTitle,
  ShortcutRow,
  ShortcutKey,
} from "./GraphHUD.styles";
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

  const renderBreadcrumbs = () => {
    if (history.length <= 1) return null;

    // On affiche les 5 derniers éléments pour ne pas surcharger l'écran
    const maxVisible = 5;
    const startIdx = Math.max(0, history.length - maxVisible);
    const visibleHistory = history.slice(startIdx);

    return (
      <HUDPill
        sx={{
          px: 3,
          py: 0.5,
          background: darkMode
            ? alpha(theme.palette.background.paper, 0.6)
            : alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(12px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          {visibleHistory.map((id, localIdx) => {
            const globalIdx = startIdx + localIdx;
            const isCurrent = globalIdx === currentIndex;
            const node = graphData?.nodes?.find((n) => n.id === id);
            const label = node?.nom || `Concept ${id}`;

            return (
              <Typography
                key={`${globalIdx}-${id}`}
                variant="caption"
                sx={{
                  cursor: "pointer",
                  fontWeight: isCurrent ? 800 : 500,
                  fontSize: isCurrent ? "0.8rem" : "0.75rem",
                  color: isCurrent
                    ? theme.palette.primary.main
                    : darkMode
                      ? "#94A3B8"
                      : "#64748B",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={() => {
                  useGraphStore.getState().setCurrentIndex(globalIdx);
                  useGraphStore.getState().setSelectedNodeId(id);
                  if (node) {
                    const pos = node.position[currentView] ||
                      node.position["grille"] ||
                      node.position["physique"] || { x: 0, y: 0, z: 0 };
                    setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
                  }
                }}
              >
                {label.length > 25 ? label.substring(0, 22) + "..." : label}
              </Typography>
            );
          })}
        </Breadcrumbs>
      </HUDPill>
    );
  };

  return (
    <GraphHUDContainer>
      {renderBreadcrumbs()}
      <HUDPill
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
              aria-label={t("graph_hud.prev_concept")}
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
              aria-label={t("graph_hud.next_concept")}
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
            aria-label={t("graph_hud.prev_concept")}
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
            aria-label={t("graph_hud.next_concept")}
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
            aria-label={t("graph_hud.zoom_in")}
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
            aria-label={t("graph_hud.zoom_out")}
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
            aria-label={t("graph_hud.reset_view")}
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
            aria-label={t("graph_hud.shortcuts")}
            ref={shortcutsButtonRef}
            aria-describedby={id}
            size="small"
            onClick={handleOpenShortcuts}
            sx={{ color: darkMode ? "#7DD3FC" : "#0EA5E9" }}
          >
            <KeyboardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </HUDPill>

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
        <ShortcutsPopoverContainer>
          <ShortcutsTitle variant="subtitle2">
            {t("graph_hud.shortcuts")}
          </ShortcutsTitle>

          <ShortcutRow>
            <Typography variant="caption">
              {t("graph_hud.nav_right")}
            </Typography>
            <ShortcutKey>D</ShortcutKey>
          </ShortcutRow>
          <ShortcutRow>
            <Typography variant="caption">{t("graph_hud.nav_left")}</Typography>
            <ShortcutKey>Q</ShortcutKey>
          </ShortcutRow>
          <ShortcutRow>
            <Typography variant="caption">
              {t("graph_hud.next_concept")}
            </Typography>
            <ShortcutKey>→</ShortcutKey>
          </ShortcutRow>
          <ShortcutRow>
            <Typography variant="caption">
              {t("graph_hud.prev_concept")}
            </Typography>
            <ShortcutKey>←</ShortcutKey>
          </ShortcutRow>
          <ShortcutRow>
            <Typography variant="caption">
              {t("graph_hud.debug_mode")}
            </Typography>
            <ShortcutKey>M</ShortcutKey>
          </ShortcutRow>
        </ShortcutsPopoverContainer>
      </Popover>
    </GraphHUDContainer>
  );
};
