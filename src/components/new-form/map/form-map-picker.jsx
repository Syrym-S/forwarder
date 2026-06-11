import React from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import { useCustomerMap } from "../../lead-form/use-customer-map";

import "leaflet/dist/leaflet.css";

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      if (!onMapClick) {
        return;
      }

      onMapClick(event.latlng);
    },
  });

  return null;
}

const FormMapPicker = () => {
  const map = useCustomerMap();

  return (
    <MapContainer
      center={map.center}
      zoom={map.zoom}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};

export default FormMapPicker;
