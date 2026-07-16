import React from "react";
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
import ReProfile from "../../pages/re-profile";
import { createBrowserRouter } from "react-router-dom";
import { isStaging } from "../client";
import AppContentContainer from "./app-content-container";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppContentContainer />,
      handle: {
        breadcrumb: "Главная",
      },
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "active-leads",
          element: <ActiveLeads />,
          handle: {
            breadcrumb: "Активные перевозки",
          },
        },
        {
          path: "leads/:id",
          element: <LeadItem />,
          handle: {
            breadcrumb: ({ params }) => `Перевозкa / ${params.id}`,
          },
        },
        {
          path: "/history-leads",
          element: <HistoryLeads />,
          handle: {
            breadcrumb: "История перевозок",
          },
        },
        {
          path: "/account",
          element: <Account />,
          handle: {
            breadcrumb: "Аккаунт",
          },
        },
        {
          path: "/factorings",
          element: <Factoring />,
          handle: {
            breadcrumb: "Фанторинги",
          },
        },
        {
          path: "/factoring/:id",
          element: <FactoringItem />,
          handle: {
            breadcrumb: ({ params }) => `Факторинг / ${params.id}`,
          },
        },
        {
          path: "/customers",
          element: <Customers />,
          handle: {
            breadcrumb: "Заказщики",
          },
        },
        {
          path: "/drivers",
          element: <Drivers />,
          handle: {
            breadcrumb: "Водители",
          },
        },

        {
          path: "/profile",
          element: <ReProfile />,
          handle: {
            breadcrumb: "Профиль",
          },
        },
        {
          path: "/tender-applications",
          element: <TenderApplications />,
          handle: {
            breadcrumb: "Тендерные заявки",
          },
        },
        {
          path: "/tenders/:id",
          element: <TenderApplicationsItem />,
          handle: {
            breadcrumb: ({ params }) => `Тендерная заявка / ${params.id}`,
          },
        },
        {
          path: "/tender-forwarders",
          element: <TenderForwarders />,
          handle: {
            breadcrumb: "Тендера перевозчиков",
          },
        },
        {
          path: "/tender-forwarders/:id",
          element: <TenderForwardersItem />,
          handle: {
            breadcrumb: ({ params }) => `Тендер / ${params.id}`,
          },
        },
      ],
    },
  ],
  {
    basename: isStaging ? "/staging/forwarder" : "/forwarder",
  },
);
