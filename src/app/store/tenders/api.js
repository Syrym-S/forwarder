import { api } from "../../client";

//Эндпоинты респонсы своих созданных тендеров

export const getTendersApi = async (params) => {
  const data = await api.get(`forwarder/v1/tenders`, {
    params,
  });

  return data;
};

export const getTenderDetailsApi = async (tender_id) => {
  const data = await api.get(`forwarder/v1/tender/${tender_id}`);

  return data;
};

export const createTender = async (payload) => {
  const data = await api.post(`forwarder/v1/tender/create`, payload);

  return data;
};

export const updateTender = async (tender_id, payload) => {
  const data = await api.put(
    `forwarder/v1/tender/${tender_id}/update`,
    payload,
  );

  return data;
};

export const deleteTenderApi = async (tender_id) => {
  const data = await api.delete(`forwarder/v1/tender/${tender_id}`);

  return data;
};

export const startTenderApi = async (tender_id) => {
  const data = await api.post(`forwarder/v1/tender/${tender_id}/start`, null);

  return data;
};

export const cancelTenderApi = async (tender_id) => {
  const data = await api.post(`forwarder/v1/tender/${tender_id}/cancel`, null);

  return data;
};

export const addParticipantApi = async (tender_id, payload) => {
  const data = await api.post(
    `forwarder/v1/tender/${tender_id}/participant`,
    payload,
  );

  return data;
};

export const deleteParticipantApi = async (tender_id, participant_id) => {
  const data = await api.delete(
    `forwarder/v1/tender/${tender_id}/participant/${participant_id}`,
  );

  return data;
};

//Эндпоинты респонсы тендеров созданных Customer
export const getCustomerTendersApi = async (params) => {
  const data = await api.get(`forwarder/v1/customer-tenders`, {
    params,
  });

  return data;
};

export const getCustomerTenderDetailsApi = async (tender_id) => {
  const data = await api.get(`forwarder/v1/customer-tender/${tender_id}`);

  return data;
};

export const makeBetApi = async (tender_id, payload) => {
  const data = await api.post(`forwarder/v1/tender/${tender_id}/bet`, payload);

  return data;
};

export const cancelBetApi = async (tender_id, bet_index) => {
  const data = await api.post(
    `forwarder/v1/tender/${tender_id}/bet/${bet_index}/cancel`,
    null,
  );

  return data;
};

export const acceptBetApi = async (tender_id, bet_index) => {
  const data = await api.post(
    `forwarder/v1/tender/${tender_id}/bet/${bet_index}/win`,
    null,
  );

  return data;
};
