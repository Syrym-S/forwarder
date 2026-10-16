import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import polyline from "@mapbox/polyline";
import { api, isStaging } from "../../app/client";
import { fetchCachedRoute } from "../../shared/helpers/route-cache";
import "./hide.css";
import { driverIcon } from "../../shared/ui/driver-marker-icon";
import DriverPositionPopup from "../../shared/ui/driver-position-popup";

window.Pusher = Pusher;

const createMarkerIcon = (label, subLabel) => {
  return L.divIcon({
    className: "custom-marker-wrapper",
    html: `
      <div class="map-marker">
        <div class="map-marker__circle">
          <div class="map-marker__content">
            ${label}

            ${
              subLabel
                ? `<div class="map-marker__sub-content">${subLabel}</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `,
    iconSize: [34, 48],
    iconAnchor: [17, 48],
  });
};

export default function LeadMap({ from, waypoints = [], to, id, leadData }) {
  const start = !from?.lat ? [43.241141, 76.871399] : [from?.lat, from?.lon];
  const cross = waypoints.map((waypoint) => [waypoint.lat, waypoint.lon]);
  const end = !to?.lat ? [43.241141, 76.871399] : [to?.lat, to?.lon];

  const routePoints = [start, ...cross, end];
  const coordinates = routePoints
    .map(([lat, lon]) => `${lon},${lat}`)
    .join(";");

  const [tracking, setTracking] = useState(null);
  const selectedTracking =
    tracking && String(tracking.leadId) === String(id) ? tracking : null;
  const [routeData, setRouteData] = useState(null);
  const route = routeData?.coordinates === coordinates ? routeData.points : [];


  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await fetchCachedRoute(coordinates);
        if (!cancelled) setRouteData({ coordinates, points: result });
      } catch (error) {
        if (!cancelled) console.error("Ошибка загрузки маршрута:", error);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [coordinates]);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    let isActive = true;
    let echo;

    async function connect() {
      try {
        const BASE_URL = isStaging
          ? "/staging/wp-json/geows/v1/token"
          : "/wp-json/geows/v1/token";

        const addRes = await fetch(BASE_URL, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": window.GeoWS_Config?.nonce,
          },
          body: JSON.stringify({
            lead_id: id,
            type: "read",
          }),
        }).then((r) => {
          if (!r.ok) throw new Error("Не удалось получить токен геотрекинга");
          return r.json();
        });

        if (!isActive) return;
        if (!addRes.token || !addRes.url) {
          throw new Error("Сервис не вернул токен или URL геотрекинга");
        }

        const response = await api.get(`${addRes.url}`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${addRes.token}`,
            key: window.GeoWS_Config?.key,
            ws: window.GeoWS_Config?.ws,
          },
        });

        if (!isActive) return;

        const {
          polyline: encodedPolyline,
          encoding,
          websocket,
        } = response.data.data;
        if (encodedPolyline && encoding !== "google") {
          throw new Error("Неподдерживаемая кодировка маршрута геотрекинга");
        }
        const coordinates = encodedPolyline
          ? polyline.decode(encodedPolyline)
          : [];
        const lastPoint = coordinates.at(-1);
        setTracking({
          leadId: id,
          coordinates,
          point: lastPoint
            ? { latitude: lastPoint[0], longitude: lastPoint[1] }
            : null,
        });

        const key =
          window.GeoWS_Config?.key ||
          import.meta.env.VITE_REVERB_APP_KEY ||
          "0094d41122b08a5e800dcd84c9a387d258e9e64ee67a61efa4718a7d28504816";
        if (!key) {
          throw new Error(
            "Задайте ключ Reverb в GeoWS_Config.key или VITE_REVERB_APP_KEY",
          );
        }
        if (
          !websocket?.channel ||
          !websocket.event ||
          !websocket.auth_endpoint
        ) {
          throw new Error("Сервис не вернул настройки подписки геотрекинга");
        }

        const wsAddress = window.GeoWS_Config?.ws ||
          (isStaging ? "geo.staging.360logistics.kz" : "geo.v2.360logistics.kz");
        const wsUrl = new URL(
          wsAddress.includes("://") ? wsAddress : `wss://${wsAddress}`,
        );

        echo = new Echo({
          broadcaster: "reverb",
          key,
          wsHost: wsUrl.hostname,
          wssPort: Number(wsUrl.port) || 443,
          forceTLS: true,
          enabledTransports: ["ws", "wss"],
          authEndpoint: websocket.auth_endpoint,
          auth: { headers: { Authorization: `Bearer ${addRes.token}` } },
        });

        echo
          .private(websocket.channel)
          .listen(`.${websocket.event}`, (message) => {
            if (!isActive) return;
            const coords = message?.data?.coords;
            if (coords?.lat == null || coords?.lon == null) return;
            const latitude = Number(coords.lat);
            const longitude = Number(coords.lon);
            if (
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude) ||
              Math.abs(latitude) > 90 ||
              Math.abs(longitude) > 180
            )
              return;

            setTracking((prev) => {
              const history = prev?.coordinates || [];
              const last = history.at(-1);
              const duplicate =
                last?.[0] === latitude && last?.[1] === longitude;
              return {
                leadId: id,
                coordinates: duplicate
                  ? history
                  : [...history, [latitude, longitude]],
                point: { ...message.data, ...coords, latitude, longitude },
              };
            });
          })
          .error((error) => {
            if (isActive)
              console.error("Не удалось подписаться на геотрекинг", error);
          });
      } catch (error) {
        if (isActive) console.error("Не удалось подключить геотрекинг", error);
      }
    }

    connect();

    return () => {
      isActive = false;
      controller.abort();
      echo?.disconnect();
    };
  }, [id]);

  return (
    <MapContainer
      center={start}
      zoom={13}
      style={{ height: "300px", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_33bl_1_e67a46f1e67e6cbad8143c4e"
      />

      <Marker position={start} icon={createMarkerIcon("A")} />

      {waypoints.map((waypoint, index) => (
        <Marker
          position={[waypoint.lat, waypoint.lon]}
          icon={createMarkerIcon(`P#${index + 1}`)}
        />
      ))}

      <Marker position={end} icon={createMarkerIcon("B")} />

      {route.length > 0 && (
        <Polyline positions={route} color="blue" weight={4} />
      )}

      {selectedTracking?.coordinates.length > 0 && (
        <Polyline
          positions={selectedTracking.coordinates}
          pathOptions={{ color: "#1976d2", weight: 5, dashArray: "10 10" }}
        />
      )}

      {selectedTracking?.point && (
        <Marker
          position={[
            selectedTracking.point.latitude,
            selectedTracking.point.longitude,
          ]}
          icon={driverIcon}
        >
          <DriverPositionPopup leadData={leadData} point={selectedTracking.point} />
        </Marker>
      )}
    </MapContainer>
  );
}
