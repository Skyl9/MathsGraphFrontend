import { createStore } from 'zustand/vanilla';

interface FilterState {
    filters: {
        axiome: boolean;
        théorème: boolean;
        lemme: boolean;
        réciproque: boolean;
    };
    setFilters: (updater: Partial<FilterState["filters"]> | ((prev: FilterState["filters"]) => FilterState["filters"])) => void;
}

const store = createStore<FilterState>((set) => ({
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

console.log("Initial:", store.getState().filters);
store.getState().setFilters((prev) => ({ ...prev, axiome: !prev.axiome }));
console.log("After axiome toggle:", store.getState().filters);
store.getState().setFilters({ théorème: false });
console.log("After théorème false:", store.getState().filters);
