import { normalizePlannedRoute } from "../../../../src/shared/lib/planned-route.js";

export function getSharedLeadRouteCoordinates(routes) {
  if (!Array.isArray(routes) || routes.length === 0) return [];

  try {
    return normalizePlannedRoute({ routes }).coordinates;
  } catch {
    return [];
  }
}
