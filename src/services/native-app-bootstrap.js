export async function loadNativeAppData({
  isNative,
  apiUrl,
  appData,
  fetch: request = globalThis.fetch,
}) {
  if (!isNative) return appData;

  const url = new URL(apiUrl);
  if (url.protocol !== "https:" || !/\/wp-json\/?$/.test(url.pathname)) {
    throw new Error("The native API URL must end with /wp-json over HTTPS.");
  }
  url.pathname = url.pathname.replace(/\/wp-json\/?$/, "/auth/login");
  url.search = "";
  url.hash = "";

  // CapacitorHttp shares the server's cookies with subsequent API requests.
  const response = await request(url.href, {
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    throw new Error(`Unable to load app settings (${response.status}).`);
  }

  const html = await response.text();
  let notificationConfig;
  // WordPress emits the notification configuration separately from APP_DATA.
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    const assignment = script[1].match(
      /(?:\b(?:var|let|const)\s+|\bwindow\.)(?:NotifWS_Config|NotificationWS_Config)\s*=\s*(\{[^\r\n]*\})\s*;/,
    );
    if (!assignment) continue;
    try { notificationConfig = JSON.parse(assignment[1]); }
    catch { /* Only accept JSON, never execute remote JavaScript. */ }
  }
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    const assignment = script[1].match(
      /\b(?:var|let|const)\s+APP_DATA\s*=\s*(\{[^\r\n]*\})\s*;/,
    );
    if (!assignment) continue;

    // Read WordPress's JSON configuration without executing the remote page.
    const config = JSON.parse(assignment[1]);
    if (typeof config.nonce !== "string" || !config.nonce.trim()) break;
    return { ...appData, ...config, ...(notificationConfig ? { notificationConfig } : {}) };
  }

  throw new Error("The server did not provide app settings with a REST nonce.");
}
