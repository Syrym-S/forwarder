import { STATUS } from "./tenders";

export const LEAD_MAP_STATUS_OPTIONS = [
  // { value: STATUS.new, label: "dashboard.new", color: "#51d861" },
  // {
  //   value: STATUS.add_driver,
  //   label: "dashboard.driver_added",
  //   color: "#6366f1",
  // },
  {
    value: STATUS.start_driver,
    label: "dashboard.trip_started",
    color: "#2563eb",
  },
  {
    value: STATUS.loading,
    label: "dashboard.loading_operation",
    color: "#d97706",
  },
  {
    value: STATUS.start_loading,
    label: "notifications.shipping.loading_started.theme",
    color: "#ea580c",
  },
  {
    value: STATUS.verification_loading,
    label: "dashboard.loading_confirmed",
    color: "#65a30d",
  },
  {
    value: STATUS.unloading,
    label: "dashboard.unloading_operation",
    color: "#0891b2",
  },
  {
    value: STATUS.start_unloading,
    label: "notifications.shipping.unloading_started.theme",
    color: "#7c3aed",
  },
  {
    value: STATUS.verification_unloading,
    label: "dashboard.unloading_confirmed",
    color: "#0f766e",
  },
  {
    value: STATUS.emergency_situation,
    label: "dashboard.emergency",
    color: "#dc2626",
  },
  {
    value: STATUS.sign_avr,
    label: "dashboard.awaiting_signatures",
    color: "#d16a16",
  },
  {
    value: STATUS.finished,
    label: "dashboard.trip_completed",
    color: "#c60606",
  },
];

export const DEFAULT_LEAD_MAP_STATUSES = [
  STATUS.start_driver,
  STATUS.loading,
  STATUS.start_loading,
  STATUS.unloading,
  STATUS.start_unloading,
  STATUS.emergency_situation,
  STATUS.sign_avr,
];

const statusColors = Object.fromEntries(
  LEAD_MAP_STATUS_OPTIONS.map(({ value, color }) => [value, color]),
);

export const getLeadMapStatusColor = (status) =>
  statusColors[status] || "#64748b";
