import { api } from "../../app/client.js";
import { normalizePlannedRoute } from "../lib/planned-route.js";

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
