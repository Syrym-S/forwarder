import appI18n from "../../i18n/index.js";
import { PAGE_ROUTES } from "../const/page-routes";

export const ROUTE_NAMES = {
  get [PAGE_ROUTES.routes]() { return appI18n.t("ui.routes"); },
  get [PAGE_ROUTES.active_leads]() { return appI18n.t("ui.active_leads_2"); },
  get [PAGE_ROUTES.history_leads]() { return appI18n.t("ui.lead_history_2"); },
  get [PAGE_ROUTES.account]() { return appI18n.t("ui.account_2"); },
  get [PAGE_ROUTES.factorings]() { return appI18n.t("ui.factoring_2"); },
  get [PAGE_ROUTES.customers]() { return appI18n.t("ui.customers_2"); },
  get [PAGE_ROUTES.drivers]() { return appI18n.t("ui.drivers_2"); },
  get [PAGE_ROUTES.tender_applications]() { return appI18n.t("ui.tender_requests"); },
  get [PAGE_ROUTES.tender_forwarders]() { return appI18n.t("ui.carrier_tenders"); },
};

export const renderRouteName = (route) => {
  const normalizedRoute = route?.replace(/^#/, "")?.replace(/^\/|\/$/g, "");

  const alternativeRoute = !normalizedRoute ? "routes" : normalizedRoute;

  return ROUTE_NAMES[alternativeRoute] ?? "";
};
