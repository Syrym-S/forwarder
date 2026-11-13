import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import polyline from "@mapbox/polyline";
import { api, isStaging } from "../../app/client";
import { generateLeadRoute } from "../../shared/api/routing";
import "./hide.css";
import { createDriverIcon } from "../../shared/ui/driver-marker-icon";
import DriverPositionPopup from "../../shared/ui/driver-position-popup";
import { loadLeadTracking } from "../../shared/lib/lead-tracking";
import { getDriverMarkerDirection, getNextLeadRoutePoint } from "../../shared/lib/lead-driver-direction";
import { Tab, Tabs } from "@mui/material";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import RouteIcon from "@mui/icons-material/Route";
import TimelineIcon from "@mui/icons-material/Timeline";
import ActionTooltip from "../../shared/ui/action-tooltip";

window.Pusher = Pusher;

const MapViewOptions = {
  both: "both",
  full_route: "full_route",
  passed_way: "passed_way",
};

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

const getLocationPoint = (location) => {
  const lat = location?.lat ?? location?.latitude;
  const lon = location?.lon ?? location?.lng ?? location?.longitude;
  if (
    [lat, lon].some(
      (value) =>
        value == null ||
        (typeof value !== "number" && typeof value !== "string") ||
        String(value).trim() === "",
    )
  )
    return null;
  const point = [Number(lat), Number(lon)];
  return point.every(Number.isFinite) &&
    Math.abs(point[0]) <= 90 &&
    Math.abs(point[1]) <= 180
    ? point
    : null;
};

const FitLeadMapBounds = ({ points }) => {
  const map = useMap();
  const boundsKey = JSON.stringify(points);
  useEffect(() => {
    const locations = JSON.parse(boundsKey);
    if (locations.length > 1)
      map.fitBounds(locations, { padding: [24, 24], maxZoom: 13 });
    else if (locations.length === 1) map.setView(locations[0], 13);
  }, [map, boundsKey]);
  return null;
};

