import { create } from 'zustand';

interface FilterState {
    filters: {
        axiome: boolean;
        théorème: boolean;
        lemme: boolean;
        réciproque: boolean;
    };
    setFilters: (updater: any) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    filters: {
        axiome: true,
        théorème: true,
        lemme: true,
        réciproque: true,
    },
    setFilters: (updater) => set((state) => ({
        filters: typeof updater === 'function' ? updater(state.filters) : updater
    })),
}));