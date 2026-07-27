import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import "./style.css";

const menuItems = [
  {
    id: 1,
    label: null,
    sub_items: [
      {
        id: 1,
        path: "/",
        lable: "Маршруты",
        tooltip_text: "Отображение всех маршрутов на карте",
      },
    ],
  },
  {
    id: 2,
    label: "Перевозки",
    sub_items: [
      {
        id: 1,
        path: "/active-leads",
        lable: "Активные перевозки",
        tooltip_text:
          "Созданные вами и заказчиками активные перевозки. Возможность создать лид",
      },
      {
        id: 2,
        path: "/history-leads",
        lable: "История перевозок",
        tooltip_text: "Список завершённых и удалённых перевозок",
      },
    ],
  },
  {
    id: 3,
    label: "Финансы",
    sub_items: [
      { id: 1, path: "/account", lable: "Счёт", tooltip_text: "Скоро" },
      {
        id: 2,
        path: "/factorings",
        lable: "Факторинги",
        tooltip_text:
          "Список факторингов, созданных вами, заказчиками и факторами. Возможность создать факторинг",
      },
      { id: 3, path: "/factor", lable: "Фактор", tooltip_text: "Скоро" },
    ],
  },
  {
    id: 4,
    label: "Каталог",
    sub_items: [
      {
        id: 1,
        path: "/customers",
        lable: "Заказчики",
        tooltip_text: "Список всех заказчиков",
      },
      {
        id: 2,
        path: "/drivers",
        lable: "Водители",
        tooltip_text: "Список всех водителей",
      },
    ],
  },
  {
    id: 5,
    label: "Тендера",
    sub_items: [
      {
        id: 1,
        path: "/tender-applications",
        lable: "Тендерные заявки",
        tooltip_text: "Список тендеров от заказчиков",
      },
      {
        id: 2,
        path: "/tender-forwarders",
        lable: "Тендеры перевозчиков",
        tooltip_text: "Список тендеров, созданных вами",
      },
    ],
  },
];

const SideBar = ({ openMenu, setOpenMenu }) => {
  return (
    <Box
      sx={{
        pt: 1,
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
            <Tooltip title={sub_item.tooltip_text} disableInteractive>
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
            </Tooltip>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default SideBar;
