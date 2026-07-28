import { create } from "zustand";
import {
  deleteAvatarApi,
  editProfileApi,
  getLegalDocumentsApi,
  getProfileDataApi,
  uploadAvatarApi,
  uploadLegalDocumentsApi,
} from "./api";

export const useProfileStore = create((set) => ({
  profileData: null,
  legalDocuments: null,
  uploadAvatarError: null,
  isProfileLoading: false,
  isAvatarLoading: false,
  isLegalDocumentsLoading: false,

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

  getLegalDocuments: async () => {
    try {
      set({ isLegalDocumentsLoading: true, error: null });

      const response = await getLegalDocumentsApi();

      set({
        legalDocuments: response.documents,
        isLegalDocumentsLoading: false,
        error: null,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isAvatarLisLegalDocumentsLoadingoading: false,
      });

      throw e;
    }
  },

  uploadLegalDocuments: async (
    registrationDocumentsToUpload,
    employerDocumentToUpload,
  ) => {
    try {
      set({ isLegalDocumentsLoading: true, error: null });

      const response = await uploadLegalDocumentsApi(
        registrationDocumentsToUpload,
        employerDocumentToUpload,
      );

      set({
        isLegalDocumentsLoading: false,
        error: null,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isAvatarLisLegalDocumentsLoadingoading: false,
      });

      throw e;
    }
  },
}));
