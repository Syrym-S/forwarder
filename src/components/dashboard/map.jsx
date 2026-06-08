import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import polyline from "@mapbox/polyline";
import { Typography } from "@mui/material";

import "leaflet/dist/leaflet.css";
import { route } from "../../shared/const/mock-coordinates";

const MapTooltip = () => {
  return (
    <Tooltip sticky>
      <Typography>{route.description}</Typography>
      <Typography>{Math.round(route.distanceMeters / 1000)} км</Typography>
      <Typography>
        {Math.round(Number(route.duration.replace("s", "")) / 60)} мин
      </Typography>
    </Tooltip>
  );
};

const createMockRoutes = (baseCoordinates, count = 10) => {
  return Array.from({ length: count }, (_, index) => {
    const startOffsetLat =
      (Math.random() - Math.floor(Math.random() * 10) + 1) * 1;
    const startOffsetLng =
      (Math.random() - Math.floor(Math.random() * 10) + 1) * 1;

    const endOffsetLat =
      (Math.random() - Math.floor(Math.random() * 10) + 1) * 1;
    const endOffsetLng =
      (Math.random() - Math.floor(Math.random() * 10) + 1) * 1;

    const start = [
      baseCoordinates[0][0] + startOffsetLat,
      baseCoordinates[0][1] + startOffsetLng,
    ];

    const end = [
      baseCoordinates[baseCoordinates.length - 1][0] + endOffsetLat,
      baseCoordinates[baseCoordinates.length - 1][1] + endOffsetLng,
    ];

    const coordinates = baseCoordinates.map(([lat, lng], pointIndex) => {
      const progress = pointIndex / (baseCoordinates.length - 1);

      return [
        lat + startOffsetLat * (1 - progress) + endOffsetLat * progress,
        lng + startOffsetLng * (1 - progress) + endOffsetLng * progress,
      ];
    });

    coordinates[0] = start;
    coordinates[coordinates.length - 1] = end;

    return {
      start,
      end,
      coordinates,
    };
  });
};

const colors = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
  "#0288d1",
  "#7b1fa2",
  "#388e3c",
  "#f57c00",
  "#455a64",
];

const Map = () => {
  const coordinates = polyline.decode(route.polyline.encodedPolyline);

  const routes = createMockRoutes(coordinates, 10);

  return (
    <MapContainer
      center={coordinates[0]}
      zoom={5}
      scrollWheelZoom={false}
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

      {routes.map((route, index) => (
        <React.Fragment key={index}>
          <Marker position={route.start} />
          <Marker position={route.end} />

          <Polyline
            positions={route.coordinates}
            pathOptions={{
              color: colors[index],
              weight: 4,
            }}
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default Map;
