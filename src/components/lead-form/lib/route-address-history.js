export const ROUTE_ADDRESS_HISTORY_KEY = "forwarder.route-address-history.v1";
export const ROUTE_ADDRESS_HISTORY_EVENT = "forwarder:route-address-history";
export const ROUTE_ADDRESS_HISTORY_TTL = 10 * 60 * 1000;
const HISTORY_LIMIT = 10;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function getRouteAddressKey(location) {
  const lat = location?.lat;
  const lon = Number.isFinite(location?.lng) ? location.lng : location?.lon;
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  ) {
    return null;
  }
  return `${lat.toFixed(6)},${lon.toFixed(6)}`;
}

function createEntry(location, zoom, expiresAt) {
  const key = getRouteAddressKey(location);
  const label =
    typeof location?.address === "string" ? location.address.trim() : "";
  if (!key || !label) return null;
  const lat = location.lat;
  const lon = Number.isFinite(location.lng) ? location.lng : location.lon;
  const text = (value) => (typeof value === "string" ? value.trim() : "");

  return {
    id: `history.${key}`,
    label,
    center: [lat, lon],
    zoom: Number.isFinite(zoom) && zoom >= 1 && zoom <= 20 ? zoom : 17,
    location: {
      address: label,
      city: text(location.city),
      country: text(location.country),
      region: text(location.region),
      lat,
      lng: lon,
      lon,
    },
    expiresAt,
  };
}

function persist(storage, entries) {
  try {
    if (!storage) return false;
    if (entries.length)
      storage.setItem(ROUTE_ADDRESS_HISTORY_KEY, JSON.stringify(entries));
    else storage.removeItem(ROUTE_ADDRESS_HISTORY_KEY);
    return true;
  } catch {
    // Address selection must still work when browser storage is unavailable or full.
    return false;
  }
}

export function readRouteAddressHistory({
  storage = getStorage(),
  now = Date.now(),
} = {}) {
  let raw;
  let saved;
  try {
    raw = storage?.getItem(ROUTE_ADDRESS_HISTORY_KEY);
    saved = JSON.parse(raw || "[]");
  } catch {
    persist(storage, []);
    return [];
  }

  const entries = (Array.isArray(saved) ? saved : [])
    .filter(
      (entry) => Number.isFinite(entry?.expiresAt) && entry.expiresAt > now,
    )
    .map((entry) => createEntry(entry.location, entry.zoom, entry.expiresAt))
    .filter(Boolean)
    .sort((first, second) => second.expiresAt - first.expiresAt)
    .filter(
      (entry, index, all) =>
        all.findIndex((other) => other.id === entry.id) === index,
    )
    .slice(0, HISTORY_LIMIT);

  if (raw && raw !== JSON.stringify(entries)) persist(storage, entries);
  return entries;
}

export function rememberRouteAddress(
  location,
  { storage = getStorage(), now = Date.now(), zoom = 17 } = {},
) {
  const entry = createEntry(location, zoom, now + ROUTE_ADDRESS_HISTORY_TTL);
  if (!entry) return false;
  const history = readRouteAddressHistory({ storage, now });
  const entries = [
    entry,
    ...history.filter((previous) => previous.id !== entry.id),
  ].slice(0, HISTORY_LIMIT);
  if (!persist(storage, entries)) return false;
  globalThis.window?.dispatchEvent(new Event(ROUTE_ADDRESS_HISTORY_EVENT));
  return true;
}

export function getRouteAddressOptions(
  history,
  suggestions,
  query,
  now = Date.now(),
) {
  const terms = String(query || "")
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const recent = history
    .filter(
      (entry) =>
        entry.expiresAt > now &&
        terms.every((term) => entry.label.toLocaleLowerCase().includes(term)),
    )
    .map((entry) => ({ ...entry, fromHistory: true }));
  const points = new Set(
    recent.map((entry) => getRouteAddressKey(entry.location)),
  );
  return [
    ...recent,
    ...suggestions.filter(
      (entry) => !points.has(getRouteAddressKey(entry.location)),
    ),
  ];
}
