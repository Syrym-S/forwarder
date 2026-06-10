export function cleanAddress(str) {
  if (!str) return "";

  const parts = str.split(",");

  const unique = [...new Set(parts.map((p) => p.trim()))];

  return unique.join(", ");
}
