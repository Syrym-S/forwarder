import React, { useState, useEffect, useMemo, Fragment } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Box, Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import L from "leaflet";
import { isStaging } from "../../app/client";

const driverIcon = L.divIcon({
  className: "driver-marker",
  html: '<div class="driver-marker__icon">🚚</div>',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -18],
});

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

const getRoute = async (start, end) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
    );

    const data = await response.json();

    if (!data.routes?.length) {
      return null;
    }

    return {
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
      coordinates: data.routes[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]),
    };
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

const MapTooltip = ({ route }) => {
  return (
    <Tooltip sticky>
      <Box sx={{ minWidth: 200 }}>
        <Box sx={{ mb: 0.75 }}>
          <Typography
            component="span"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Откуда:
          </Typography>{" "}
          <Typography
            component="span"
            sx={{
              fontSize: "0.75rem",
            }}
          >
            {route.from}
          </Typography>
        </Box>

        <Box sx={{ mb: 0.75 }}>
          <Typography
            component="span"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Куда:
          </Typography>{" "}
          <Typography
            component="span"
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
  const storeLeads = useLeadsStore((state) => state.leads);

  const leads = leadsProp || storeLeads;

  const [routes, setRoutes] = useState([]);

  const [points, setPoints] = useState(null);

  const [passedRoute, setPassedRoute] = useState([]);
  const [routeHistory, setRouteHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadRoutes = async () => {
      const result = await Promise.all(
        leads.filter(hasRouteLocations).map(async (lead) => {
          const route = await getRoute(
            getLocationPoint(lead.from_location),
            getLocationPoint(lead.to_location),
          );

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
    async function connect() {
      const BASE_URL = isStaging
        ? "/staging/wp-json/geows/v1/token"
        : "/wp-json/geows/v1/token";

      const addRes = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": window.GeoWS_Config?.nonce,
        },
        body: JSON.stringify({
          lead_id: selectedLeadId,
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
          "X-WP-Nonce": window.GeoWS_Config?.nonce,
        },
        body: JSON.stringify({
          lead_id: selectedLeadId,
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

    if (selectedLeadId) {
      connect();
    }
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
    <MapContainer
      center={[43.238949, 76.889709]}
      zoom={13}
      style={{
        zIndex: 0,
        borderRadius: "10px",
        height: "500px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <FitSelectedRouteBounds route={selectedRoute} />

      {routes.map((route) => {
        const isHighlighted = String(route.id) === String(highlightedLeadId);
        const isDimmed = hasHighlightedRoute && !isHighlighted;

        return (
          <Fragment key={route.id}>
            <Marker
              position={route.start}
              opacity={isDimmed ? 0.3 : 1}
              eventHandlers={{
                click: () => onSelectLead?.(route.id),
              }}
            />

            <Marker
              position={route.end}
              opacity={isDimmed ? 0.3 : 1}
              eventHandlers={{
                click: () => onSelectLead?.(route.id),
              }}
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
              <MapTooltip route={route} />
            </Polyline>

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
            {points && <Marker position={points} icon={driverIcon} />}
          </Fragment>
        );
      })}
    </MapContainer>
  );
};

export default Map;
