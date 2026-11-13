export function getNextLeadRoutePoint(lead) {
  return [
    lead?.from_location && { ...lead.from_location, label: "A" },
    ...(lead?.waypoints || []).map((point, index) => ({
      ...point,
      label: `P#${index + 1}`,
    })),
    lead?.to_location && { ...lead.to_location, label: "B" },
  ].find((point) => point && !point.is_passed);
}

function isValidPoint(point) {
  return Array.isArray(point) && point.length === 2 &&
    point.every(Number.isFinite) &&
    Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180;
}

export function getDriverMarkerDirection(position, target) {
  if (!isValidPoint(position) || !isValidPoint(target)) return "right";

  return target[1] < position[1] ? "left" : "right";
}
