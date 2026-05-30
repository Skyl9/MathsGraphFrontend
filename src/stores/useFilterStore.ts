import { create } from 'zustand';

interface FilterState {
    filters: {
        axiome: boolean;
        théorème: boolean;
        lemme: boolean;
        réciproque: boolean;
    };
    setFilters: (updater: Partial<FilterState["filters"]> | ((prev: FilterState["filters"]) => FilterState["filters"])) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    filters: {
        axiome: true,
        théorème: true,
        lemme: true,
        réciproque: true,
    },
    setFilters: (updater) => set((state) => {
        const nextFilters = typeof updater === 'function' ? updater(state.filters) : updater;
        return { filters: { ...state.filters, ...nextFilters } };
    }),
}));