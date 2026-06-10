import React from "react";
import { formatNominatimAddress } from "../../../components/lead-form/lib/geocoding.helpers";
import { cleanAddress } from "../../../components/lead-form/lib/clean-address";
import { getCoords } from "../../../components/lead-form/lib/geacode-address";

export const useFormDefaultValues = (lead) => {
  console.log("lead", lead);

  return {
    // status: lead.status,
    // id: lead.id,
    // num: lead.num,
    loading_date: lead?.created_at.date,
    // driver: lead.driver,
    summ: lead?.summ,
    currency: lead?.currency,
    // transportation_price: lead.transportation_price,
    // vat: lead.vat,
    to_location: cleanAddress(lead?.to_location),
    from_location: cleanAddress(lead?.from_location),
    // gsm: lead.gsm,
    // customer: lead.customer,
    cargo_type: lead?.cargo.type,
    // description: lead.description,
    // context: lead.context,
    weight_kg: lead?.cargo.weight_kg,
    // type: lead.type,
    cargo_length_cm: lead?.cargo_length || 1,
    cargo_width_cm: lead?.cargo_width || 1,
    cargo_height_cm: lead?.cargo_height || 1,
  };
};
