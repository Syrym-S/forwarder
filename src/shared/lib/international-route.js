const kazakhstanNames = new Set([
  "kz",
  "kaz",
  "kazakhstan",
  "republic of kazakhstan",
  "казахстан",
  "республика казахстан",
  "қазақстан",
  "қазақстан республикасы",
]);

export function getRoutePointCountry(point) {
  // Older leads have the full geocoding address saved in the country field.
  // These addresses end with the country, sometimes followed by a postal code.
  const parts = String(point?.country ?? "")
    .split(",")
    .map((part) => part.trim().replace(/\s+/g, " "))
    .filter(Boolean);

  while (parts.length && /^[\d\s-]+$/.test(parts.at(-1))) {
    parts.pop();
  }

  return parts.at(-1) ?? "";
}

export function isInternationalRoute(form = {}) {
  const points = [
    form.from_location,
    ...(form.waypoints || []),
    form.to_location,
  ];

  return points.some((point) => {
    const country = getRoutePointCountry(point).toLowerCase();
    return country !== "" && !kazakhstanNames.has(country);
  });
}
