export function nativePushPath(link, apiUrl, staging) {
  const prefix = staging ? "/staging/forwarder" : "/forwarder";
  const fallback = `${prefix}/`;
  try {
    const api = new URL(apiUrl);
    const target = new URL(String(link || "").replaceAll("\\/", "/"), api.origin);
    const allowed = new Set([api.origin, "https://360logistics.kz", "https://forwarder.360logistics.kz"]);
    if (target.protocol !== "https:" || !allowed.has(target.origin) || target.username || target.password) return fallback;
    // A driver's event may link to the customer's view of the same lead.
    const path = target.pathname.replace(/^\/staging(?=\/)/, "").replace(/^\/(?:forwarder|customer)(?=\/|$)/, "");
    if (target.pathname.startsWith(`${prefix}/`) || /^\/leads\/[^/]+\/?$/.test(path)) {
      return `${prefix}${path || "/"}${target.search}${target.hash}`;
    }
  } catch { /* Invalid links open the cabinet. */ }
  return fallback;
}
