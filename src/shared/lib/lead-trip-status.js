import polyline from "@mapbox/polyline";
import { createStore } from "zustand/vanilla";
import { isDraftLead } from "./lead-draft.js";

export const WAITING_FOR_TRIP_START = "waiting_for_trip_start";
export const TRIP_STATUS_REFRESH_MS = 30000;

export const needsTripStartCheck = (lead) =>
  !isDraftLead(lead) &&
  [true, 1, "1"].includes(lead?.auto_start) &&
  ["new", "add_driver", "start_driver"].includes(lead?.status);

export const getLeadDisplayStatus = (lead, hasPolyline) =>
  needsTripStartCheck(lead) && hasPolyline === false
    ? WAITING_FOR_TRIP_START
    : lead?.status;

export function hasTripPolyline(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid geo tracking response");
  }
  if (data.polyline == null || (typeof data.polyline === "string" && !data.polyline.trim())) return false;
  if (typeof data.polyline !== "string" || data.encoding !== "google") {
    throw new Error("Invalid geo tracking polyline");
  }
  const points = polyline.decode(data.polyline);
  if (!points.length || points.some((point) =>
    point.length !== 2 || !point.every(Number.isFinite) ||
    Math.abs(point[0]) > 90 || Math.abs(point[1]) > 180)) {
    throw new Error("Invalid geo tracking coordinates");
  }
  return true;
}

export function createLeadTrackingStore(requestTracking, { now = Date.now } = {}) {
  const pending = new Map();
  const cache = new Map();

  return createStore((set, get) => ({
    byLead: {},
    record: (leadId, hasPolyline) => {
      if (leadId == null || String(leadId).trim() === "") return;
      const key = String(leadId);
      if (hasPolyline) cache.delete(key);
      // Once movement was observed, an empty snapshot cannot undo it.
      const next = get().byLead[key] === true || hasPolyline;
      if (get().byLead[key] !== next) {
        set((state) => ({ byLead: { ...state.byLead, [key]: next } }));
      }
    },
    load: (lead, options) => {
      const key = String(lead.id ?? lead.tracking?.url);
      const active = pending.get(key);
      if (active && !active.signal?.aborted) return active.request;
      const cached = cache.get(key);
      if (cached && now() - cached.loadedAt < TRIP_STATUS_REFRESH_MS) {
        return Promise.resolve(cached.result);
      }

      const request = Promise.resolve().then(() => requestTracking(lead, options))
        .then((result) => {
          if (options?.signal?.aborted) {
            throw options.signal.reason || new Error("Tracking request aborted");
          }
          const hasPolyline = hasTripPolyline(result.response?.data?.data);
          get().record(lead.id, hasPolyline);
          if (hasPolyline || get().byLead[String(lead.id)] !== true) {
            cache.set(key, { result, loadedAt: now() });
          }
          return result;
        })
        .finally(() => {
          if (pending.get(key)?.request === request) pending.delete(key);
        });
      pending.set(key, { request, signal: options?.signal });
      return request;
    },
  }));
}
