import { useState, useEffect, useMemo, Fragment } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Box, CircularProgress, Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import L from "leaflet";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import polyline from "@mapbox/polyline";
import { api, isStaging } from "../../app/client";
import { fetchCachedRouteDetails } from "../../shared/helpers/route-cache";
import "./marker.style.css";
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

const getLocationLatitude = (location) => {
  return location?.lat ?? location?.latitude;
};

const getLocationLongitude = (location) => {
  return location?.lon ?? location?.lng ?? location?.longitude;
};

const isValidCoordinate = (value) => {
  return Number.isFinite(Number(value));
};

const hasRouteLocations = (lead) => {
  const fromLat = getLocationLatitude(lead?.from_location);
  const fromLng = getLocationLongitude(lead?.from_location);
  const toLat = getLocationLatitude(lead?.to_location);
  const toLng = getLocationLongitude(lead?.to_location);

  return (
    isValidCoordinate(fromLat) &&
    isValidCoordinate(fromLng) &&
    isValidCoordinate(toLat) &&
    isValidCoordinate(toLng)
  );
};

const getLocationPoint = (location) => {
  return [
    Number(getLocationLatitude(location)),
    Number(getLocationLongitude(location)),
  ];
};

const getLocationAddress = (location) => {
  return location?.address || "Адрес не указан";
};

const getRoute = async (points) => {
  try {
    const coordinates = points.map(([lat, lon]) => `${lon},${lat}`).join(";");

    return await fetchCachedRouteDetails(coordinates);
  } catch (error) {
    console.error("Failed to load route", error);
    return null;
  }
};

const formatDistance = (distance) => {
  if (!Number.isFinite(Number(distance))) {
    return "—";
  }

  return `${Math.round(Number(distance) / 1000)} км`;
};

const formatDuration = (duration) => {
  if (!Number.isFinite(Number(duration))) {
    return "—";
  }

  return `${Math.round(Number(duration) / 60)} мин`;
};

