import { create } from 'zustand';
import { Vector3 } from 'three';

interface GraphState {
    targetPosition: Vector3 | null;
    initialPosition: Vector3 | null;
    isPosInitial: boolean;
    selectedNodeId: number | null;
    history: number[]; // Historique des identifiants des concepts visités
    currentIndex: number;
    isSearchActive: boolean; // Flag indiquant si l'utilisateur est en train de rechercher

    setTargetPosition: (pos: Vector3 | null) => void;
    setInitialPosition: (pos: Vector3 | null) => void;
    setIsPosInitial: (val: boolean) => void;
    setSelectedNodeId: (id: number | null) => void;
    setIsSearchActive: (val: boolean) => void;

    setHistory: (updater: number[] | ((prev: number[]) => number[])) => void;
    setCurrentIndex: (updater: number | ((prev: number) => number)) => void;

    goBack: () => void;
    goForward: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
    targetPosition: null,
    initialPosition: null,
    isPosInitial: true,
    selectedNodeId: null,
    history: [],
    currentIndex: -1,
    isSearchActive: false,

    setTargetPosition: (pos) => set({ targetPosition: pos }),
    setInitialPosition: (pos) => set({ initialPosition: pos }),
    setIsPosInitial: (val) => set({ isPosInitial: val }),
    setIsSearchActive: (val) => set({ isSearchActive: val }),
    
    setSelectedNodeId: (id) => {
        if (id === null) {
            set({ selectedNodeId: null });
            return;
        }

        const { history, currentIndex } = get();

        // Évite de dupliquer si on est déjà sur le même nœud
        if (currentIndex >= 0 && history[currentIndex] === id) {
            set({ selectedNodeId: id });
            return;
        }

        // Si on choisit un nouveau nœud après être revenu en arrière,
        // on coupe l'historique futur
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(id);

        set({
            selectedNodeId: id,
            history: newHistory,
            currentIndex: newHistory.length - 1
        });
    },

    setHistory: (updater) => set((state) => ({
        history: typeof updater === 'function' ? updater(state.history) : updater
    })),
    setCurrentIndex: (updater) => set((state) => ({
        currentIndex: typeof updater === 'function' ? updater(state.currentIndex) : updater
    })),

    goBack: () => {
        const { currentIndex, history } = get();
        if (currentIndex <= 0) return;
        const newIndex = currentIndex - 1;
        set({ currentIndex: newIndex, selectedNodeId: history[newIndex] });
    },
    goForward: () => {
        const { currentIndex, history } = get();
        if (currentIndex >= history.length - 1) return;
        const newIndex = currentIndex + 1;
        set({ currentIndex: newIndex, selectedNodeId: history[newIndex] });
    }
}));