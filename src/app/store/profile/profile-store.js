import { create } from "zustand";
import {
  deleteAvatarApi,
  editProfileApi,
  getProfileDataApi,
  uploadAvatarApi,
} from "./api";

export const useProfileStore = create((set) => ({
  profileData: null,
  uploadAvatarError: null,
  isProfileLoading: false,
  isAvatarLoading: false,

  getProfileData: async () => {
    try {
      set({ isProfileLoading: true, error: null });

      const response = await getProfileDataApi();

      set({ profileData: response, isProfileLoading: false, error: null });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isProfileLoading: false,
      });

      throw e;
    }
  },

  editProfileData: async (payload) => {
    try {
      set({ isProfileLoading: true, error: null });

      const response = await editProfileApi(payload);

      set({ isProfileLoading: false, error: null });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isProfileLoading: false,
      });

      throw e;
    }
  },

  uploadAvatar: async (payload) => {
    try {
      set({ isAvatarLoading: true, uploadAvatarError: null });

      const response = await uploadAvatarApi(payload);

      set({ isAvatarLoading: false, uploadAvatarError: null });

      return response;
    } catch (e) {
      set({
        uploadAvatarError: e.response.data.message,
        isAvatarLoading: false,
      });

      throw e;
    }
  },

  deleteAvatar: async () => {
    try {
      set({ isAvatarLoading: true, error: null });

      const response = await deleteAvatarApi();

      set({ isAvatarLoading: false, error: null });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isAvatarLoading: false,
      });

      throw e;
    }
  },
}));
