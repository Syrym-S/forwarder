import React from "react";
import { Box, Typography } from "@mui/material";
import { NavLink, useLocation, useParams } from "react-router-dom";
import "./style.css";

const menuItems = [
  { id: 1, label: null, sub_items: [{ id: 1, path: "/", lable: "Dashboard" }] },
  {
    id: 2,
    label: "TMS",
    sub_items: [
      { id: 1, path: "/active-leads", lable: "Active Leads" },
      { id: 2, path: "/history-leads", lable: "History Leads" },
    ],
  },
  {
    id: 3,
    label: "Finance",
    sub_items: [
      { id: 1, path: "/account", lable: "Account" },
      { id: 2, path: "/factoring", lable: "Factoring" },
    ],
  },
  {
    id: 4,
    label: "Catalog",
    sub_items: [
      { id: 1, path: "/customers", lable: "Customers" },
      { id: 2, path: "/drivers", lable: "Drivers" },
    ],
  },
];

const SideBar = ({ openMenu, setOpenMenu }) => {
  return (
    <Box
      sx={{
        transition: "0.2s",
        height: "100vh",
        width: {
          xs: openMenu ? "100%" : "0",
          sm: "30%",
          md: "20%",
        },
        display: {
          xs: openMenu ? "block" : "none",
          sm: "block",
        },
        position: "sticky",
        top: 0,
        left: 0,
        boxShadow: 3,
        bgcolor: "#fbfafa",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {menuItems.map((item) => (
        <Box key={item.id} onClick={() => setOpenMenu(false)}>
          {item.label && (
            <Typography
              component="p"
              sx={{
                color: "#8b8a8a",
                padding: "3px 15px",
                fontWeight: "light",
              }}
            >
              {item.label}
            </Typography>
          )}
          {item.sub_items.map((sub_item) => (
            <NavLink
              key={sub_item.id}
              className={"link"}
              to={sub_item.path}
              style={({ isActive }) => ({
                backgroundColor: isActive && "#e3e4e6",
                borderRadius: isActive && "5px",
              })}
            >
              {sub_item.lable}
            </NavLink>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default SideBar;
