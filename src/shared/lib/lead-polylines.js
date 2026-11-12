import { normalizePlannedRoute } from "./planned-route.js";

export function normalizeLeadPolylines(response) {
  if (!Array.isArray(response)) {
    throw new Error("Polyline service returned an invalid response");
  }

  const routes = new Map();
  for (const item of response) {
    if (item?.status !== "ok" && item?.status !== "no_tracking") continue;
    const leadId = item.lead_id;
    if (leadId == null || String(leadId).trim() === "") continue;

    try {
      routes.set(String(leadId), normalizePlannedRoute({ polyline: item.route_polyline }));
    } catch {
      // A missing or invalid polyline must not hide the other leads' routes.
    }
  }
  return routes;
}
