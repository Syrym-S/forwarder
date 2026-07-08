import React from "react";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import "./style.css";

const menuItems = [
  { id: 1, label: null, sub_items: [{ id: 1, path: "/", lable: "Маршруты" }] },
  {
    id: 2,
    label: "Перевозки",
    sub_items: [
      { id: 1, path: "/active-leads", lable: "Активные перевозки" },
      { id: 2, path: "/history-leads", lable: "История перевозок" },
    ],
  },
  {
    id: 3,
    label: "Финансы",
    sub_items: [
      { id: 1, path: "/account", lable: "Account" },
      { id: 2, path: "/factorings", lable: "Факторинги" },
    ],
  },
  {
    id: 4,
    label: "Каталог",
    sub_items: [
      { id: 1, path: "/customers", lable: "Заказщики" },
      { id: 2, path: "/drivers", lable: "Водители" },
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
        height: "100vh",
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
