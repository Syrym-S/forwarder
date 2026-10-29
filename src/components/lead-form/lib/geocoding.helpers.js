import appI18n from "../../../i18n/index.js";
export function formatCoordinatesLabel(lat, lng) {
   return appI18n.t("lead_form.coordinates_label", { value1: lat, value2: lng });
}

export function formatNominatimAddress(data) {
   const address = data?.address;

   if (!address) {
      return data?.display_name || appI18n.t("lead_form.address_not_found");
   }

   const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county;

   const region =
      address.state ||
      address.region ||
      address.state_district ||
      address.county;

   const country = address.country;

   const parts = [city, region, country].filter(Boolean);

   if (parts.length === 0) {
      return data?.display_name || appI18n.t("lead_form.address_not_found");
   }

   return [...new Set(parts)].join(', ');
}
