export async function getCoords(address) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
  );

  const data = await res.json();

  if (data.length === 0) return null;

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
  };
}
