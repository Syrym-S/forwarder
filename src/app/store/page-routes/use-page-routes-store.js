import { create } from "zustand";

export const usePageRoutesStore = create((set) => ({
  currentPath: null,
  prevPath: null,

  setPath: (path) =>
    set((state) => ({
      prevPath: state.currentPath,
      currentPath: path,
    })),
}));