export default function LeadMap({
  from,
  waypoints,
  to,
  id,
  leadData,
  routeCoordinates,
  fallbackRoutes,
}) {
  const leadId = id ?? leadData?.id;
  const [activeMapTab, setActiveMapTab] = useState(MapViewOptions.both);
  const trackingToken = leadData?.tracking?.token;
  const trackingUrl = leadData?.tracking?.url;
  const start =
    getLocationPoint(from) ||
    getLocationPoint(leadData?.from_location) ||
    getLocationPoint({ lat: leadData?.from_lat, lon: leadData?.from_lon });
  const end =
    getLocationPoint(to) ||
    getLocationPoint(leadData?.to_location) ||
    getLocationPoint({ lat: leadData?.to_lat, lon: leadData?.to_lon });
  const routeWaypoints = (waypoints ?? leadData?.waypoints ?? [])
    .map((waypoint, index) => ({ point: getLocationPoint(waypoint), index }))
    .filter(({ point }) => point);
  const cross = routeWaypoints.map(({ point }) => point);

  const routePoints = [start, ...cross, end].filter(Boolean);
  const coordinates = routePoints
    .map(([lat, lon]) => `${lon},${lat}`)
    .join(";");

  const [tracking, setTracking] = useState(null);
  const selectedTracking =
    tracking && String(tracking.leadId) === String(leadId) ? tracking : null;
  const driverDirection = getDriverMarkerDirection(
    getLocationPoint(selectedTracking?.point),
    getLocationPoint(getNextLeadRoutePoint(leadData)),
  );
  const driverIcon = useMemo(
    () => createDriverIcon(undefined, driverDirection),
    [driverDirection],
  );
  const [routeData, setRouteData] = useState(null);
  const hasProvidedRoute = routeCoordinates !== undefined;
  const route =
    hasProvidedRoute
      ? routeCoordinates ?? []
      : routeData?.coordinates === coordinates && routeData?.leadId === leadId
        ? routeData.points
        : [];
  const showFullRoute =
    activeMapTab === MapViewOptions.both ||
    activeMapTab === MapViewOptions.full_route;
  const showPassedRoute =
    activeMapTab === MapViewOptions.both ||
    activeMapTab === MapViewOptions.passed_way;

  const handleRouteViewChange = (_, value) => {
    setActiveMapTab(value);
  };

  useEffect(() => {
    if (hasProvidedRoute || !leadId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const result = await generateLeadRoute(leadId, { fallbackRoutes });
        if (!cancelled) {
          setRouteData({ leadId, coordinates, points: result.coordinates });
        }
      } catch (error) {
        if (!cancelled) console.error("Ошибка загрузки маршрута:", error);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [coordinates, leadId, hasProvidedRoute, fallbackRoutes]);

  useEffect(() => {
    if (!leadId && !(trackingToken && trackingUrl)) return;

    const controller = new AbortController();
    let isActive = true;
    let echo;

    async function connect() {
      try {
        const BASE_URL = isStaging
          ? "/staging/wp-json/geows/v1/token"
          : "/wp-json/geows/v1/token";

        const { access: addRes, response } = await loadLeadTracking({
          tracking: { token: trackingToken, url: trackingUrl },
          signal: controller.signal,
          requestToken: async () => {
            if (!leadId) throw new Error("Не указан ID лида для геотрекинга");
            const result = await fetch(BASE_URL, {
              method: "POST",
              signal: controller.signal,
              headers: {
                "Content-Type": "application/json",
                "X-WP-Nonce": window.GeoWS_Config?.nonce,
              },
              body: JSON.stringify({ lead_id: leadId, type: "read" }),
            });
            if (!result.ok)
              throw new Error("Не удалось получить токен геотрекинга");
            return result.json();
          },
          requestTracking: async (access) => {
            const result = await api.get(access.url, {
              signal: controller.signal,
              headers: {
                Authorization: `Bearer ${access.token}`,
                key: window.GeoWS_Config?.key,
                ws: window.GeoWS_Config?.ws,
              },
            });
            if (!result.data?.data || typeof result.data.data !== "object") {
              throw new Error("Сервис не вернул данные геотрекинга");
            }
            return result;
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
        if (
          coordinates.some(
            ([latitude, longitude]) =>
              !getLocationPoint({ latitude, longitude }),
          )
        ) {
          throw new Error("Сервис вернул неверные координаты геотрекинга");
        }
        const lastPoint = coordinates.at(-1);
        setTracking({
          leadId,
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

        const wsAddress =
          window.GeoWS_Config?.ws ||
          (isStaging
            ? "geo.staging.360logistics.kz"
            : "geo.v2.360logistics.kz");
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
                leadId,
                coordinates: duplicate
                  ? history
                  : [...history, [latitude, longitude]],
                point: { ...message.data, ...coords, latitude, longitude },
              };
            });
          })
          .error((error) => {
            if (isActive) {
              setTracking(null);
              console.error(
                "Не удалось подписаться на геотрекинг",
                error?.message,
              );
            }
          });
      } catch (error) {
        if (isActive) {
          setTracking(null);
          echo?.disconnect();
          console.error("Не удалось подключить геотрекинг", error.message);
        }
      }
    }

    connect();

    return () => {
      isActive = false;
      controller.abort();
      echo?.disconnect();
    };
  }, [leadId, trackingToken, trackingUrl]);

  return (
    <MapContainer
      center={routePoints[0] || [43.241141, 76.871399]}
      zoom={13}
      style={{ height: "400px", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_33bl_1_e67a46f1e67e6cbad8143c4e"
      />

      <Tabs
        value={activeMapTab}
        onChange={handleRouteViewChange}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1000,
          minHeight: 36,
          bgcolor: "background.paper",
          borderRadius: 10,
          boxShadow: 2,
          "& .MuiTab-root": { minWidth: 44, minHeight: 36, p: 1 },
          "& .MuiTab-root.Mui-selected": {
            color: "primary.main",
            bgcolor: "background.main",
          },
        }}
      >
        <Tab
          value={MapViewOptions.both}
          aria-label="Весь и пройденный путь"
          icon={
            <ActionTooltip title="Весь и пройденный путь">
              <AltRouteIcon />
            </ActionTooltip>
          }
        />
        <Tab
          value={MapViewOptions.full_route}
          aria-label="Весь путь"
          icon={
            <ActionTooltip title="Весь путь">
              <TimelineIcon />
            </ActionTooltip>
          }
        />
        <Tab
          value={MapViewOptions.passed_way}
          aria-label="Пройденный путь"
          icon={
            <ActionTooltip title="Пройденный путь">
              <RouteIcon />
            </ActionTooltip>
          }
        />
      </Tabs>

      <FitLeadMapBounds
        points={[
          ...(showFullRoute ? (route.length > 0 ? route : routePoints) : []),
          ...(showPassedRoute ? selectedTracking?.coordinates || [] : []),
        ]}
      />
      {showFullRoute && start && (
        <Marker position={start} icon={createMarkerIcon("A")} />
      )}
      {showFullRoute &&
        routeWaypoints.map(({ point, index }) => (
          <Marker
            key={index}
            position={point}
            icon={createMarkerIcon(`P#${index + 1}`)}
          />
        ))}
      {showFullRoute && end && (
        <Marker position={end} icon={createMarkerIcon("B")} />
      )}
      {showFullRoute && route.length >= 2 && (
        <Polyline positions={route} color="blue" weight={4} />
      )}
      {showPassedRoute && selectedTracking?.coordinates.length > 0 && (
        <Polyline
          positions={selectedTracking.coordinates}
          pathOptions={{ color: "#1976d2", weight: 5, dashArray: "10 10" }}
        />
      )}
      {showPassedRoute && selectedTracking?.point && (
        <Marker
          position={[
            selectedTracking.point.latitude,
            selectedTracking.point.longitude,
          ]}
          icon={driverIcon}
        >
          <DriverPositionPopup
            leadData={leadData}
            point={selectedTracking.point}
          />
        </Marker>
      )}
    </MapContainer>
  );
}
