import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;

  colorAxiome: string;
  setColorAxiome: (v: string) => void;
  colorLemme: string;
  setColorLemme: (v: string) => void;
  colorTheoreme: string;
  setColorTheoreme: (v: string) => void;
  colorReciproque: string;
  setColorReciproque: (v: string) => void;
  colorDefinition: string;
  setColorDefinition: (v: string) => void;
  colorCorollaire: string;
  setColorCorollaire: (v: string) => void;
  colorProposition: string;
  setColorProposition: (v: string) => void;
  colorPropriete: string;
  setColorPropriete: (v: string) => void;
  colorSides: string;

  debugMode: boolean;
  setDebugMode: (value: boolean | ((prev: boolean) => boolean)) => void;

  currentView: string;
  setCurrentView: (view: string) => void;

  graphTheme: "classique" | "neon" | "focus";
  setGraphTheme: (theme: "classique" | "neon" | "focus") => void;
  renderMode: "quality" | "performance";
  setRenderMode: (mode: "quality" | "performance") => void;

  useInstancedEdges: boolean;
  setUseInstancedEdges: (value: boolean) => void;

  zoomAction: { action: "in" | "out" | "reset" | null; timestamp: number };
  triggerZoomAction: (action: "in" | "out" | "reset") => void;

  hasSeenShortcuts: boolean;
  setHasSeenShortcuts: (value: boolean) => void;

  timelineYear: number | null;
  setTimelineYear: (year: number | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
      setDarkMode: (value) => set({ darkMode: value }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      colorAxiome: "#52C575",
      setColorAxiome: (v) => set({ colorAxiome: v }),
      colorLemme: "#AE66CC",
      setColorLemme: (v) => set({ colorLemme: v }),
      colorTheoreme: "#F99D1C",
      setColorTheoreme: (v) => set({ colorTheoreme: v }),
      colorReciproque: "#FF5E5E",
      setColorReciproque: (v) => set({ colorReciproque: v }),
      colorDefinition: "#3B82F6",
      setColorDefinition: (v) => set({ colorDefinition: v }),
      colorCorollaire: "#F43F5E",
      setColorCorollaire: (v) => set({ colorCorollaire: v }),
      colorProposition: "#EAB308",
      setColorProposition: (v) => set({ colorProposition: v }),
      colorPropriete: "#14B8A6",
      setColorPropriete: (v) => set({ colorPropriete: v }),
      colorSides: "#888888",

      debugMode: false,
      setDebugMode: (value) =>
        set((state) => ({
          debugMode:
            typeof value === "function" ? value(state.debugMode) : value,
        })),

      currentView: "grille",
      setCurrentView: (view) => set({ currentView: view }),

      graphTheme: "classique",
      setGraphTheme: (theme) => set({ graphTheme: theme }),
      renderMode: "quality", // Mode beau par défaut
      setRenderMode: (mode) => set({ renderMode: mode }),

      useInstancedEdges: false,
      setUseInstancedEdges: (value) => set({ useInstancedEdges: value }),

      zoomAction: { action: null, timestamp: 0 },
      triggerZoomAction: (action) =>
        set({ zoomAction: { action, timestamp: Date.now() } }),

      hasSeenShortcuts: false,
      setHasSeenShortcuts: (value) => set({ hasSeenShortcuts: value }),

      timelineYear: null,
      setTimelineYear: (year) => set({ timelineYear: year }),
    }),
    {
      name: "mathgraph-ui-storage", // Nom dans le localStorage
      partialize: (state) => ({
        darkMode: state.darkMode,
        graphTheme: state.graphTheme,
        renderMode: state.renderMode,
        useInstancedEdges: state.useInstancedEdges,
        hasSeenShortcuts: state.hasSeenShortcuts,
        colorAxiome: state.colorAxiome,
        colorLemme: state.colorLemme,
        colorTheoreme: state.colorTheoreme,
        colorReciproque: state.colorReciproque,
        colorDefinition: state.colorDefinition,
        colorCorollaire: state.colorCorollaire,
        colorProposition: state.colorProposition,
        colorPropriete: state.colorPropriete,
      }), // On sauvegarde uniquement ces valeurs !
    },
  ),
);
