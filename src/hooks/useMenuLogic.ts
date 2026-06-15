import { useState, useCallback } from "react";
import { useUIStore } from "../stores/useUIStore";
import { useFilterStore } from "../stores/useFilterStore";
import { useGraphStore } from "../stores/useGraphStore";
import { Graph, NodeData } from "../types/ApiTypes/graph";

export const useMenuLogic = (graphData: Graph) => {
  const darkMode = useUIStore((s) => s.darkMode);
  const setDarkMode = useUIStore((s) => s.setDarkMode);
  const currentView = useUIStore((s) => s.currentView);
  const setCurrentView = useUIStore((s) => s.setCurrentView);
  const useInstancedEdges = useUIStore((s) => s.useInstancedEdges);
  const setUseInstancedEdges = useUIStore((s) => s.setUseInstancedEdges);
  const graphTheme = useUIStore((s) => s.graphTheme);
  const setGraphTheme = useUIStore((s) => s.setGraphTheme);

  const colorAxiome = useUIStore((s) => s.colorAxiome);
  const colorLemme = useUIStore((s) => s.colorLemme);
  const colorTheoreme = useUIStore((s) => s.colorTheoreme);
  const colorReciproque = useUIStore((s) => s.colorReciproque);
  const colorDefinition = useUIStore((s) => s.colorDefinition);
  const colorCorollaire = useUIStore((s) => s.colorCorollaire);
  const colorProposition = useUIStore((s) => s.colorProposition);
  const colorPropriete = useUIStore((s) => s.colorPropriete);

  const setColorAxiome = useUIStore((s) => s.setColorAxiome);
  const setColorLemme = useUIStore((s) => s.setColorLemme);
  const setColorTheoreme = useUIStore((s) => s.setColorTheoreme);
  const setColorReciproque = useUIStore((s) => s.setColorReciproque);
  const setColorDefinition = useUIStore((s) => s.setColorDefinition);
  const setColorCorollaire = useUIStore((s) => s.setColorCorollaire);
  const setColorProposition = useUIStore((s) => s.setColorProposition);
  const setColorPropriete = useUIStore((s) => s.setColorPropriete);

  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);

  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const setTargetPosition = useGraphStore((s) => s.setTargetPosition);

  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<NodeData[]>([]);
  const isSearchActive = useGraphStore((s) => s.isSearchActive);
  const setIsSearchActive = useGraphStore((s) => s.setIsSearchActive);

  const renderMode = useUIStore((s) => s.renderMode);
  const setRenderMode = useUIStore((s) => s.setRenderMode);

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
      setTargetPosition({ x: pos.x, y: pos.y, z: pos.z });
      setSelectedNodeId(node.id);
      setIsSearchActive(false); // fermer la recherche après sélection
    } else {
      console.warn("Position introuvable pour le nœud.");
    }
  }

  return {
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
  };
};
