const STORAGE_KEY = "forwarder:osrm-routes:v2";
const MAX_ROUTES = 20;
const routes = new Map();
const pendingRequests = new Map();
let restored = false;

const isRoute = (route) =>
  Array.isArray(route) &&
  route.length > 0 &&
  route.every(
    (point) =>
      Array.isArray(point) &&
      point.length === 2 &&
      point.every(Number.isFinite),
  );

const restoreRoutes = () => {
  if (restored) return;
  restored = true;

  try {
    const entries = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(entries)) return;
    for (const entry of entries.slice(-MAX_ROUTES)) {
      if (
        Array.isArray(entry) &&
        typeof entry[0] === "string" &&
        isRoute(entry[1]?.coordinates)
      ) {
        routes.set(entry[0], entry[1]);
      }
    }
  } catch {
    // The in-memory cache still works when browser storage is unavailable.
  }
};

export const fetchCachedRouteDetails = async (coordinates) => {
  restoreRoutes();
  if (routes.has(coordinates)) return routes.get(coordinates);
  if (pendingRequests.has(coordinates)) return pendingRequests.get(coordinates);

  const request = (async () => {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`,
    );
    if (!response.ok) throw new Error("Не удалось загрузить маршрут");

    const data = await response.json();
    const geometry = data.routes?.[0]?.geometry?.coordinates;
    if (!isRoute(geometry)) throw new Error("Сервис не вернул маршрут");

    const route = {
      coordinates: geometry.map(([lng, lat]) => [lat, lng]),
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
    };
    routes.set(coordinates, route);
    if (routes.size > MAX_ROUTES) routes.delete(routes.keys().next().value);

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...routes]));
    } catch {
      // Keep the route in memory even if storage is full or disabled.
    }
    return route;
  })();

  pendingRequests.set(coordinates, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(coordinates);
  }
};

export const fetchCachedRoute = async (coordinates) => {
  const route = await fetchCachedRouteDetails(coordinates);
  return route.coordinates;
};
