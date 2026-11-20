import { api } from "../../app/client.js";
import { loadLeadTracking } from "../lib/lead-tracking.js";

export function getLeadTracking(lead, { signal } = {}) {
  return loadLeadTracking({
    tracking: lead.tracking,
    signal,
    requestToken: async () => {
      const response = await api.post("/geows/v1/token", {
        lead_id: lead.id,
        type: "read",
      }, {
        signal,
        timeout: 15000,
        ...(window.GeoWS_Config?.nonce && {
          headers: { "X-WP-Nonce": window.GeoWS_Config.nonce },
        }),
      });
      return response.data;
    },
    requestTracking: (access) => api.get(access.url, {
      signal,
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${access.token}`,
        key: window.GeoWS_Config?.key,
        ws: window.GeoWS_Config?.ws,
        wsHost: window.GeoWS_Config?.ws,
      },
    }),
  });
}
