import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";
import { useFilterStore } from "../stores/useFilterStore";

export const useUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentView = useUIStore((s) => s.currentView);
  const setCurrentView = useUIStore((s) => s.setCurrentView);

  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);

  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);

  const isInitialized = useRef(false);

  // 1. Initialisation de Zustand depuis l'URL (au montage)
  useEffect(() => {
    if (isInitialized.current) return;

    const view = searchParams.get("view");
    if (view && ["grille", "arbre", "physique", "timeline"].includes(view)) {
      setCurrentView(view);
    }

    const node = searchParams.get("node");
    if (node) {
      const nodeId = parseInt(node, 10);
      if (!isNaN(nodeId)) {
        // Petit délai pour s'assurer que le graphe est prêt à recevoir la sélection
        setTimeout(() => setSelectedNodeId(nodeId), 100);
      }
    }

    const urlFilters = searchParams.get("filters");
    if (urlFilters) {
      const filterArray = urlFilters.split(",");
      setFilters({
        axiome: filterArray.includes("axiome"),
        théorème: filterArray.includes("theoreme"),
        lemme: filterArray.includes("lemme"),
        réciproque: filterArray.includes("reciproque"),
      });
    }

    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Synchronisation de l'URL quand Zustand change
  useEffect(() => {
    if (!isInitialized.current) return;

    const newParams = new URLSearchParams(searchParams);
    let hasChanges = false;

    // Vue
    if (newParams.get("view") !== currentView) {
      newParams.set("view", currentView);
      hasChanges = true;
    }

    // Nœud
    const currentNodeParam = newParams.get("node");
    if (
      selectedNodeId !== null &&
      currentNodeParam !== selectedNodeId.toString()
    ) {
      newParams.set("node", selectedNodeId.toString());
      hasChanges = true;
    } else if (selectedNodeId === null && currentNodeParam !== null) {
      newParams.delete("node");
      hasChanges = true;
    }

    // Filtres
    const activeFilters = [];
    if (filters.axiome) activeFilters.push("axiome");
    if (filters.théorème) activeFilters.push("theoreme");
    if (filters.lemme) activeFilters.push("lemme");
    if (filters.réciproque) activeFilters.push("reciproque");

    const filtersParamValue = activeFilters.join(",");
    const currentFiltersParam = newParams.get("filters");

    if (activeFilters.length < 4) {
      if (currentFiltersParam !== filtersParamValue) {
        newParams.set("filters", filtersParamValue);
        hasChanges = true;
      }
    } else {
      if (currentFiltersParam !== null) {
        newParams.delete("filters"); // Si tout est actif, on nettoie l'URL
        hasChanges = true;
      }
    }

    if (hasChanges) {
      // Utiliser replace pour ne pas inonder l'historique de navigation du navigateur
      setSearchParams(newParams, { replace: true });
    }
  }, [currentView, selectedNodeId, filters, searchParams, setSearchParams]);
};
