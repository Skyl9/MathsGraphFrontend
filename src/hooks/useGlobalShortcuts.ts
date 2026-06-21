import { useEffect } from "react";
import { useGraphStore } from "../stores/useGraphStore";
import { useUIStore } from "../stores/useUIStore";

export const useGlobalShortcuts = () => {
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const setIsSearchActive = useGraphStore((s) => s.setIsSearchActive);
  const isSearchActive = useGraphStore((s) => s.isSearchActive);
  const goBack = useGraphStore((s) => s.goBack);
  const goForward = useGraphStore((s) => s.goForward);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur tape dans un champ de texte (input, textarea)
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        // On permet quand même à "Echap" de quitter les champs / fermer la recherche
        if (e.key === "Escape" && isSearchActive) {
          setIsSearchActive(false);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          // Echap : Désélectionne le nœud courant et ferme la recherche
          setSelectedNodeId(null);
          setIsSearchActive(false);
          break;

        case "ArrowLeft":
          goBack();
          break;

        case "ArrowRight":
          goForward();
          break;

        case "f":
        case "F":
          // Ctrl+F / Cmd+F : Ouvrir la recherche
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault(); // Empêche la recherche native du navigateur
            setIsSearchActive(true);
          }
          break;

        case "d":
        case "D":
          // Ctrl+D / Cmd+D : Basculer le mode sombre
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            toggleDarkMode();
          }
          break;

        // On peut rajouter d'autres raccourcis ici (ex: vue physique vs grille)
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    setSelectedNodeId,
    setIsSearchActive,
    isSearchActive,
    toggleDarkMode,
    goBack,
    goForward,
  ]);
};
