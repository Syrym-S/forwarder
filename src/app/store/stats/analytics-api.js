import { api } from "../../client";

export async function getAnalyticsApi(params, signal) {
  const response = await api.get("forwarder/v1/leads/analytics", {
    params,
    signal,
  });
  return response.data;
}
