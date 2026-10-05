import { create } from "zustand";
import {
  createComplaintApi, getComplaintApi, getComplaintFileApi,
  getComplaintsApi, getComplaintTargetsApi,
} from "./api";
import { getComplaintTargetLabel } from "../../../shared/lib/complaints";

const errorMessage = (error) => error.response?.data?.message || error.message || "Не удалось выполнить запрос";

export const useComplaintStore = create((set, get) => ({
  items: [], targets: [], detail: null, selectedId: null,
  isLoading: false, isTargetsLoading: false, isDetailsLoading: false, isSubmitting: false,
  downloadingIndex: null,
  listError: null, targetsError: null, detailError: null, submitError: null, downloadError: null,

  getComplaints: async () => {
    set({ isLoading: true, listError: null });
    try {
      const { data } = await getComplaintsApi();
      set({ items: data.results || [], isLoading: false });
    } catch (error) {
      set({ listError: errorMessage(error), isLoading: false });
    }
  },
  getTargets: async () => {
    set({ isTargetsLoading: true, targetsError: null });
    try {
      const { data } = await getComplaintTargetsApi();
      const targets = [
        ...(data.leads || []).map((item) => ({ ...item, type: "lead" })),
        ...(data.factorings || []).map((item) => ({ ...item, type: "factoring" })),
      ].map((item) => ({ ...item, label: getComplaintTargetLabel(item) }));
      set({ targets, isTargetsLoading: false });
    } catch (error) {
      set({ targetsError: errorMessage(error), isTargetsLoading: false });
    }
  },
  createComplaint: async (payload) => {
    if (get().isSubmitting) return false;
    set({ isSubmitting: true, submitError: null });
    try {
      await createComplaintApi(payload);
      await get().getComplaints();
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ submitError: errorMessage(error), isSubmitting: false });
      return false;
    }
  },
  getComplaint: async (id) => {
    set({ selectedId: id, detail: null, isDetailsLoading: true, detailError: null, downloadError: null });
    try {
      const { data } = await getComplaintApi(id);
      if (get().selectedId === id) set({ detail: data.data, isDetailsLoading: false });
    } catch (error) {
      if (get().selectedId === id) set({ detailError: errorMessage(error), isDetailsLoading: false });
    }
  },
  closeComplaint: () => set({ selectedId: null, detail: null, detailError: null, downloadError: null, isDetailsLoading: false }),
  downloadFile: async (id, file) => {
    if (get().downloadingIndex !== null) return;
    set({ downloadingIndex: file.index, downloadError: null });
    try {
      const { data } = await getComplaintFileApi(id, file.index);
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name || "Файл";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      if (get().selectedId === id) set({ downloadError: errorMessage(error) });
    } finally {
      set({ downloadingIndex: null });
    }
  },
}));
