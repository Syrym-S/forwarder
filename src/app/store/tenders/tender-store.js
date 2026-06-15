import { createTender } from "./api";

export const useTendersStore = create((set) => ({
  tenders: [],
  isLoading: [],

  createTender: async (payload) => {
    try {
      const response = await createTender(payload);

      return response;
    } catch (e) {
      console.log(e);
    }
  },
}));
