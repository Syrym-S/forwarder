import { Capacitor } from "@capacitor/core";

export function getPostAuthRedirect(redirectUrl, fallbackPath, {
  isNative = Capacitor.isNativePlatform(),
  apiUrl = import.meta.env?.VITE_API_URL,
} = {}) {
  if (!isNative) return redirectUrl || fallbackPath;
  if (!redirectUrl) return fallbackPath;

  try {
    const api = new URL(apiUrl);
    const destination = new URL(redirectUrl, api);
    const prefix = api.pathname.replace(/\/wp-json\/?$/, "");
    const cabinet = `${prefix}/forwarder`;
    const authPages = ["login", "register", "forgot-password", "reset-password"]
      .map((page) => `${prefix}/auth/${page}`);
    const isAppRoute = destination.pathname === cabinet ||
      destination.pathname.startsWith(`${cabinet}/`) ||
      authPages.some((path) => destination.pathname === path || destination.pathname === `${path}/`);

    if (destination.origin === api.origin && isAppRoute) {
      // A local path keeps Capacitor on its bundled app instead of opening Chrome.
      return destination.pathname + destination.search + destination.hash;
    }
  } catch {
    // An unsupported server redirect still completes inside the native app.
  }

  return fallbackPath;
}
