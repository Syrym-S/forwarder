import { api } from "../../../../src/app/client";

export const getSharedLeadApi = async (id, token) => {
  const data = await api.get(`/forwarder/v1/shared-leads/${id}/`, {
    params: {
      token,
    },
  });

  return data;
};
