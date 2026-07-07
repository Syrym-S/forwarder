import { api } from "../../client";

export const getCustomers = async (params) => {
  const data = await api.get(`/forwarder/v1/customers`, {
    params,
  });

  return data;
};

export const getCustomerDetailsApi = async (customer_id) => {
  const data = await api.get(`/forwarder/v1/customer/${customer_id}`);

  return data;
};

export const searchCustomerApi = async (params) => {
  const data = await api.get(`/forwarder/v1/customers/search`, {
    params,
  });

  return data;
};
