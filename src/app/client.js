import axios from "axios";
import { languageParser } from "../shared/helpers/language-parser.js";

export const isStaging = window?.APP_DATA?.mode === "staging";

const baseURL = isStaging
  ? window?.APP_DATA?.rest_url
  : "https://forwarder.360logistics.kz/wp-json";

const nonce = window?.APP_DATA?.nonce || "";

export const api = axios.create({
  baseURL,
  headers: {
    ...(nonce && { "X-WP-Nonce": nonce }),
  },
});

api.interceptors.request.use((config) => {
  config.headers.set(
    "Accept-Language",
    languageParser(localStorage.getItem("language")),
  );
  return config;
});
