import { waitForGeocodingSlot } from "./geocoding-rate-limit.js";

const searchCache = new Map();

export async function searchMapAddresses(query, { city, language = "ru", signal } = {}) {
  const address = query.trim().replace(/\s+/g, " ");
  if (!city || address.length < 3) return [];
  signal?.throwIfAborted();

  // A Nominatim-compatible service can be configured by the host application.
  const endpoint = globalThis.window?.APP_DATA?.geocoding_search_url
    || "https://nominatim.openstreetmap.org/search";
  const url = new URL(endpoint, globalThis.location?.href);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", `${address}, ${city}`);
  url.searchParams.set("countrycodes", "kz");
  url.searchParams.set("limit", "6");
  url.searchParams.set("accept-language", language === "kz" ? "kk" : language);
  const cacheKey = url.toString();

  if (searchCache.has(cacheKey)) return searchCache.get(cacheKey);
  await waitForGeocodingSlot(signal);
  signal?.throwIfAborted();

  const response = await fetch(cacheKey, { signal });
  if (!response.ok) throw new Error("Address search failed");
  const data = await response.json();
  signal?.throwIfAborted();
  if (!Array.isArray(data)) throw new Error("Invalid address search response");

  const results = data.flatMap((item) => {
    if (!item) return [];
    const lat = Number.parseFloat(item.lat);
    const lon = Number.parseFloat(item.lon);
    if (typeof item.display_name !== "string" || !item.display_name.trim()
      || !Number.isFinite(lat) || !Number.isFinite(lon)
      || Math.abs(lat) > 90 || Math.abs(lon) > 180) return [];

    return [{
      id: String(item.place_id ?? `${lat},${lon}`),
      label: item.display_name,
      center: [lat, lon],
      zoom: 17,
    }];
  });

  if (searchCache.size >= 50) searchCache.delete(searchCache.keys().next().value);
  searchCache.set(cacheKey, results);
  return results;
}
