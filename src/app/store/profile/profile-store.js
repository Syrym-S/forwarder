import { create } from "zustand";
import { getProfileDataApi } from "./api";

export const useProfileStore = create((set) => ({
  profileData: null,

  getProfileData: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getProfileDataApi();

      set({ profileData: response, isLoading: false, error: null });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      throw e;
    }
  },
}));
