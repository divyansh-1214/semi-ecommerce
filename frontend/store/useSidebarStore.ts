import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SidebarState {
  expandedCategories: Record<number, boolean>;
  toggleCategory: (categoryId: number) => void;
  setExpanded: (categoryId: number, isExpanded: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      expandedCategories: {},
      toggleCategory: (categoryId) =>
        set((state) => ({
          expandedCategories: {
            ...state.expandedCategories,
            [categoryId]: !state.expandedCategories[categoryId],
          },
        })),
      setExpanded: (categoryId, isExpanded) =>
        set((state) => ({
          expandedCategories: {
            ...state.expandedCategories,
            [categoryId]: isExpanded,
          },
        })),
    }),
    {
      name: "sidebar-state", // localStorage key
    }
  )
);
