import { useRef, useState } from "react";
import { formatCoordinatesLabel } from "./lib/geocoding.helpers";
import {
  getRouteMarkers,
  getRoutePoints,
  hasPoint,
} from "./lib/routeMap.helpers";
import { reverseGeocode } from "./api/geocoding.api";

const setValueOptions = {
  shouldDirty: true,
  shouldTouch: true,
  shouldValidate: true,
};

export function useRouteMapPicker({ form, fields, setValue }) {
  const [count, setCount] = useState(0);

  const [activeMapPoint, setActiveMapPoint] = useState("from");
  const [loadingPoints, setLoadingPoints] = useState({
    from: false,
    to: false,
  });

  const reverseGeocodeControllersRef = useRef({
    from: null,
    to: null,
  });

  const routeMarkers = getRouteMarkers(form);
  const routePoints = getRoutePoints(form);

  async function setFromPoint(lat, lng) {
    setValue("fromLat", lat, setValueOptions);
    setValue("fromLng", lng, setValueOptions);

    const locationInfo = await getAddressForPoint("from", lat, lng);

    if (!locationInfo) {
      return;
    }
    const from_location = {
      address: locationInfo.display_name,
      city: locationInfo.address.city,
      country: locationInfo.address.country,
      region: locationInfo.address.city_district,
      lat: lat,
      lng: lng,
    };

    setValue("from_location", from_location, setValueOptions);
  }

  async function setCrossPoint(index, lat, lng) {
    setValue(`waypoints[${index}].Lat`, lat, setValueOptions);
    setValue(`waypoints[${index}].Lng`, lng, setValueOptions);

    const locationInfo = await getAddressForPoint(`cross.${index}`, lat, lng);

    if (!locationInfo) {
      return;
    }

    const cross_location = {
      address: locationInfo.display_name,
      city: locationInfo.address.city,
      country: locationInfo.address.country,
      region: locationInfo.address.city_district,
      lat,
      lon: lng,
    };

    setValue(`waypoints[${index}]`, cross_location, setValueOptions);
  }

  async function setToPoint(lat, lng) {
    setValue("toLat", lat, setValueOptions);
    setValue("toLng", lng, setValueOptions);

    const locationInfo = await getAddressForPoint("to", lat, lng);

    if (!locationInfo) {
      return;
    }

    const to_location = {
      address: locationInfo.display_name,
      city: locationInfo.address.city,
      country: locationInfo.address.country,
      region: locationInfo.address.city_district,
      lat: lat,
      lng: lng,
    };

    setValue("to_location", to_location, setValueOptions);
  }

  function setPointLoading(point, isLoading) {
    setLoadingPoints((prevLoadingPoints) => ({
      ...prevLoadingPoints,
      [point]: isLoading,
    }));
  }

  function abortReverseGeocode(point) {
    if (reverseGeocodeControllersRef.current[point]) {
      reverseGeocodeControllersRef.current[point].abort();
      reverseGeocodeControllersRef.current[point] = null;
    }
  }

  async function getAddressForPoint(point, lat, lng) {
    abortReverseGeocode(point);

    const controller = new AbortController();

    reverseGeocodeControllersRef.current[point] = controller;
    setPointLoading(point, true);

    try {
      const address = await reverseGeocode(lat, lng, {
        signal: controller.signal,
      });

      if (reverseGeocodeControllersRef.current[point] !== controller) {
        return null;
      }

      return address;
    } catch (error) {
      if (error.name === "AbortError") {
        return null;
      }

      console.error(error);
      return formatCoordinatesLabel(lat, lng);
    } finally {
      if (reverseGeocodeControllersRef.current[point] === controller) {
        reverseGeocodeControllersRef.current[point] = null;
        setPointLoading(point, false);
      }
    }
  }

  function handleRouteMapClick(latlng) {
    const lat = Number(latlng.lat.toFixed(6));
    const lng = Number(latlng.lng.toFixed(6));

    if (activeMapPoint === "from") {
      setFromPoint(lat, lng);

      if (fields.length > 0) {
        setActiveMapPoint(`cross.0`);
      } else {
        setActiveMapPoint("to");
      }

      return;
    }

    if (activeMapPoint === `cross.${count}`) {
      setCrossPoint(count, lat, lng);

      const nextCount = count + 1;

      setCount(nextCount);

      if (nextCount < fields.length) {
        setActiveMapPoint(`cross.${nextCount}`);
      } else {
        setActiveMapPoint("to");
      }

      return;
    }

    setToPoint(lat, lng);
  }

  function handleClearRoute() {
    setCount(0);
    abortReverseGeocode("from");
    abortReverseGeocode("to");

    setValue("from_location.address", "", setValueOptions);
    setValue("from_location.city", null, setValueOptions);
    setValue("from_location.country", null, setValueOptions);
    setValue("from_location.region", null, setValueOptions);
    setValue("from_location.lat", null, setValueOptions);
    setValue("from_location.lng", null, setValueOptions);

    setValue("fromLat", "", setValueOptions);
    setValue("fromLng", "", setValueOptions);

    setValue("waypoints", [], setValueOptions);

    setValue("to_location.address", "", setValueOptions);
    setValue("to_location.city", null, setValueOptions);
    setValue("to_location.country", null, setValueOptions);
    setValue("to_location.region", null, setValueOptions);
    setValue("to_location.lat", null, setValueOptions);
    setValue("to_location.lng", null, setValueOptions);

    setValue("toLat", "", setValueOptions);
    setValue("toLng", "", setValueOptions);

    setActiveMapPoint("from");
    setLoadingPoints({
      from: false,
      to: false,
    });
  }

  function handleRouteMarkerDragEnd(marker, latlng) {
    const lat = Number(latlng.lat.toFixed(6));
    const lng = Number(latlng.lng.toFixed(6));

    if (marker.id === "from") {
      setFromPoint(lat, lng);
      setActiveMapPoint("from");
      return;
    }

    if (marker.id.startsWith("cross.")) {
      const crossIndex = Number(marker.id.split(".")[1]);

      setCount(crossIndex);
      setCrossPoint(crossIndex, lat, lng);
      setActiveMapPoint(`cross.${crossIndex}`);

      return;
    }

    if (marker.id === "to") {
      setToPoint(lat, lng);
      setActiveMapPoint("to");
    }
  }

  function clearFromPoint() {
    abortReverseGeocode("from");
    setPointLoading("from", false);

    setValue("fromLat", "", setValueOptions);
    setValue("fromLng", "", setValueOptions);

    setActiveMapPoint("from");
  }

  function clearToPoint() {
    abortReverseGeocode("to");
    setPointLoading("to", false);

    setValue("toLat", "", setValueOptions);
    setValue("toLng", "", setValueOptions);

    setActiveMapPoint("to");
  }

  const isClearDisabled =
    !hasPoint(form.fromLat, form.fromLng) &&
    !hasPoint(form.toLat, form.toLng) &&
    !form.fromLocation &&
    !form.toLocation;

  return {
    activeMapPoint,
    setCount,
    loadingPoints,
    routeMarkers,
    routePoints,
    isClearDisabled,
    setActiveMapPoint,
    handleRouteMapClick,
    handleRouteMarkerDragEnd,
    handleClearRoute,
    clearFromPoint,
    clearToPoint,
  };
}
