import { useTranslation } from "react-i18next";
export function useCustomerMap() {
  const { t } = useTranslation();
  const center = [43.241141, 76.871399]; // Алматы, временно
  const zoom = 12;

  const markers = [
    {
      id: 1,
      position: [43.241141, 76.871399],
      title: t("lead_form.customer_map_point"),
      description: t("lead_form.temporary_map_marker"),
    },
  ];

  const routePoints = [];

  function handleMarkerClick(marker) {
    console.log("marker click:", marker);
  }

  return {
    center,
    zoom,
    markers,
    routePoints,
    handleMarkerClick,
  };
}
