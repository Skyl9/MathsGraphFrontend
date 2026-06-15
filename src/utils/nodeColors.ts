import { Color } from "three";

export const getNodeColor = (
  typeMath: string | undefined,
  colors: string[],
): string => {
  const type = (typeMath ?? "").toLowerCase().trim();
  if (type === "axiome") return colors[1];
  if (type === "théorème" || type === "theoreme") return colors[2];
  if (type === "lemme") return colors[0];
  if (type === "réciproque" || type === "reciproque")
    return colors[3] || "#FF5E5E";

  // Fallbacks visuels pour les autres types communs
  if (type === "définition" || type === "definition")
    return colors[4] || "#3B82F6"; // Bleu
  if (type === "corollaire") return colors[5] || "#F43F5E"; // Rose
  if (type === "proposition") return colors[6] || "#EAB308"; // Jaune
  if (type === "propriété" || type === "propriete")
    return colors[7] || "#14B8A6"; // Teal

  // Par défaut pour un type inconnu ou "concept"
  return "#7DD3FC"; // Bleu ciel (Default typeColor)
};

export const getLabelColor = (
  color: string,
  mode: "dark" | "light",
): string => {
  if (mode === "dark") {
    return color === "black" ? "#ffffff" : color;
  }
  // In light mode, we darken the node color by 60% for better readability
  return new Color(color).lerp(new Color("black"), 0.6).getStyle();
};
