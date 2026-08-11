import React from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import HandshakeOutlined from "@mui/icons-material/HandshakeOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import DriveEtaOutlined from "@mui/icons-material/DriveEtaOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import RequestQuoteOutlined from "@mui/icons-material/RequestQuoteOutlined";
import RouteOutlined from "@mui/icons-material/RouteOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
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
        icon: <RouteOutlined />,
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
        icon: <LocalShippingOutlinedIcon />,
        tooltip_text:
          "Созданные вами и заказчиками активные перевозки. Возможность создать лид",
      },
      {
        id: 2,
        path: "/history-leads",
        lable: "История перевозок",
        icon: <HistoryOutlined />,
        tooltip_text: "Список завершённых и удалённых перевозок",
      },
    ],
  },
  {
    id: 3,
    label: "Финансы",
    sub_items: [
      {
        id: 1,
        path: "/account",
        lable: "Счёт",
        icon: <ReceiptLongOutlined />,
        tooltip_text: "Скоро",
      },
      {
        id: 2,
        path: "/factorings",
        lable: "Факторинги",
        icon: <AccountBalanceOutlined />,
        tooltip_text:
          "Список факторингов, созданных вами, заказчиками и факторами. Возможность создать факторинг",
      },
      {
        id: 3,
        path: "/factor",
        lable: "Фактор",
        icon: <HandshakeOutlined />,
        tooltip_text: "Скоро",
      },
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
        icon: <GroupsOutlined />,
        tooltip_text: "Список всех заказчиков",
      },
      {
        id: 2,
        path: "/drivers",
        lable: "Водители",
        icon: <DriveEtaOutlined />,
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
        icon: <AssignmentOutlined />,
        tooltip_text: "Список тендеров от заказчиков",
      },
      {
        id: 2,
        path: "/tender-forwarders",
        lable: "Тендеры перевозчиков",
        icon: <RequestQuoteOutlined />,
        tooltip_text: "Список тендеров, созданных вами",
      },
    ],
  },
];

const SideBar = ({ openMenu, setOpenMenu }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        pt: 8,
        transition: "0.2s",
        overflowY: "auto",
        width: {
          xs: openMenu ? "100%" : "0",
          sm: "20vw",
        },
        display: {
          xs: openMenu ? "flex" : "none",
          sm: "flex",
        },
        position: "fixed",
        top: 0,
        left: 0,
        // bgcolor: "#fbfafa",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 1,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box>
        {menuItems.map((item) => (
          <Box key={item.id} onClick={() => setOpenMenu(false)}>
            {item.label && (
              <Typography
                component="p"
                sx={{
                  color: "#2b2a2a",
                  padding: "3px 15px",
                  fontWeight: "light",
                  letterSpacing: "0.1em",
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
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: 200,
                    letterSpacing: "0.075em",
                  })}
                >
                  {sub_item.icon} {sub_item.lable}
                </NavLink>
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SideBar;
