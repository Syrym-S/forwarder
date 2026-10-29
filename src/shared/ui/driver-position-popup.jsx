import { useTranslation } from "react-i18next";
import { Popup } from "react-leaflet";
import "./driver-position-popup.css";

export default function DriverPositionPopup({ leadData, point }) {
  const { t, i18n } = useTranslation();
  const updatedAt = point?.recorded_at ?? point?.updated_at ?? point?.created_at ?? point?.timestamp;
  const updateDate = typeof updatedAt === "string" || typeof updatedAt === "number"
    ? new Date(updatedAt)
    : null;
  const updateLabel = updateDate && !Number.isNaN(updateDate.getTime())
    ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
        timeZone: "Asia/Almaty",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(updateDate)
    : t("dashboard.not_specified");
  const routePoints = [
    leadData?.from_location && { ...leadData.from_location, label: "A" },
    ...(leadData?.waypoints || []).map((point, index) => ({ ...point, label: `P#${index + 1}` })),
    leadData?.to_location && { ...leadData.to_location, label: "B" },
  ].filter(Boolean);
  const nextPoint = routePoints.find((point) => !point.is_passed);
  const describePoint = (point) => `${point.label}: ${point.address || t("dashboard.address_not_specified")}`;

  return (
    <Popup className="driver-position-popup" minWidth={220} maxWidth={380}>
      <strong>{t("dashboard.driver_current_position")}</strong>
      <div>{t("dashboard.position_last_updated")}: {updateLabel}</div>
      <div>{t("dashboard.next_point")}: {nextPoint ? describePoint(nextPoint) : t("dashboard.route_completed")}</div>
    </Popup>
  );
}
