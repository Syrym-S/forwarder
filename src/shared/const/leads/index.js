import appI18n from "../../../i18n/index.js";

export const VIEWS = {
  table: "table",
  cards: "cards",
  kanban: "kanban",
};

export const LEAD_TABS = {
  lead_details: "lead_details",
  customer_chat: "customer_chat",
  driver_chat: "driver_chat",
  factor_chat: "factor_chat",
};

export const steps = ["Маршрут", "Груз", "Водитель", "Заказчик", "Проверка"];

export const initialForm = {
  // customer: 'AKE Plast (АКЕ Пласт) ТОО',
  // contactName: 'Suleimenov Syrym',
  // phone: '+7 777 777 77 77',

  fromLocation: "",
  fromLat: "",
  fromLng: "",

  toLocation: "",
  toLat: "",
  toLng: "",

  loadingDate: "2026-06-10",

  cargoType: "Не указан",
  weightKg: "1200",
  cargoLengthCm: "50",
  cargoWidthCm: "50",
  cargoHeightCm: "70",
  price: "250000",
  currency: "KZT",
  vat: true,
  comment: "",

  forwarderId: "",
  forwarder: null,
};

export const STATUS_LABEL_KEYS = {
  new: "dashboard.new",
  add_driver: "dashboard.driver_added",
  start_driver: "dashboard.trip_started",
  start_loading: "dashboard.loading_operation",
  verification_loading: "dashboard.loading_confirmed",
  start_unloading: "dashboard.unloading_operation",
  verification_unloading: "dashboard.unloading_confirmed",
  sign_avr: "dashboard.awaiting_signatures",
  emergency_situation: "dashboard.emergency",
};

export const ACTIVE_LEAD_STATUS_OPTIONS = [
  {
    label: appI18n.t("ui.new_4"),
    value: "new",
  },
  {
    label: appI18n.t("ui.driver_added_2"),
    value: "add_driver",
  },
  {
    label: appI18n.t("ui.trip_started"),
    value: "start_driver",
  },
  {
    label: appI18n.t("ui.loading_operation"),
    value: "start_loading",
  },
  {
    label: appI18n.t("ui.loading_confirmed"),
    value: "verification_loading",
  },
  {
    label: appI18n.t("ui.unloading_operation"),
    value: "start_unloading",
  },
  {
    label: appI18n.t("ui.unloading_confirmed"),
    value: "verification_unloading",
  },
  {
    label: appI18n.t("dashboard.awaiting_signatures"),
    value: "sign_avr",
  },
  {
    label: appI18n.t("ui.emergency"),
    value: "emergency_situation",
  },
];

export const DRAFT_OPTION = { value: "draft", label: "active_leads.draft" };

export const STATUS_OPTIONS = [
  ...ACTIVE_LEAD_STATUS_OPTIONS.map((option) => ({
    ...option,
    label: STATUS_LABEL_KEYS[option.value],
  })),
  DRAFT_OPTION,
];
