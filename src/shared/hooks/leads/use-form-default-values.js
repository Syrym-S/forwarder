import React from "react";

export const useFormDefaultValues = (lead = null, files = []) => {
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
    waypoints:
      lead?.waypoints?.map((waypoint) => ({
        address: waypoint.address || null,
        city: waypoint.city || "",
        country: waypoint.country || "",
        lat: waypoint.lat || null,
        lon: waypoint.lon || null,
        region: waypoint.region || null,
      })) || [],
    from_location: {
      address: lead?.from_location.address || null,
      city: lead?.from_location.city || null,
      country: lead?.from_location.country || null,
      lat: lead?.from_location.lat || null,
      lon: lead?.from_location.lon || null,
      region: lead?.from_location.region || null,
    },
    customer: lead?.customer,
    // cargo_type: lead?.cargo.type || null,
    // name: lead?.cargo?.name || null,
    // comment: lead?.cargo.description || "",
    // weight_kg: lead?.cargo.weight_kg || null,
    // length_cm: lead?.cargo.length_cm || null,
    // width_cm: lead?.cargo.width_cm || null,
    // height_cm: lead?.cargo.height_cm || null,
    price: lead?.price,
    transportation_price: lead?.transportation_price || null,
    documents: files || [],
    cargos: lead?.cargos?.map((cargo) => ({
      cargo_price: cargo?.cargo_price || null,
      cargo_type: cargo?.type || null,
      name: cargo?.name || "",
      comment: cargo.description || "",
      weight_kg: cargo?.weight_kg || null,
      length_cm: cargo?.length_cm || null,
      width_cm: cargo?.width_cm || null,
      height_cm: cargo?.height_cm || null,
    })) || [
      {
        cargo_type: null,
        name: "",
        comment: "",
        weight_kg: null,
        length_cm: null,
        width_cm: null,
        height_cm: null,
      },
    ],
  };
};
