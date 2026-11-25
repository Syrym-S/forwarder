import { Capacitor, registerPlugin } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import * as web from "./firebase.js";
import { createNativePushClient } from "./native-push-client.js";

export const isNativePush = Capacitor.getPlatform() === "android";
const settings = registerPlugin("ForwarderPush");
const tokenKey = () => `forwarder.native.fcm.${window.APP_DATA?.mode || "production"}`;
let currentToken;
function rememberToken(token) {
  currentToken = token;
  try {
    if (token) localStorage.setItem(tokenKey(), token);
    else localStorage.removeItem(tokenKey());
  } catch { /* Keep the token in memory if storage is unavailable. */ }
}
const native = createNativePushClient({ push: PushNotifications, settings, rememberToken });

export const getWebPushPermission = () => isNativePush ? native.permission() : web.getWebPushPermission();
export const refreshPushPermission = async () => {
  if (isNativePush) await native.refresh();
};
export const registerWebPush = (options) => isNativePush ? native.register(options) : web.registerWebPush(options);
export const setPushDeliveryEnabled = async (enabled) => {
  if (isNativePush) await native.setEnabled(enabled);
};
export function getSavedWebPushToken() {
  if (!isNativePush) return web.getSavedWebPushToken();
  try { return currentToken || localStorage.getItem(tokenKey()); }
  catch { return currentToken; }
}
export function forgetWebPushToken() {
  if (isNativePush) rememberToken(null);
  else web.forgetWebPushToken();
}
export async function listenWebPush(callback) {
  // Native service displays background messages without a running WebView.
  if (isNativePush) {
    const listener = await PushNotifications.addListener("pushNotificationActionPerformed", (action) => callback?.(action.notification));
    return () => { listener.remove(); };
  }
  return web.listenWebPush(callback);
}
