import { create } from "zustand";
import { getDrivers } from "./api";

export const useDriverStore = create((set) => ({
  drivers: [],
  isLoading: false,
  error: null,

  getDrivers: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getDrivers();

      set({
        drivers: response.data.results,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },
}));
