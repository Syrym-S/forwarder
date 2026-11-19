import axios from "axios";

export const isStaging = window?.APP_DATA?.mode === "staging";

const baseURL = import.meta.env.VITE_API_URL;
const nonce = window?.APP_DATA?.nonce;

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    ...(nonce && { "X-WP-Nonce": nonce }),
  },
});
