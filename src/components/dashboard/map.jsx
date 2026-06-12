import React, { useState, useEffect } from "react";
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
import { useStore } from "zustand";
import { useLeadsStore } from "../../app/store/leads-store";

const getRoute = async (start, end) => {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
  );

  const data = await response.json();

  return {
    distance: data.routes[0].distance, // метры
    duration: data.routes[0].duration, // секунды
    coordinates: data.routes[0].geometry.coordinates.map(([lng, lat]) => [
      lat,
      lng,
    ]),
  };
};

const MapTooltip = ({ route }) => {
  return (
    <Tooltip sticky>
      <Typography
        style={{
          width: "200px",
        }}
      >
        Дистанция: {Math.round(route.distance / 1000)} км
      </Typography>
      <Typography>
        Длительность : {Math.round(Number(route.duration / 60))} мин
      </Typography>
    </Tooltip>
  );
};

const Map = () => {
  const leads = useLeadsStore((state) => state.leads);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const loadRoutes = async () => {
      const result = await Promise.all(
        leads
          .filter(
            (lead) =>
              lead?.from_location?.lat &&
              lead?.from_location?.lon &&
              lead?.to_location?.lat &&
              lead?.to_location?.lon,
          )
          .map(async (lead) => {
            const coordinates = await getRoute(
              [lead.from_location.lat, lead.from_location.lon],
              [lead.to_location.lat, lead.to_location.lon],
            );

            return {
              id: lead.id,
              start: coordinates.coordinates[0],
              end: coordinates.coordinates[coordinates.coordinates.length - 1],
              coordinates: coordinates.coordinates,
              distance: coordinates.distance,
              duration: coordinates.duration,
            };
          }),
      );

      setRoutes(result);
    };

    loadRoutes();
  }, [leads]);

  return (
    <MapContainer
      center={[43.238949, 76.889709]}
      zoom={13}
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

      {routes.map((route) => {
        return (
          <React.Fragment key={route.id}>
            <Marker position={route.start} />
            <Marker position={route.end} />

            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: "blue",
                weight: 4,
              }}
            >
              <MapTooltip route={route} />
            </Polyline>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default Map;
