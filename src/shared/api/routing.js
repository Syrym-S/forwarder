import { api } from "../../app/client.js";
import { normalizePlannedRoute } from "../lib/planned-route.js";
import { normalizeLeadPolylines } from "../lib/lead-polylines.js";

export async function getLeadPolylines(leadIds, { signal } = {}) {
  const uniqueIds = new Map();
  for (const id of leadIds) {
    if (id != null && String(id).trim() !== "" && !uniqueIds.has(String(id))) {
      uniqueIds.set(String(id), id);
    }
  }
  const ids = [...uniqueIds.values()];
  if (!ids.length) return new Map();

  const response = await api.post(
    "/geows/v1/polylines",
    { lead_ids: ids },
    { signal, timeout: 15000 },
  );
  return normalizeLeadPolylines(response.data);
}

export async function generateLeadRoute(leadId) {
  if (leadId == null || String(leadId).trim() === "") {
    throw new Error("A lead ID is required to generate a route");
  }

  const response = await api.post(
    "/routing/v4/generate",
    { id: leadId },
    { timeout: 15000 },
  );
  return normalizePlannedRoute(response.data);
}
