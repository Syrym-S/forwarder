import { api } from "../../client";

export async function getStatsApi(params) {
  const response = await api.get(`forwarder/v1/leads/stats`, { params });

  return response.data;
}
