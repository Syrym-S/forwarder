import axios from "axios";
import { getNotificationsTokenApi } from "../app/store/notifications/api.js";
import { atWebPushStage } from "./web-push-errors.js";

export function waitForPageConfig() {
  return document.readyState === "loading"
    ? new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true }))
    : Promise.resolve();
}

async function pushAuthorization() {
  await waitForPageConfig();
  const config = window.NotifWS_Config || window.NotificationWS_Config || {};
  if (!config.push) throw new Error("web_push_endpoint_missing");
  const url = new URL(config.push, window.location.origin);
  if (url.protocol !== "https:" && !(url.origin === window.location.origin && window.isSecureContext)) {
    throw new Error("web_push_endpoint_missing");
  }
  // This application is the forwarder cabinet, regardless of other cabinets on this domain.
  const role = "forwarder";
  const response = await atWebPushStage("notification-auth", () => getNotificationsTokenApi());
  const sources = [response, response?.data, response?.result];
  const token = sources.map((item) => item?.token || item?.access_token || item?.accessToken).find(Boolean);
  if (!response || response.success === false || response.status === false || response.error || !token) {
    throw new Error("web_push_auth_failed");
  }
  return { url: url.href, role, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };
}

export async function savePushToken(token) {
  if (!token) throw new Error("web_push_token_failed");
  const { url, role, headers } = await pushAuthorization();
  // Separate client: never send WordPress cookies or its nonce to the notification service.
  const response = await atWebPushStage("push-register", () =>
    axios.post(url, { role, token, device: "web" }, { headers, timeout: 15000 }));
  return response.data;
}

export async function removePushToken(token) {
  // An omitted token would delete ALL devices. Never issue that request.
  if (!token) throw new Error("web_push_token_failed");
  const { url, role, headers } = await pushAuthorization();
  const response = await atWebPushStage("push-remove", () =>
    axios.delete(url, { data: { role, token }, headers, timeout: 15000 }));
  return response.data;
}