const MapTooltip = ({ route, open, setOpen }) => {
  return (
    <Tooltip
      sticky
      open={open}
      onClose={() => setOpen(false)}
      disableHoverListener
      disableFocusListener
      disableTouchListener
    >
      <Box sx={{ maxWidth: 350, width: 200 }}>
        <Box
          sx={{ mb: 0.75, display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Откуда:
          </Typography>{" "}
          <Typography
            sx={{
              fontSize: "0.75rem",
            }}
          >
            {route.from}
          </Typography>
        </Box>

        <Box
          sx={{ mb: 0.75, display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Куда:
          </Typography>{" "}
          <Typography
            sx={{
              fontSize: "0.75rem",
            }}
          >
            {route.to}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: "0.75rem" }}>
          Дистанция: {formatDistance(route.distance)}
        </Typography>

        <Typography sx={{ fontSize: "0.75rem" }}>
          Длительность: {formatDuration(route.duration)}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const FitSelectedRouteBounds = ({ route }) => {
  const map = useMap();

  useEffect(() => {
    if (!route?.coordinates?.length) {
      return;
    }

    map.fitBounds(route.coordinates, {
      padding: [40, 40],
      maxZoom: 13,
    });
  }, [map, route]);

  return null;
};

const Map = ({
  leads: leadsProp,
  selectedLeadId,
  highlightedLeadId,
  onSelectLead,
}) => {
  const isLoading = useLeadsStore((state) => state.isLoading);
  const storeLeads = useLeadsStore((state) => state.leads);

  const leads = leadsProp || storeLeads;

  const [routes, setRoutes] = useState([]);
  const [open, setOpen] = useState(false);
  const [tracking, setTracking] = useState(null);
  const selectedTracking =
    tracking && String(tracking.leadId) === String(selectedLeadId)
      ? tracking
      : null;
  const trackedLead = leads.find(
    (lead) => String(lead.id) === String(selectedLeadId),
  );

  useEffect(() => {
    let isMounted = true;

    const loadRoutes = async () => {
      const result = await Promise.all(
        leads.filter(hasRouteLocations).map(async (lead) => {
          const cross = lead.waypoints.map((waypoint) =>
            getLocationPoint(waypoint),
          );

          const route = await getRoute([
            getLocationPoint(lead.from_location),
            ...cross,
            getLocationPoint(lead.to_location),
          ]);

          if (!route) {
            return null;
          }

          return {
            id: lead.id,
            lead,
            start: route.coordinates[0],
            end: route.coordinates[route.coordinates.length - 1],
            coordinates: route.coordinates,
            distance: route.distance,
            duration: route.duration,
            from: getLocationAddress(lead.from_location),
            to: getLocationAddress(lead.to_location),
          };
        }),
      );

      if (isMounted) {
        setRoutes(result.filter(Boolean));
      }
    };

    loadRoutes();

    return () => {
      isMounted = false;
    };
  }, [leads]);

  useEffect(() => {
    if (!selectedLeadId) return;

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
            lead_id: selectedLeadId,
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
            wsHost: window.GeoWS_Config?.ws,
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
          leadId: selectedLeadId,
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
                leadId: selectedLeadId,
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
  }, [selectedLeadId]);

  const selectedRoute = useMemo(() => {
    if (!selectedLeadId) {
      return null;
    }

    return routes.find((route) => String(route.id) === String(selectedLeadId));
  }, [routes, selectedLeadId]);

  const hasHighlightedRoute = useMemo(() => {
    if (!highlightedLeadId) {
      return false;
    }

    return routes.some(
      (route) => String(route.id) === String(highlightedLeadId),
    );
  }, [routes, highlightedLeadId]);

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CircularProgress />
            <Typography
              sx={{
                fontWeight: 200,
                fontSize: "0.7rem",
              }}
            >
              Загрузка карты...
            </Typography>
          </Box>
        </Box>
      )}
      <MapContainer
        attributionControl={false}
        center={[43.238949, 76.889709]}
        zoom={13}
        style={{
          zIndex: 0,
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_33bl_1_e67a46f1e67e6cbad8143c4e"
        />

        <FitSelectedRouteBounds route={selectedRoute} />

        {routes.map((route) => {
          const isHighlighted = String(route.id) === String(highlightedLeadId);
          const isDimmed = hasHighlightedRoute && !isHighlighted;

          return (
            <Fragment key={route.id}>
              <Marker
                key={`from-${route.id}`}
                position={route.start}
                icon={createMarkerIcon("A", `#${route.lead.num}`)}
                opacity={isDimmed ? 0.3 : 1}
                eventHandlers={{
                  click: () => onSelectLead?.(route.id),
                }}
              />
              {route.lead.waypoints.map((waypoint, index) => {
                return (
                  <Marker
                    position={[waypoint.lat, waypoint.lon]}
                    icon={createMarkerIcon(
                      `P#${index + 1}`,
                      `#${route.lead.num}`,
                    )}
                  />
                );
              })}
              <Marker
                position={route.end}
                opacity={isDimmed ? 0.3 : 1}
                eventHandlers={{
                  click: () => onSelectLead?.(route.id),
                }}
                icon={createMarkerIcon("B", `#${route.lead.num}`)}
              />
              <Polyline
                positions={route.coordinates}
                pathOptions={{
                  color: "blue",
                  weight: isHighlighted ? 7 : 4,
                  opacity: isDimmed ? 0.15 : 0.95,
                }}
                eventHandlers={{
                  click: () => onSelectLead?.(route.id),
                }}
              >
                <MapTooltip route={route} open={open} setOpen={setOpen} />
              </Polyline>
            </Fragment>
          );
        })}
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
            <DriverPositionPopup
              leadData={trackedLead}
              point={selectedTracking.point}
            />
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default Map;
