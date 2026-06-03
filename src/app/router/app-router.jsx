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
import { useRoutes } from "react-router-dom";

const AppRouter = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/lead-item/:id",
      element: <LeadItem />,
    },
    {
      path: "/active-leads",
      element: <ActiveLeads />,
    },
    {
      path: "/history-leads",
      element: <HistoryLeads />,
    },
    {
      path: "/account",
      element: <Account />,
    },
    {
      path: "/factoring",
      element: <Factoring />,
    },
    {
      path: "/customers",
      element: <Customers />,
    },
    {
      path: "/drivers",
      element: <Drivers />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);
  return routes;
};

export default AppRouter;
