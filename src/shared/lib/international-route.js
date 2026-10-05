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

export function isInternationalRoute(form = {}) {
  const points = [
    form.from_location,
    ...(form.waypoints || []),
    form.to_locatoni,
  ];

  return points.some((point) => {
    const country = String(point?.country ?? "")
      .trim()
      .toLowerCase();
    return country !== "" && !kazakhstanNames.has(country);
  });
}
