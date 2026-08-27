import { api } from "../../client";

export const getContractStatusApi = async () => {
  const data = await api.get(`/forwarder/contract/v1/status`);

  return data;
};

export const signContractApi = async () => {
  const data = await api.post(`/forwarder/contract/v1/sign`, {});

  return data;
};
