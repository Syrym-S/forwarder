import { api } from "../../client";

export const getFactorsLineApi = async () => {
  const data = await api.get(`/forwarder/v1/factoring/lines`);

  return data;
};

export const getFactorLineDetailsApi = async (id) => {
  const data = await api.get(`/forwarder/v1/factoring/line/${id}`);

  return data;
};
