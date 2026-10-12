import { create } from "zustand";
import { getStatsApi } from "./api";
import { getAnalyticsApi } from "./analytics-api";

let latestRequest = 0;
let latestAnalyticsRequest = 0;

export const useStatsStore = create((set) => ({
  stats: [],

  isLoading: false,

  error: null,

  analytics: null,
  isAnalyticsLoading: false,
  analyticsError: null,

  getAnalytics: async (params, signal) => {
    const requestId = ++latestAnalyticsRequest;
    set({ analytics: null, isAnalyticsLoading: true, analyticsError: null });
    try {
      const response = await getAnalyticsApi(params, signal);
      if (requestId === latestAnalyticsRequest) {
        set({ analytics: response, isAnalyticsLoading: false });
      }
      return response;
    } catch (error) {
      if (requestId !== latestAnalyticsRequest) return;
      set({
        isAnalyticsLoading: false,
        analyticsError: signal?.aborted
          ? null
          : error.response?.data?.message || error.message,
      });
    }
  },

  getStats: async (params) => {
    const requestId = ++latestRequest;
    try {
      set({ isLoading: true, error: null });

      const response = await getStatsApi(params);

      if (requestId === latestRequest) {
        set({ stats: response, isLoading: false, error: null });
      }

      return response;
    } catch (e) {
      if (requestId !== latestRequest) return;
      set({
        error: e.message,
        isLoading: false,
      });

      throw e;
    }
  },
}));

export function getAnalyticsComparison(analytics, indicator, currency) {
  const currencies = [...new Set([
    ...(analytics?.currencies ?? []).map((row) => row.currency),
    ...(analytics?.previous?.currencies ?? []).map((row) => row.currency),
  ])];
  const selectedCurrency = currencies.includes(currency) ? currency : currencies[0] ?? "";
  const isMoney = !["count", "emergency_count"].includes(indicator);
  const matches = (row) => !isMoney || row.currency === selectedCurrency;
  const current = (analytics?.currencies ?? []).filter(matches).reduce((sum, row) => sum + Number(row.total?.[indicator] ?? 0), 0);
  const previous = (analytics?.previous?.currencies ?? []).filter(matches).reduce((sum, row) => sum + Number(row[indicator] ?? 0), 0);
  const change = previous === 0 ? (current === 0 ? 0 : null) : (current - previous) / previous * 100;

  const buckets = new Map();
  for (const row of analytics?.currencies ?? []) {
    for (const bucket of row.buckets ?? []) {
      const item = buckets.get(bucket.key) ?? { ...bucket, value: 0 };
      if (matches(row)) item.value += Number(bucket[indicator] ?? 0);
      buckets.set(bucket.key, item);
    }
  }
  const points = [...buckets.values()].sort((a, b) => a.from.localeCompare(b.from));
  return { currencies, selectedCurrency, isMoney, current, previous, change, points };
}
