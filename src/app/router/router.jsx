import appI18n from "../../i18n/index.js";
import Dashboard from "../../pages/dashboard";
import LeadItem from "../../pages/lead-item";
import Profile from "../../pages/profile";
import Drivers from "../../pages/drivers";
import Customers from "../../pages/customers";
import Factoring from "../../pages/factoring";
import Account from "../../pages/account";
import HistoryLeads from "../../pages/history-leads";
import ActiveLeads from "../../pages/active-leads";
import TenderForwarders from "../../pages/tender-forwarders";
import TenderForwardersItem from "../../pages/tender-forwarders/tender-forwarders-item";
import TenderApplications from "../../pages/tender-applications";
import TenderApplicationsItem from "../../pages/tender-applications/tender-applications-item";
import FactoringItem from "../../pages/factoring/factoring-item";
import AppContentContainer from "./app-content-container";
import Factor from "../../pages/factor";
import TenderHistory from "../../pages/tender-history";
import FactorItem from "../../pages/factor/factor-item";
import ErrorPage from "../../pages/error";
import { createBrowserRouter } from "react-router-dom";
import { isStaging } from "../client";
import Handbook from "../../pages/handbook";
import Complaints from "../../pages/complaints";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppContentContainer />,
      errorElement: <ErrorPage />,
      handle: {
        get breadcrumb() { return appI18n.t("ui.home_page"); },
        breadcrumbKey: "menu.home_page",
      },
      children: [
        {
          path: "/complaints",
          element: <Complaints />,
          handle: { get breadcrumb() { return appI18n.t("ui.complaints"); } },
        },
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "active-leads",
          element: <ActiveLeads />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.active_leads"); },
            breadcrumbKey: "menu.active_leads",
          },
        },
        {
          path: "leads/:id",
          element: <LeadItem />,
          handle: {
            title: ({ params, currentLead }) =>
              String(currentLead?.id) === params.id && currentLead?.num
                ? appI18n.t("ui.lead_number", { value1: currentLead.num })
                : appI18n.t("ui.lead"),
            breadcrumb: ({ params }) => appI18n.t("ui.lead_breadcrumb", { value1: params.id }),
          },
        },
        {
          path: "/history-leads",
          element: <HistoryLeads />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.lead_history"); },
          },
        },
        {
          path: "/account",
          element: <Account />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.account"); },
          },
        },
        {
          path: "/factorings",
          element: <Factoring />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.factorings"); },
          },
        },
        {
          path: "/factoring/:id",
          element: <FactoringItem />,
          handle: {
            breadcrumb: appI18n.t("ui.factoring_sales"),
          },
        },
        {
          path: "/customers",
          element: <Customers />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.customers"); },
          },
        },
        {
          path: "/drivers",
          element: <Drivers />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.drivers"); },
          },
        },

        {
          path: "/profile",
          element: <Profile />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.profile"); },
          },
        },
        {
          path: "/tender-applications",
          element: <TenderApplications />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.auction_requests"); },
          },
        },
        {
          path: "/tenders/:id", /// Линк с нотификации приходит так
          element: <TenderApplicationsItem />,
          handle: {
            breadcrumb: ({ params }) => appI18n.t("ui.auction_request_breadcrumb", { value1: params.id }),
          },
        },
        {
          path: "/tender-forwarders",
          element: <TenderForwarders />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.carrier_auctions"); },
          },
        },
        {
          path: "/tenders-driver/:id", /// Линк с нотификации приходит так
          element: <TenderForwardersItem />,
          handle: {
            breadcrumb: ({ params }) => appI18n.t("ui.auction_breadcrumb", { value1: params.id }),
          },
        },
        {
          path: "/tenders-history/",
          element: <TenderHistory />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.auction_history"); },
          },
        },
        {
          path: "/factoring-lines",
          element: <Factor />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.factoring_companies"); },
          },
        },
        {
          path: "/factoring-lines/:id/:breadcrumbs",
          element: <FactorItem />,
          handle: {
            title: ({ params }) => appI18n.t("ui.line_title", { value1: params.breadcrumbs }),
            breadcrumb: ({ params }) =>
              appI18n.t("ui.factoring_company_breadcrumb", { value1: params.breadcrumbs }),
          },
        },
        {
          path: "/handbook",
          element: <Handbook />,
          handle: {
            get breadcrumb() { return appI18n.t("ui.catalog"); },
          },
        },
      ],
    },
  ],
  {
    basename: isStaging ? "/staging/forwarder" : "/forwarder",
  },
);
