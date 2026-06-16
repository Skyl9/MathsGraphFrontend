import { create } from "zustand";

interface FilterState {
  filters: {
    axiome: boolean;
    théorème: boolean;
    lemme: boolean;
    réciproque: boolean;
    définition: boolean;
    corollaire: boolean;
    proposition: boolean;
    propriété: boolean;
  };
  setFilters: (
    updater:
      | Partial<FilterState["filters"]>
      | ((prev: FilterState["filters"]) => FilterState["filters"]),
  ) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {
    axiome: true,
    théorème: true,
    lemme: true,
    réciproque: true,
    définition: true,
    corollaire: true,
    proposition: true,
    propriété: true,
  },
  setFilters: (updater) =>
    set((state) => {
      const nextFilters =
        typeof updater === "function" ? updater(state.filters) : updater;
      return { filters: { ...state.filters, ...nextFilters } };
    }),
}));
