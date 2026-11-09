export function getRouteAddressFields(point, location = {}) {
  const isWaypoint = /^cross\.\d+$/.test(point);
  if (point !== "from" && point !== "to" && !isWaypoint) return [];
  const path = isWaypoint ? `waypoints[${Number(point.split(".")[1])}]` : `${point}_location`;
  // Write individual properties so waypoint type and schedule fields are preserved.
  const updates = ["city", "country", "region", "lat", "lng", "lon"]
    .map((key) => [`${path}.${key}`, location[key] ?? ""]);
  if (location.address !== undefined) updates.unshift([`${path}.address`, location.address]);
  if (!isWaypoint) {
    updates.push([`${point}Lat`, location.lat ?? ""], [`${point}Lng`, location.lng ?? location.lon ?? ""]);
  }
  return updates;
}
