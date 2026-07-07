import { api } from "../../client";

export const getFactoringsApi = async (params) => {
  const data = await api.get(`/forwarder/v1/factorings`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const searchFactorApi = async (params) => {
  const data = await api.get(`/forwarder/v1/factors/search`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getFactoringDetailsApi = async (index) => {
  const data = await api.get(`/forwarder/v1/factoring/${index}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const createFactoringApi = async (payload) => {
  const data = await api.post(`/forwarder/v1/factoring/create`, payload, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const acceptFactoringApi = async (factoring_index) => {
  const data = await api.post(
    `/forwarder/v1/factoring/${factoring_index}/accept`,
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
