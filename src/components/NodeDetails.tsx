import { useMemo, useEffect } from "react";
import FocusTrap from "focus-trap-react";
import {
  Typography,
  IconButton,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { defaultSpring } from "../utils/animations";
import CloseIcon from "@mui/icons-material/Close";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import LaunchIcon from "@mui/icons-material/Launch";
import { useUIStore } from "../stores/useUIStore";
import { getNodeColor } from "../utils/nodeColors";
import { useGraphStore } from "../stores/useGraphStore";
import { useGraphData } from "../hooks/useGraphData";
import MathMarkdown from "./MathMarkdown";
import { useTranslation } from "react-i18next";

import {
  NodeDetailsSidebar,
  SidebarContainer,
  SidebarHeader,
  SidebarTitle,
  MathTypeBadge,
  SidebarBody,
  SectionLabel,
  NeighborsList,
  NeighborChip,
  SidebarFooter,
  SidebarFooterBtn,
} from "./NodeDetails.styles";
interface NodeDetailsProps {
  id: number;
  onClose: () => void;
}

export default function NodeDetails({ id, onClose }: NodeDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const darkMode = useUIStore((s) => s.darkMode);
  const currentView = useUIStore((s) => s.currentView);
  const { setSelectedNodeId, setTargetPosition } = useGraphStore();
  const { graphData, nodesMap } = useGraphData();
  const colorAxiome = useUIStore((s) => s.colorAxiome);
  const colorLemme = useUIStore((s) => s.colorLemme);
  const colorTheoreme = useUIStore((s) => s.colorTheoreme);
  const colorReciproque = useUIStore((s) => s.colorReciproque);
  const colorDefinition = useUIStore((s) => s.colorDefinition);
  const colorCorollaire = useUIStore((s) => s.colorCorollaire);
  const colorProposition = useUIStore((s) => s.colorProposition);
  const colorPropriete = useUIStore((s) => s.colorPropriete);

  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Trouver le concept sélectionné
  const concept = useMemo(() => {
    if (!graphData || !id) return null;
    return nodesMap.get(id) || null;
  }, [graphData, nodesMap, id]);

  // Trouver les voisins reliés
  const neighbors = useMemo(() => {
    if (!graphData || !id) return [];
    return graphData.edges
      .filter((edge) => edge.start === id || edge.end === id)
      .map((edge) => {
        const neighborId = edge.start === id ? edge.end : edge.start;
        const neighborNode = nodesMap.get(neighborId);
        return neighborNode ? { ...neighborNode, relType: edge.type } : null;
      })
      .filter((n): n is NonNullable<typeof n> => n !== null);
  }, [graphData, nodesMap, id]);

  if (!concept) return null;

  // Déterminer la couleur du type de concept
  const typeLabel = concept.typeMath;
  const typeColor = getNodeColor(concept.typeMath, [
    colorLemme,
    colorAxiome,
    colorTheoreme,
    colorReciproque,
    colorDefinition,
    colorCorollaire,
    colorProposition,
    colorPropriete,
  ]);

  const handleFocusNode = () => {
    if (concept.position) {
      const pos = concept.position[currentView] ||
        concept.position["grille"] ||
        concept.position["physique"] || { x: 0, y: 0, z: 0 };
      setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
    }
  };

  const handleSelectNeighbor = (
    neighborId: number,
    position: Record<string, { x: number; y: number; z: number }> | undefined,
  ) => {
    setSelectedNodeId(neighborId);
    if (position) {
      const pos = position[currentView] ||
        position["grille"] ||
        position["physique"] || { x: 0, y: 0, z: 0 };
      setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
    }
  };

  return (
    <FocusTrap
      focusTrapOptions={{
        escapeDeactivates: false,
        clickOutsideDeactivates: true,
      }}
    >
      <NodeDetailsSidebar
        initial={{
          opacity: 0,
          x: isMobile ? 0 : 40,
          y: isMobile ? 100 : 0,
        }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{
          opacity: 0,
          x: isMobile ? 0 : "100%",
          y: isMobile ? "100%" : 0,
        }}
        transition={defaultSpring}
      >
        <SidebarContainer>
          {/* Header */}
          <SidebarHeader style={{ borderLeft: `4px solid ${typeColor}` }}>
            <IconButton
              aria-label={t("common.close")}
              size="small"
              onClick={onClose}
              className="sidebar-close-btn"
              sx={{ color: darkMode ? "#94A3B8" : "#475569" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <SidebarTitle
              variant="h5"
              sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
            >
              {concept.nom}
            </SidebarTitle>

            <MathTypeBadge
              style={{
                background: typeColor,
                color: theme.palette.getContrastText(typeColor),
                border: `1px solid ${typeColor}`,
              }}
            >
              {typeLabel}
            </MathTypeBadge>
          </SidebarHeader>

          {/* Body */}
          <SidebarBody>
            {/* Section Description / Type */}
            <Box>
              <SectionLabel sx={{ color: darkMode ? "#94A3B8" : "#64748B" }}>
                {t("node_details.description")}
              </SectionLabel>
              <Box
                sx={{
                  color: darkMode ? "#CBD5E1" : "#334155",
                  fontSize: "0.875rem",
                }}
              >
                {concept.enonce ? (
                  <MathMarkdown content={concept.enonce} />
                ) : (
                  <Typography variant="body2">
                    {t("node_details.fallback_desc", {
                      type: concept.typeMath,
                    })}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ opacity: 0.4 }} />

            {/* Section Relations */}
            <Box>
              <SectionLabel sx={{ color: darkMode ? "#94A3B8" : "#64748B" }}>
                {t("node_details.linked_concepts", { count: neighbors.length })}
              </SectionLabel>
              {neighbors.length > 0 ? (
                <NeighborsList>
                  {neighbors.map((n) => {
                    const nColor = getNodeColor(n.typeMath, [
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
                      <NeighborChip
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectNeighbor(n.id, n.position);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectNeighbor(n.id, n.position);
                          }
                        }}
                        sx={{
                          textDecoration: "none",
                          background: darkMode
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.03)",
                          color: darkMode ? "#E2E8F0" : "#0F172A",
                          borderLeft: `3px solid ${nColor}`,
                          "&:hover": {
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.07)",
                            borderColor: nColor,
                          },
                        }}
                      >
                        <span style={{ marginRight: 4 }}>{n.nom}</span>
                        {n.relType && (
                          <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                            ({n.relType})
                          </span>
                        )}
                      </NeighborChip>
                    );
                  })}
                </NeighborsList>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", opacity: 0.7 }}
                >
                  {t("node_details.no_linked_concepts")}
                </Typography>
              )}
            </Box>
          </SidebarBody>

          {/* Footer Actions */}
          <SidebarFooter>
            <SidebarFooterBtn
              variant="outlined"
              color="inherit"
              className="sidebar-footer-btn"
              startIcon={<CenterFocusStrongIcon />}
              onClick={handleFocusNode}
              sx={{
                borderColor: darkMode
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.12)",
                color: darkMode ? "#CBD5E1" : "#334155",
                "&:hover": {
                  background: darkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                },
              }}
            >
              {t("node_details.focus")}
            </SidebarFooterBtn>
            <SidebarFooterBtn
              variant="contained"
              className="sidebar-footer-btn"
              href={`/concept/${concept.id}`}
              startIcon={<LaunchIcon />}
              sx={{
                background: darkMode
                  ? "rgba(255, 255, 255, 0.15)"
                  : "primary.main",
                color: "#ffffff",
                "&:hover": {
                  background: darkMode
                    ? "rgba(255, 255, 255, 0.25)"
                    : "primary.dark",
                },
              }}
            >
              {t("node_details.profile")}
            </SidebarFooterBtn>
          </SidebarFooter>
        </SidebarContainer>
      </NodeDetailsSidebar>
    </FocusTrap>
  );
}
