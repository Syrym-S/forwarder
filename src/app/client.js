import axios from "axios";
import { languageParser } from "../shared/helpers/language-parser.js";

export const isStaging = window?.APP_DATA?.mode === "staging";

const baseURL = import.meta.env.VITE_API_URL;

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
