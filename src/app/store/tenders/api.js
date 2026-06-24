import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json/forwarder/v1";

//Эндпоинты респонсы своих созданных тендеров

export const getTendersApi = async (params) => {
  const data = await axios.get(`${BASE_URL}/tenders`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getTenderDetailsApi = async (tender_id) => {
  const data = await axios.get(`${BASE_URL}/tender/${tender_id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const createTender = async (payload) => {
  const data = await axios.post(`${BASE_URL}/tender/create`, payload, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const updateTender = async (tender_id, payload) => {
  const data = await axios.put(
    `${BASE_URL}/tender/${tender_id}/update`,
    payload,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const deleteTenderApi = async (tender_id) => {
  const data = await axios.delete(`${BASE_URL}/tender/${tender_id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const startTenderApi = async (tender_id) => {
  const data = await axios.post(`${BASE_URL}/tender/${tender_id}/start`, null, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const cancelTenderApi = async (tender_id) => {
  const data = await axios.post(
    `${BASE_URL}/tender/${tender_id}/cancel`,
    null,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const addParticipantApi = async (tender_id, payload) => {
  const data = await axios.post(
    `${BASE_URL}/tender/${tender_id}/participant`,
    payload,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const deleteParticipantApi = async (tender_id, participant_id) => {
  const data = await axios.delete(
    `${BASE_URL}/tender/${tender_id}/participant/${participant_id}`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

//Эндпоинты респонсы тендеров созданных Customer
export const getCustomerTendersApi = async (params) => {
  const data = await axios.get(`${BASE_URL}/customer-tenders`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getCustomerTenderDetailsApi = async (tender_id) => {
  const data = await axios.get(`${BASE_URL}/customer-tender/${tender_id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const makeBetApi = async (tender_id, payload) => {
  const data = await axios.post(
    `${BASE_URL}/tender/${tender_id}/bet`,
    payload,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const cancelBetApi = async (tender_id, bet_index) => {
  const data = await axios.post(
    `${BASE_URL}/tender/${tender_id}/bet/${bet_index}/cancel`,
    null,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};
