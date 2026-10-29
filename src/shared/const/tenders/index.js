import appI18n from "../../../i18n/index.js";
export const STATUS = {
  cancelled: "cancelled",
  new: "new",
  active: "active",
  add_driver: "add_driver",
  start_driver: "start_driver",
  start_loading: "start_loading",
  verification_loading: "verification_loading",
  start_unloading: "start_unloading",
  verification_unloading: "verification_unloading",
  finished: "finished",
  deleted: "deleted",
  closed: "closed",
  verified_participant: "verified_participant",
  await_paid: "await_paid",
  winning: "winning",
  loss: "loss",
  approved: "approved",
  emergency_situation: "emergency_situation",
  finished_emergency_situation: "finished_emergency_situation",
  sign_avr: "sign_avr",
};

export const FINISHED_LEAD_STATUSES = [
  STATUS.finished,
  STATUS.deleted,
  STATUS.finished_emergency_situation,
];

export const NEW_LEAD_STATUS = [STATUS.new, STATUS.add_driver];

export const IN_PROGRESS_STATUSES = [
  STATUS.start_driver,
  STATUS.start_loading,
  STATUS.start_unloading,
  STATUS.verification_loading,
  STATUS.verification_unloading,
];

export const WAYPOINT_TYPES = {
  loading: "loading",
  unloading: "unloading",
  check_passes: "check_passes",
};

export const LEAD_STATUS_OPTIONS = [
  { get label() { return appI18n.t("ui.new_4"); }, value: "new" },
  { get label() { return appI18n.t("ui.driver_added_2"); }, value: "add_driver" },
  { get label() { return appI18n.t("ui.trip_started"); }, value: "start_driver" },
  { get label() { return appI18n.t("ui.loading_operation"); }, value: "start_loading" },
  { get label() { return appI18n.t("ui.loading_confirmed"); }, value: "verification_loading" },
  { get label() { return appI18n.t("ui.unloading_operation"); }, value: "start_unloading" },
  { get label() { return appI18n.t("ui.unloading_confirmed"); }, value: "verification_unloading" },
  { get label() { return appI18n.t("ui.trip_completed"); }, value: "finished" },
  { get label() { return appI18n.t("ui.trip_deleted"); }, value: "deleted" },
];

export const ACTIVE_LEAD_STATUS_OPTIONS = [
  { get label() { return appI18n.t("ui.new_4"); }, value: "new" },
  { get label() { return appI18n.t("ui.driver_added_2"); }, value: "add_driver" },
  { get label() { return appI18n.t("ui.trip_started"); }, value: "start_driver" },
  { get label() { return appI18n.t("ui.loading_operation"); }, value: "start_loading" },
  { get label() { return appI18n.t("ui.loading_confirmed"); }, value: "verification_loading" },
  { get label() { return appI18n.t("ui.unloading_operation"); }, value: "start_unloading" },
  { get label() { return appI18n.t("ui.unloading_confirmed"); }, value: "verification_unloading" },
  { get label() { return appI18n.t("ui.emergency"); }, value: "emergency_situation" },
];

export const HISTORY_LEAD_STATUS_OPTIONS = [
  { get label() { return appI18n.t("ui.trip_completed"); }, value: "finished" },
  { get label() { return appI18n.t("ui.trip_deleted"); }, value: "deleted" },
  {
    get label() { return appI18n.t("ui.emergency_closed"); },
    value: "finished_emergency_situation",
  },
];
