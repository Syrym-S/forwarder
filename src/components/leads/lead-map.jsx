import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const fetchRoute = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  const coords = data.routes[0].geometry.coordinates;

  return coords.map(([lng, lat]) => [lat, lng]);
};

export default function LeadMap({ from, to }) {
  const start = [from.lat, from.lon];
  const end = [to.lat, to.lon];

  const [route, setRoute] = useState([]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchRoute(start, end);
      setRoute(result);
    };

    load();
  }, []);

  return (
    <MapContainer
      center={start}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

      <Marker position={start} />
      <Marker position={end} />

      {route.length > 0 && (
        <Polyline positions={route} color="blue" weight={4} />
      )}
    </MapContainer>
  );
}
