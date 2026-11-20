// src/api/auth.js
import { api } from "./client";
import { getAuthEndpoint } from "./auth-endpoints.js";

export const loginRequest = (data, nonce) =>
  api.post(getAuthEndpoint("auth"), data, {
    headers: {
      ...(nonce && { "X-WP-Nonce": nonce }),
    },
  });
export const loginRequestDriver = (data) => api.post("/auth/v2/auth", data);

export const registerRequest = (data, nonce) =>
  api.post(getAuthEndpoint("register"), data, {
    headers: {
      ...(nonce && { "X-WP-Nonce": nonce }),
    },
  });
export const registerRequestDriver = (data) =>
  api.post("/auth/v2/register", data);

export const forgotPasswordRequest = (data) =>
  api.post(getAuthEndpoint("forgot-password"), data);

export const resetPasswordRequest = (data) =>
  api.post(getAuthEndpoint("reset-password"), data);

export const getClaimInfoApi = (claimCode) =>
  api.get(getAuthEndpoint("claim-info"), {
    params: {
      claim: claimCode,
    },
  });

export const getEcpLoginUrlRequest = () => api.get(getAuthEndpoint("ecp"));
