import React from "react";
import { formatNominatimAddress } from "../../../components/lead-form/lib/geocoding.helpers";
import { cleanAddress } from "../../../components/lead-form/lib/clean-address";
import { getCoords } from "../../../components/lead-form/lib/geacode-address";

export const useFormDefaultValues = (lead = null) => {
  console.log("lead", lead);

  return {
    // status: lead.status,
    // id: lead.id,
    // num: lead.num,
    loading_date: lead?.created_at.date || null,
    driver: lead?.driver,
    summ: lead?.summ || null,
    currency: lead?.currency || null,
    // transportation_price: lead.transportation_price,
    // vat: lead.vat,
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
    // gsm: lead.gsm,
    customer: lead?.customer,
    cargo_type: lead?.cargo.type || null,
    // description: lead.description,
    // context: lead.context,
    weight_kg: lead?.cargo.weight_kg || null,
    // type: lead.type,
    cargo_length_cm: lead?.cargo_length || null,
    cargo_width_cm: lead?.cargo_width || null,
    cargo_height_cm: lead?.cargo_height || null,
    documents: lead?.documents || [],
  };
};
