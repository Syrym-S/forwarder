import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { hasFirebaseConfig, readFirebaseConfig } from "./firebase-config.js";
import { atWebPushStage } from "./web-push-errors.js";

let currentToken = null;

export function getWebPushScope() {
  return window.APP_DATA?.mode === "staging" ? "/staging/" : "/";
}

function firebaseConfig() {
  return readFirebaseConfig(import.meta.env, { staging: getWebPushScope() === "/staging/" });
}

function tokenStorageKey() {
  const config = firebaseConfig();
  return `forwarder.fcm.${config.projectId}.${config.appId}.${getWebPushScope()}`;
}

export function getSavedWebPushToken() {
  try {
    return currentToken || localStorage.getItem(tokenStorageKey());
  } catch {
    return currentToken;
  }
}

function saveToken(token) {
  currentToken = token;
  try {
    if (token) localStorage.setItem(tokenStorageKey(), token);
    else localStorage.removeItem(tokenStorageKey());
  } catch { /* Push also works when localStorage is unavailable. */ }
}

export function isWebPushConfigured() {
  return hasFirebaseConfig(firebaseConfig()) && Boolean(import.meta.env.VITE_FIREBASE_VAPID_KEY);
}

export function getWebPushPermission() {
  return "Notification" in window ? Notification.permission : "unsupported";
}

function messaging() {
  const appName = `forwarder-web-push-${getWebPushScope() === "/staging/" ? "staging" : "production"}`;
  const app = getApps().find((item) => item.name === appName) || initializeApp(firebaseConfig(), appName);
  return getMessaging(app);
}

function waitForActivation(registration) {
  if (registration.active) return Promise.resolve();
  const worker = registration.installing || registration.waiting;
  if (!worker) return Promise.reject(new Error("web_push_worker_failed"));
  return new Promise((resolve, reject) => {
    const finish = (error) => {
      clearTimeout(timeout);
      worker.removeEventListener("statechange", check);
      if (error) reject(error);
      else resolve();
    };
    const check = () => {
      if (worker.state === "activated") finish();
      else if (worker.state === "redundant") finish(new Error("web_push_worker_failed"));
    };
    const timeout = setTimeout(() => finish(new Error("web_push_worker_failed")), 20000);
    worker.addEventListener("statechange", check);
    check();
  });
}

export async function registerWebPush({ requestPermission = true } = {}) {
  if (!isWebPushConfigured()) throw new Error("web_push_not_configured");
  if (!window.isSecureContext || !("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("web_push_unsupported");
  }

  // Keep the permission request inside the checkbox's user gesture, before any await.
  const permission = getWebPushPermission();
  const result = permission === "default" && requestPermission
    ? await Notification.requestPermission()
    : permission;
  if (result !== "granted") return null;
  if (!(await isSupported())) throw new Error("web_push_unsupported");

  const scope = getWebPushScope();
  const registration = await atWebPushStage("service-worker", async () => {
    const worker = await navigator.serviceWorker.register(`${scope}firebase-messaging-sw.js`, {
      scope,
      updateViaCache: "none",
    });
    await waitForActivation(worker);
    return worker;
  });
  const token = await atWebPushStage("firebase-token", () => getToken(messaging(), {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  }));
  if (!token) throw new Error("web_push_token_failed");
  saveToken(token);
  return token;
}

export async function listenWebPush(callback = () => {}) {
  if (!isWebPushConfigured() || !(await isSupported())) return () => {};
  return onMessage(messaging(), callback);
}

export function forgetWebPushToken() {
  saveToken(null);
}
