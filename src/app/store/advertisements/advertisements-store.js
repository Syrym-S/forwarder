import { create } from "zustand";
import { STATUS } from "../../../shared/const/tenders";
import { isDraftLead } from "../../../shared/lib/lead-draft";
import {
  closeAdvertisementApi,
  createAdvertisementApi,
  deleteAdvertisementApi,
  getCustomerAdvertisementApi,
  getCustomerAdvertisementsApi,
  getMyAdvertisementApi,
  getMyAdvertisementsApi,
  searchAdvertisementLeadsApi,
} from "./api";

const listRequests = {
  my: getMyAdvertisementsApi,
  customer: getCustomerAdvertisementsApi,
};

const detailRequests = {
  my: getMyAdvertisementApi,
  customer: getCustomerAdvertisementApi,
};

const getError = (error) => {
  const message = error.response?.data?.message;
  return typeof message === "string" && message ? message : true;
};

const nonNegativeInteger = (value) => {
  if ((typeof value !== "number" && typeof value !== "string") || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : null;
};

const parseAdvertisementList = ({ data, headers = {} }, requestedPerPage) => {
  const body = data?.data && !Array.isArray(data.data) && !data.id ? data.data : data;
  const items = Array.isArray(body)
    ? body
    : Array.isArray(body?.results)
      ? body.results
      : Array.isArray(body?.data)
        ? body.data
        : body?.id
          ? [body]
          : null;
  if (!items || items.some((item) => !item?.id)) throw new Error("Invalid advertisement list");

  const perPage = nonNegativeInteger(body?.per_page ?? body?.limit) || requestedPerPage;
  const total = nonNegativeInteger(body?.total ?? body?.count ?? data?.total ?? data?.count ?? headers["x-wp-total"]);
  const totalPages = nonNegativeInteger(body?.total_pages ?? body?.last_page ?? headers["x-wp-totalpages"])
    ?? (total === null ? null : Math.ceil(total / perPage));
  return { items, perPage, totalPages };
};

export const useAdvertisementsStore = create((set, get) => ({
  advertisements: [],
  type: "my",
  page: 1,
  perPage: 20,
  totalPages: null,
  isLoading: true,
  error: null,
  listRequest: null,

  currentAdvertisement: null,
  currentAdvertisementKey: null,
  isDetailsLoading: false,
  detailsError: null,
  detailsRequest: null,

  isCreating: false,
  createError: null,

  isClosing: false,
  isDeleting: false,
  actionError: null,
  actionErrorKey: null,

  leads: [],
  searchQuery: "",
  isSearchLoading: false,
  searchError: null,
  searchRequest: null,

  setType: (type) => {
    set({ type, page: 1 });
    return get().getAdvertisements();
  },

  setPage: (page) => get().getAdvertisements({ page }),

  getAdvertisements: async ({ page = get().page } = {}) => {
    const { type, perPage } = get();
    const request = {};
    set({ page, advertisements: [], isLoading: true, error: null, listRequest: request });

    try {
      const response = await listRequests[type]({ page, per_page: perPage });
      if (get().listRequest !== request) return;
      const list = parseAdvertisementList(response, perPage);
      if (list.totalPages !== null && page > Math.max(1, list.totalPages)) {
        return get().getAdvertisements({ page: Math.max(1, list.totalPages) });
      }
      set({
        advertisements: list.items,
        perPage: list.perPage,
        totalPages: list.totalPages,
        isLoading: false,
      });
    } catch (error) {
      if (get().listRequest !== request) return;
      set({ advertisements: [], totalPages: null, isLoading: false, error: getError(error) });
    }
  },

  getAdvertisementDetails: async (id, source = "my") => {
    const request = {};
    set({
      currentAdvertisement: null,
      currentAdvertisementKey: `${source}:${id}`,
      isDetailsLoading: true,
      detailsError: null,
      detailsRequest: request,
    });

    try {
      const response = await detailRequests[source](id);
      if (get().detailsRequest !== request) return;
      const advertisement = response.data?.id ? response.data : response.data?.data;
      if (!advertisement?.id) throw new Error("Invalid advertisement details");
      set({ currentAdvertisement: advertisement, isDetailsLoading: false });
    } catch (error) {
      if (get().detailsRequest !== request) return;
      set({ currentAdvertisement: null, isDetailsLoading: false, detailsError: getError(error) });
    }
  },

  clearCurrentAdvertisement: () => set({
    currentAdvertisement: null,
    currentAdvertisementKey: null,
    isDetailsLoading: false,
    detailsError: null,
    detailsRequest: null,
  }),

  clearCreateError: () => set({ createError: null }),

  clearActionError: () => set({ actionError: null, actionErrorKey: null }),

  closeAdvertisement: async (id) => {
    if (!id || get().isClosing || get().isDeleting) return false;
    set({ isClosing: true, actionError: null, actionErrorKey: null });
    try {
      await closeAdvertisementApi(id);
      if (get().currentAdvertisementKey === `my:${id}`) {
        await get().getAdvertisementDetails(id, "my");
      }
      if (get().type === "my") await get().getAdvertisements();
      set({ isClosing: false });
      return true;
    } catch (error) {
      set({ isClosing: false, actionError: getError(error), actionErrorKey: `my:${id}` });
      throw error;
    }
  },

  deleteAdvertisement: async (id) => {
    if (!id || get().isClosing || get().isDeleting) return false;
    set({ isDeleting: true, actionError: null, actionErrorKey: null });
    try {
      await deleteAdvertisementApi(id);
      if (get().currentAdvertisementKey === `my:${id}`) {
        get().clearCurrentAdvertisement();
      }
      if (get().type === "my") await get().getAdvertisements();
      set({ isDeleting: false });
      return true;
    } catch (error) {
      set({ isDeleting: false, actionError: getError(error), actionErrorKey: `my:${id}` });
      throw error;
    }
  },

  createAdvertisement: async (leadId) => {
    if (!leadId || get().isCreating) return false;
    set({ isCreating: true, createError: null });
    try {
      await createAdvertisementApi(leadId);
      if (get().type === "my") await get().getAdvertisements({ page: 1 });
      set({ isCreating: false });
      return true;
    } catch (error) {
      set({ isCreating: false, createError: getError(error) });
      throw error;
    }
  },

  searchLeads: async (query) => {
    const request = {};
    set({ leads: [], searchQuery: query, isSearchLoading: true, searchError: null, searchRequest: request });
    try {
      const response = await searchAdvertisementLeadsApi({ q: query, status: STATUS.new });
      if (get().searchRequest !== request) return;
      const leads = (response.data.results || []).filter(
        (lead) => lead.status === STATUS.new && !isDraftLead(lead),
      );
      set({ leads, isSearchLoading: false });
    } catch (error) {
      if (get().searchRequest !== request) return;
      set({ leads: [], isSearchLoading: false, searchError: getError(error) });
    }
  },

  clearLeadSearch: () => set({
    leads: [],
    searchQuery: "",
    isSearchLoading: false,
    searchError: null,
    searchRequest: null,
  }),
}));
