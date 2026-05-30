import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    toggleDarkMode: () => void;

    colorAxiome: string;
    colorLemme: string;
    colorTheoreme: string;
    colorSides: string;

    debugMode: boolean;
    setDebugMode: (value: boolean | ((prev: boolean) => boolean)) => void;

    currentView: string;
    setCurrentView: (view: string) => void;

    graphTheme: "classique" | "neon" | "focus";
    setGraphTheme: (theme: "classique" | "neon" | "focus") => void;
    renderMode: "quality" | "performance";
    setRenderMode: (mode: "quality" | "performance") => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            setDarkMode: (value) => set({ darkMode: value }),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

            colorAxiome: "#52C575",
            colorLemme: "#AE66CC",
            colorTheoreme: "#F99D1C",
            colorSides: "black",

            debugMode: false,
            setDebugMode: (value) => set((state) => ({
                debugMode: typeof value === 'function' ? value(state.debugMode) : value
            })),

            currentView: "grille",
            setCurrentView: (view) => set({ currentView: view }),

            graphTheme: "classique",
            setGraphTheme: (theme) => set({ graphTheme: theme }),
            renderMode: "quality", // Mode beau par défaut
            setRenderMode: (mode) => set({ renderMode: mode
        }),}),
        {
            name: 'mathgraph-ui-storage', // Nom dans le localStorage
            partialize: (state) => ({ darkMode: state.darkMode, graphTheme: state.graphTheme, renderMode: state.renderMode }), // On sauvegarde uniquement ces 2 valeurs !
        }
    )
);