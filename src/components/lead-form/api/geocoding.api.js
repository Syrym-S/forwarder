import { formatCoordinatesLabel } from "../lib/geocoding.helpers";
import { waitForGeocodingSlot } from "./geocoding-rate-limit.js";

export async function reverseGeocode(lat, lng, options = {}) {
  const savedLanguage = localStorage.getItem("language");
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");

    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lng);
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", savedLanguage);

    await waitForGeocodingSlot(options.signal);
    options.signal?.throwIfAborted();
    const response = await fetch(url.toString(), {
      signal: options.signal,
    });

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    console.error(error);
    return formatCoordinatesLabel(lat, lng);
  }
}
