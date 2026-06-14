export const GRAPH_COLORS: Record<string, string> = {
  // Math domains mapped to specific HSL/Hex colors
  Algèbre: "#F43F5E", // Rose/Red
  Analyse: "#3B82F6", // Blue
  Géométrie: "#10B981", // Emerald green
  Probabilités: "#F59E0B", // Amber
  Statistiques: "#F59E0B", // Amber
  Logique: "#8B5CF6", // Violet
  Arithmétique: "#EC4899", // Pink
  Topologie: "#14B8A6", // Teal
  default: "#94A3B8", // Slate grey
};

export const getCategoryColor = (categoryName?: string): string => {
  if (!categoryName) return GRAPH_COLORS.default;
  return GRAPH_COLORS[categoryName] || GRAPH_COLORS.default;
};

export const GRAPH_SIZES = {
  // Size logic based on importance (e.g., number of incoming/outgoing relations)
  base: 1,
  hub: 1.5,
  fundamental: 2.2,
};

export const getNodeSize = (relationCount: number): number => {
  if (relationCount > 10) return GRAPH_SIZES.fundamental;
  if (relationCount > 4) return GRAPH_SIZES.hub;
  return GRAPH_SIZES.base;
};
