import appI18n from "../../../i18n/index.js";
export const transportationParameters = [
  { name: "type_loading", get label() { return appI18n.t("ui.loading_type"); } },
  { name: "type_packaging", get label() { return appI18n.t("ui.packaging_type"); } },
  { name: "type_composition", get label() { return appI18n.t("ui.vehicle_configuration_type"); } },
  { name: "type_transport", get label() { return appI18n.t("ui.transport_type"); } },
];
