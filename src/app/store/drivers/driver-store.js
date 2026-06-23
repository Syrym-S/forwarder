import { create } from "zustand";
import { getDriverDetailsApi, getDriversApi } from "./api";

export const useDriverStore = create((set) => ({
  drivers: [],
  driverDetails: null,
  isLoading: false,
  error: null,

  getDrivers: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getDriversApi();

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
  getDriverDetails: async (driver_id) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getDriverDetailsApi(driver_id);

      set({
        driverDetails: response.data,
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
