import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import polyline from "@mapbox/polyline";

import "leaflet/dist/leaflet.css";
import { route } from "../../shared/const/mock-coordinates";
import { Typography } from "@mui/material";

const MapTooltip = () => {
  return (
    <Tooltip sticky>
      <Typography>{route.description}</Typography>
      <Typography>{Math.round(route.distanceMeters / 1000)}км</Typography>
      <Typography>
        {Math.round(Number(route.duration.replace("s", "")) / 60)} мин
      </Typography>
    </Tooltip>
  );
};

const Map = () => {
  const coordinates = polyline.decode(route.polyline.encodedPolyline);
  const startPoint = coordinates[0];
  const endPoint = coordinates[coordinates.length - 1];

  return (
    <MapContainer
      center={coordinates[0]}
      zoom={500}
      scrollWheelZoom={false}
      style={{
        zIndex: 0,
        borderRadius: "10px",
        height: "500px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={startPoint} />
      <Marker position={endPoint} />
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: "blue",
          weight: 4,
        }}
      >
        <MapTooltip />
      </Polyline>
    </MapContainer>
  );
};

export default Map;
