import { Capacitor } from "@capacitor/core";

const mobileEndpoints = new Set([
  "auth",
  "register",
  "forgot-password",
  "reset-password",
]);

export function getAuthEndpoint(action, isNative = Capacitor.isNativePlatform()) {
  const version = isNative && mobileEndpoints.has(action) ? "v2" : "v1";
  return `/auth/${version}/${action}`;
}
