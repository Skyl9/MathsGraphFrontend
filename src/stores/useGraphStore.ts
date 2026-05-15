import { create } from 'zustand';
import { Vector3 } from 'three';

interface GraphState {
    targetPosition: Vector3 | null;
    initialPosition: Vector3 | null;
    isPosInitial: boolean;
    selectedNodeId: number | null;
    history: Vector3[];
    currentIndex: number;

    setTargetPosition: (pos: Vector3 | null) => void;
    setInitialPosition: (pos: Vector3 | null) => void;
    setIsPosInitial: (val: boolean) => void;
    setSelectedNodeId: (id: number | null) => void;

    setHistory: (updater: any) => void;
    setCurrentIndex: (updater: any) => void;

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

    setTargetPosition: (pos) => set({ targetPosition: pos }),
    setInitialPosition: (pos) => set({ initialPosition: pos }),
    setIsPosInitial: (val) => set({ isPosInitial: val }),
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

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
        set({ currentIndex: newIndex, targetPosition: history[newIndex], selectedNodeId: null });
    },
    goForward: () => {
        const { currentIndex, history } = get();
        if (currentIndex >= history.length - 1) return;
        const newIndex = currentIndex + 1;
        set({ currentIndex: newIndex, targetPosition: history[newIndex], selectedNodeId: null });
    }
}));