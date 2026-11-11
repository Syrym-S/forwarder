import polyline from "@mapbox/polyline";

const isPoint = (point) =>
  Array.isArray(point) &&
  point.length === 2 &&
  point.every(Number.isFinite) &&
  Math.abs(point[0]) <= 90 &&
  Math.abs(point[1]) <= 180;

export function normalizePlannedRoute(response) {
  const data = response?.data ?? response;
  const route = data?.routes?.[0] ?? data?.route ?? data;
  let coordinates;

  if (typeof route?.polyline?.encodedPolyline === "string") {
    coordinates = polyline.decode(route.polyline.encodedPolyline);
  } else if (route?.geometry?.type === "LineString") {
    coordinates = route.geometry.coordinates?.map(([lng, lat]) => [lat, lng]);
  }

  if (!coordinates || coordinates.length < 2 || !coordinates.every(isPoint)) {
    throw new Error("Routing service returned an invalid route");
  }

  const duration = route.duration;
  const seconds =
    typeof duration === "string" && /^\d+(?:\.\d+)?s$/.test(duration)
      ? Number(duration.slice(0, -1))
      : duration;

  return {
    coordinates,
    distance: route.distanceMeters ?? route.distance,
    duration: seconds,
  };
}
