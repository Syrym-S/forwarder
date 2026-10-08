import L from "leaflet";

export const driverIcon = L.divIcon({
  className: "driver-marker",
  html: `<div class="driver-marker__icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
      <path d="M20 8h-3V4H3C1.9 4 1 4.9 1 6v11h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5l-3-4ZM6 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM19.5 9.5l1.96 2.5H17V9.5h2.5ZM18 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    </svg>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -18],
});
