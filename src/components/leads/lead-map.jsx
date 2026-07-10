import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { isStaging } from "../../app/client";
import { CircularProgress } from "@mui/material";

const driverIcon = L.divIcon({
  className: "driver-marker",
  html: '<div class="driver-marker__icon">🚚</div>',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -18],
});

const fetchRoute = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  const coords = data.routes[0].geometry.coordinates;

  return coords.map(([lng, lat]) => [lat, lng]);
};

export default function LeadMap({ from, to, id }) {
  const start = !from?.lat ? [43.241141, 76.871399] : [from?.lat, from?.lon];
  const end = !to?.lat ? [43.241141, 76.871399] : [to?.lat, to?.lon];

  const [points, setPoints] = useState(null);
  const [route, setRoute] = useState([]);

  const [passedRoute, setPassedRoute] = useState([]);
  const [routeHistory, setRouteHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchRoute(start, end);
      setRoute(result);
    };

    load();
  }, []);

  useEffect(() => {
    async function connect() {
      const BASE_URL = isStaging
        ? "/staging/wp-json/geows/v1/token"
        : "/wp-json/geows/v1/token";

      const addRes = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line no-undef
          "X-WP-Nonce": GeoWS_Config.nonce,
        },
        body: JSON.stringify({
          lead_id: id,
          type: "add",
        }),
      }).then((r) => r.json());

      const wsAdd = new WebSocket(
        `wss://geo.360logistics.kz/socket?token=${addRes.token}`,
      );
      wsAdd.onopen = () => {
        console.log("add connected");
        wsAdd.send(
          JSON.stringify({
            point: { latitude: 43.238, longitude: 76.8829, altitude: 620 },
          }),
        );
      };

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // eslint-disable-next-line no-undef
          "X-WP-Nonce": GeoWS_Config.nonce,
        },
        body: JSON.stringify({
          lead_id: id,
          type: "admin",
        }),
      }).then((r) => r.json());

      const ws = new WebSocket(
        `wss://geo.360logistics.kz/socket?token=${res.token}`,
      );
      ws.onopen = () => {
        console.log("connected");
        ws.send("{}");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "get_points") {
          const lastPoint = message.data.at(-1);
          const history = message.data.map((point) => [
            point.latitude,
            point.longitude,
          ]);

          setRouteHistory(history);

          if (lastPoint) {
            const point = [lastPoint.latitude, lastPoint.longitude];

            setPoints([lastPoint.latitude, lastPoint.longitude]);

            setPassedRoute((prev) => [...prev, point]);
          }
        }
      };
    }

    connect();
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

      {(route.length > 0 || !from.lat || !from?.lon) && (
        <Polyline positions={route} color="blue" weight={4} />
      )}

      {passedRoute && (
        <Polyline
          positions={passedRoute}
          pathOptions={{
            color: "#1976d2",
            weight: 5,
            dashArray: "10 10",
          }}
        />
      )}

      {routeHistory && (
        <Polyline
          positions={routeHistory}
          pathOptions={{
            color: "#1976d2",
            weight: 5,
            dashArray: "10 10",
          }}
        />
      )}
      {points ? (
        <Marker position={points} icon={driverIcon} />
      ) : (
        <Marker icon={<CircularProgress />} />
      )}
    </MapContainer>
  );
}
