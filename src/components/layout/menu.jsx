import React from "react";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
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
  {
    id: 5,
    label: "Тендера",
    sub_items: [
      { id: 1, path: "/tender-applications", lable: "Тендерные заявки" },
      { id: 2, path: "/tender-forwarders", lable: "Тендера перевозчиков" },
    ],
  },
];

const SideBar = ({ openMenu, setOpenMenu }) => {
  return (
    <Box
      sx={{
        transition: "0.2s",
        paddingTop: "10vh",
        height: "90vh",
        overflowY: "auto",
        width: {
          xs: openMenu ? "100%" : "0",
          sm: "20vw",
        },
        display: {
          xs: openMenu ? "block" : "none",
          sm: "block",
        },
        position: {
          xs: "fixed",
        },
        top: "10vh",
        left: 0,
        boxShadow: 3,
        bgcolor: "#fbfafa",
        flexDirection: "column",
        zIndex: 1,
      }}
    >
      {menuItems.map((item) => (
        <Box key={item.id} onClick={() => setOpenMenu(false)}>
          {item.label && (
            <Typography
              component="p"
              sx={{
                color: "color.slate",
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
