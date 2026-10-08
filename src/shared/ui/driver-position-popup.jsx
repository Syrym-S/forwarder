import { Popup } from "react-leaflet";
import "./driver-position-popup.css";

export default function DriverPositionPopup({ leadData, point }) {
  const updatedAt = point?.recorded_at ?? point?.updated_at ?? point?.created_at ?? point?.timestamp;
  const updateDate = typeof updatedAt === "string" || typeof updatedAt === "number"
    ? new Date(updatedAt)
    : null;
  const updateLabel = updateDate && !Number.isNaN(updateDate.getTime())
    ? new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Asia/Almaty",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(updateDate)
    : "Не указано";
  const routePoints = [
    leadData?.from_location && { ...leadData.from_location, label: "A" },
    ...(leadData?.waypoints || []).map((point, index) => ({ ...point, label: `P#${index + 1}` })),
    leadData?.to_location && { ...leadData.to_location, label: "B" },
  ].filter(Boolean);
  const nextPoint = routePoints.find((point) => !point.is_passed);
  const describePoint = (point) => `${point.label}: ${point.address || "Адрес не указан"}`;

  return (
    <Popup className="driver-position-popup" minWidth={220} maxWidth={380}>
      <strong>Текущая позиция водителя</strong>
      <div>Последнее обновление позиции: {updateLabel}</div>
      <div>Следующая точка: {nextPoint ? describePoint(nextPoint) : "Маршрут пройден"}</div>
    </Popup>
  );
}
