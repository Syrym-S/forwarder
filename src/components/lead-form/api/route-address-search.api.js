import { waitForGeocodingSlot } from "./geocoding-rate-limit.js";

const cache = new Map();
const defaultEndpoint = "https://photon.komoot.io/api/";

export function normalizeRouteAddress(feature) {
  const properties = feature?.properties;
  const coordinates = feature?.geometry?.coordinates;
  if (
    !properties ||
    feature.geometry?.type !== "Point" ||
    !Array.isArray(coordinates)
  )
    return null;
  const [lon, lat] = coordinates;
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  )
    return null;

  const city =
    properties.city ||
    properties.town ||
    properties.village ||
    properties.municipality ||
    (properties.type === "city" || properties.osm_value === "city"
      ? properties.name
      : "") ||
    properties.county ||
    "";
  const street = [properties.street, properties.housenumber]
    .filter(Boolean)
    .join(" ");
  const parts = [
    properties.name,
    street,
    properties.district,
    city,
    properties.state,
    properties.country,
  ]
    .filter((part) => typeof part === "string" && part.trim())
    .map((part) => part.trim());
  const label = [...new Set(parts)].join(", ");
  if (!label) return null;

  return {
    id: `${properties.osm_type || "place"}.${properties.osm_id ?? `${lat},${lon}`}`,
    label,
    center: [lat, lon],
    zoom: street && properties.housenumber ? 17 : 15,
    location: {
      address: label,
      city,
      country: properties.country || properties.countrycode || "",
      region:
        properties.state || properties.county || properties.district || "",
      lat,
      lng: lon,
      lon,
    },
  };
}

export async function searchRouteAddresses(
  query,
  { center, language = "ru", signal } = {},
) {
  const text = String(query || "")
    .trim()
    .replace(/\s+/g, " ");
  signal?.throwIfAborted();
  if (text.length < 3) return [];

  // Public Nominatim does not permit autocomplete. Use a Photon-compatible endpoint.
  const endpoint =
    globalThis.window?.APP_DATA?.geocoding_autocomplete_url || defaultEndpoint;
  const url = new URL(endpoint, globalThis.location?.href);
  url.searchParams.set("q", text);
  url.searchParams.set("limit", "6");
  // The public Photon instance provides these translations and local OSM names.
  const lang = String(language).split("-")[0];
  url.searchParams.set(
    "lang",
    ["en", "de", "fr"].includes(lang) ? lang : "default",
  );
  if (
    Array.isArray(center) &&
    center.length === 2 &&
    center.every(Number.isFinite)
  ) {
    url.searchParams.set("lat", center[0]);
    url.searchParams.set("lon", center[1]);
  }
  const key = url.href;
  if (cache.has(key)) return cache.get(key);

  await waitForGeocodingSlot(signal);
  signal?.throwIfAborted();
  const response = await fetch(key, { signal });
  if (!response.ok) throw new Error("Address suggestions failed");
  const data = await response.json();
  signal?.throwIfAborted();
  if (!Array.isArray(data?.features))
    throw new Error("Invalid address suggestions");
  const addresses = data.features.map(normalizeRouteAddress).filter(Boolean);
  const results = [
    ...new Map(addresses.map((address) => [address.id, address])).values(),
  ];
  if (cache.size >= 100) cache.delete(cache.keys().next().value);
  cache.set(key, results);
  return results;
}
