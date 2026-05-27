import { useMemo } from "react";
import { motion } from "framer-motion";
import { Typography, IconButton, Button, Box, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import LaunchIcon from '@mui/icons-material/Launch';
import { Vector3 } from "three";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";
import { useGraphData } from "../hooks/useGraphData";
import { NodeData } from "../types/ApiTypes/graph";
import '../styles/NodeDetails.css';

interface NodeDetailsProps {
    id: number;
    onClose: () => void;
}

export default function NodeDetails({ id, onClose }: NodeDetailsProps) {
    const darkMode = useUIStore(s => s.darkMode);
    const currentView = useUIStore(s => s.currentView);
    const { setSelectedNodeId, setTargetPosition } = useGraphStore();
    const { graphData } = useGraphData();

    // Trouver le concept sélectionné
    const concept = useMemo(() => {
        if (!graphData || !id) return null;
        return graphData.nodes.find(node => node.id === id) || null;
    }, [graphData, id]);

    // Trouver les voisins reliés
    const neighbors = useMemo(() => {
        if (!graphData || !id) return [];
        return graphData.edges
            .filter(edge => edge.start === id || edge.end === id)
            .map(edge => {
                const neighborId = edge.start === id ? edge.end : edge.start;
                const neighborNode = graphData.nodes.find(n => n.id === neighborId);
                return neighborNode ? { ...neighborNode, relType: edge.type } : null;
            })
            .filter((n): n is (NodeData & { relType?: string }) => n !== null);
    }, [graphData, id]);

    if (!concept) return null;

    // Déterminer la couleur du type de concept
    let typeColor = "#7DD3FC";
    let typeLabel = concept.typeMath;
    if (concept.typeMath === "axiome") typeColor = "#52C575";
    else if (concept.typeMath === "théorème") typeColor = "#F99D1C";
    else if (concept.typeMath === "lemme") typeColor = "#AE66CC";

    const handleFocusNode = () => {
        if (concept.position && concept.position[currentView]) {
            const { x, y, z } = concept.position[currentView];
            setTargetPosition(new Vector3(x, y, z));
        }
    };

    const handleSelectNeighbor = (neighborId: number, position: any) => {
        setSelectedNodeId(neighborId);
        if (position && position[currentView]) {
            const { x, y, z } = position[currentView];
            setTargetPosition(new Vector3(x, y, z));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="node-details-sidebar"
        >
            <Box
                className="sidebar-container"
                sx={{
                    background: darkMode ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(20px)",
                    border: darkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.08)",
                }}
            >
                {/* Header */}
                <Box className="sidebar-header" style={{ borderLeft: `4px solid ${typeColor}` }}>
                    <IconButton
                        size="small"
                        onClick={onClose}
                        className="sidebar-close-btn"
                        sx={{ color: darkMode ? "#94A3B8" : "#475569" }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    
                    <Typography 
                        variant="h5" 
                        className="sidebar-title"
                        sx={{ color: darkMode ? "#F8FAFC" : "#0F172A" }}
                    >
                        {concept.nom}
                    </Typography>

                    <Box 
                        className="math-type-badge"
                        style={{ 
                            background: `${typeColor}20`, 
                            color: typeColor, 
                            border: `1px solid ${typeColor}40` 
                        }}
                    >
                        {typeLabel}
                    </Box>
                </Box>

                {/* Body */}
                <Box className="sidebar-body">
                    {/* Section Description / Type */}
                    <Box>
                        <Typography className="section-label" sx={{ color: darkMode ? "#94A3B8" : "#64748B" }}>
                            Description & Détails
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? "#CBD5E1" : "#334155" }}>
                            Ce concept est défini mathématiquement comme un {concept.typeMath}. Vous pouvez explorer sa structure complète, ses démonstrations associées, ainsi que ses commentaires en ouvrant sa fiche détaillée.
                        </Typography>
                    </Box>

                    <Divider sx={{ opacity: 0.4 }} />

                    {/* Section Relations */}
                    <Box>
                        <Typography className="section-label" sx={{ color: darkMode ? "#94A3B8" : "#64748B" }}>
                            Concepts liés ({neighbors.length})
                        </Typography>
                        {neighbors.length > 0 ? (
                            <Box className="neighbors-list">
                                {neighbors.map((n) => {
                                    let nColor = "#7DD3FC";
                                    if (n.typeMath === "axiome") nColor = "#52C575";
                                    else if (n.typeMath === "théorème") nColor = "#F99D1C";
                                    else if (n.typeMath === "lemme") nColor = "#AE66CC";

                                    return (
                                        <Box
                                            key={n.id}
                                            className="neighbor-chip"
                                            onClick={() => handleSelectNeighbor(n.id, n.position)}
                                            sx={{
                                                background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                                                color: darkMode ? "#E2E8F0" : "#0F172A",
                                                borderLeft: `3px solid ${nColor}`,
                                                "&:hover": {
                                                    background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.07)",
                                                    borderColor: nColor,
                                                }
                                            }}
                                        >
                                            <span style={{ marginRight: 4 }}>{n.nom}</span>
                                            {n.relType && (
                                                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>({n.relType})</span>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                                Aucun concept lié répertorié.
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Footer Actions */}
                <Box className="sidebar-footer">
                    <Button
                        variant="outlined"
                        color="inherit"
                        className="sidebar-footer-btn"
                        startIcon={<CenterFocusStrongIcon />}
                        onClick={handleFocusNode}
                        sx={{
                            borderColor: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
                            color: darkMode ? "#CBD5E1" : "#334155",
                            "&:hover": {
                                background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                            }
                        }}
                    >
                        Centrer
                    </Button>
                    <Button
                        variant="contained"
                        className="sidebar-footer-btn"
                        href={`/concept/${concept.id}`}
                        startIcon={<LaunchIcon />}
                        sx={{
                            background: darkMode ? "rgba(255, 255, 255, 0.15)" : "primary.main",
                            color: "#ffffff",
                            "&:hover": {
                                background: darkMode ? "rgba(255, 255, 255, 0.25)" : "primary.dark",
                            }
                        }}
                    >
                        Fiche
                    </Button>
                </Box>
            </Box>
        </motion.div>
    );
}