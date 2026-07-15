import { PAGE_ROUTES } from "../const/page-routes";

export const ROUTE_NAMES = {
  [PAGE_ROUTES.routes]: "МАРШРУТЫ",
  [PAGE_ROUTES.active_leads]: "АКТИВНЫЕ ЛИДЫ",
  [PAGE_ROUTES.history_leads]: "ИСТОРИЯ ЛИДОВ",
  [PAGE_ROUTES.account]: "АККАУНТ",
  [PAGE_ROUTES.factorings]: "ФАКТОРИНГ",
  [PAGE_ROUTES.customers]: "ЗАКАЗЧИКИ",
  [PAGE_ROUTES.drivers]: "ВОДИТЕЛИ",
  [PAGE_ROUTES.tender_applications]: "ТЕНДЕРНЫЕ ЗАЯВКИ",
  [PAGE_ROUTES.tender_forwarders]: "ТЕНДЕРА ПЕРЕВОЗЧИКОВ",
};

export const renderRouteName = (route) => {
  const normalizedRoute = route?.replace(/^#/, "")?.replace(/^\/|\/$/g, "");

  const alternativeRoute = !normalizedRoute ? "routes" : normalizedRoute;

  return ROUTE_NAMES[alternativeRoute] ?? "";
};
