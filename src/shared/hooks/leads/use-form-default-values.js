import React from "react";
import { formatNominatimAddress } from "../../../components/lead-form/lib/geocoding.helpers";
import { cleanAddress } from "../../../components/lead-form/lib/clean-address";
import { getCoords } from "../../../components/lead-form/lib/geacode-address";

export const useFormDefaultValues = (lead = null) => {
  return {
    loading_date: lead?.created_at.date || null,
    driver: lead?.driver,
    summ: lead?.summ || null,
    currency: lead?.currency || null,
    vat: lead?.vat,
    to_location: {
      address: lead?.to_location.address || null,
      city: lead?.to_location.city || null,
      country: lead?.to_location.country || null,
      lat: lead?.to_location.lat || null,
      lon: lead?.to_location.lon || null,
      region: lead?.to_location.region || null,
    },
    from_location: {
      address: lead?.from_location.address || null,
      city: lead?.from_location.city || null,
      country: lead?.from_location.country || null,
      lat: lead?.from_location.lat || null,
      lon: lead?.from_location.lon || null,
      region: lead?.from_location.region || null,
    },
    customer: lead?.customer,
    cargo_type: lead?.cargo.type || null,
    comment: lead?.cargo.description || "",
    weight_kg: lead?.cargo.weight_kg || null,
    length_cm: lead?.cargo.length_cm || null,
    width_cm: lead?.cargo.width_cm || null,
    height_cm: lead?.cargo.height_cm || null,
    cargo_price: lead?.cargo_price,
    documents: lead?.documents || [],
  };
};
