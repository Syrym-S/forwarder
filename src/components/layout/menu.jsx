import React, { useState } from "react";
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
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import "./style.css";

export function SupportContacts() {
  const supportEmail = window?.APP_DATA?.support?.email;
  const supportPhone = window?.APP_DATA?.support?.phone;

  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async (event) => {
    event.stopPropagation();

    await navigator.clipboard.writeText(supportPhone);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 1,
        minWidth: 0,
      }}
    >
      <Tooltip title={supportEmail} placement="top" arrow>
        <Button
          component="a"
          href={`mailto:${supportEmail}?subject=${encodeURIComponent(
            "Обращение в поддержку",
          )}&body=${encodeURIComponent("Здравствуйте! У меня возник вопрос.")}`}
          sx={{
            boxShadow: 0,
            fontSize: 12,
            color: "rgb(82, 96, 121)",
            borderRadius: "8px",
            border: "solid 1px rgb(181, 186, 194)",
            fontWeight: 600,
            textTransform: "lowercase",

            "& .MuiButton-startIcon": {
              flexShrink: 0,
            },

            "&:hover": {
              border: "solid 1px rgb(49, 51, 54)",
            },
          }}
          startIcon={<MarkunreadOutlinedIcon />}
        >
          <Box
            component="span"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {supportEmail}
          </Box>
        </Button>
      </Tooltip>

      <Tooltip
        title={copied ? "Скопировано" : "Скопировать номер"}
        placement="top"
        arrow
        open={copied ? true : undefined}
      >
        <Button
          onClick={handleCopyPhone}
          sx={{
            boxShadow: 0,
            fontSize: 12,

            color: "rgb(82, 96, 121)",
            borderRadius: "8px",
            border: "solid 1px rgb(181, 186, 194)",
            fontWeight: 600,
            textTransform: "lowercase",

            "& .MuiButton-startIcon": {
              flexShrink: 0,
            },

            "&:hover": {
              border: "solid 1px rgb(49, 51, 54)",
            },
          }}
          startIcon={<PhoneOutlinedIcon />}
        >
          {supportPhone}
        </Button>
      </Tooltip>
    </Box>
  );
}

const menuItems = [
  {
    id: 1,
    label: null,
    sub_items: [
      {
        id: 1,
        path: "/",
        lable: "Главная",
        icon: (
          <RouteOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
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
        icon: (
          <LocalShippingOutlinedIcon
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text:
          "Созданные вами и заказчиками активные перевозки. Возможность создать лид",
      },
      {
        id: 2,
        path: "/history-leads",
        lable: "История перевозок",
        icon: (
          <HistoryOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
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
        icon: (
          <ReceiptLongOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "Скоро",
      },
      {
        id: 2,
        path: "/factorings",
        lable: "Факторинги",
        icon: (
          <AccountBalanceOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text:
          "Список факторингов, созданных вами, заказчиками и факторами. Возможность создать факторинг",
      },
      {
        id: 3,
        path: "/factoring-lines",
        lable: "Факторинговые компании",
        icon: (
          <HandshakeOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text:
          "Список факторинговых линий. Возможность создать факторинг линию",
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
        icon: (
          <GroupsOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "Список всех заказчиков",
      },
      {
        id: 2,
        path: "/drivers",
        lable: "Водители",
        icon: (
          <DriveEtaOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "Список всех водителей",
      },
    ],
  },
  {
    id: 5,
    label: "Аукционы",
    sub_items: [
      {
        id: 1,
        path: "/tender-applications",
        lable: "Аукционные заявки",
        icon: (
          <AssignmentOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "Список аукционов от заказчиков",
      },
      {
        id: 2,
        path: "/tender-forwarders",
        lable: "Аукционы перевозчиков",
        icon: (
          <RequestQuoteOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "Список аукционов, созданных вами",
      },
    ],
  },
];

const SideBar = ({ openMenu, setOpenMenu }) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgb(245, 247, 250)",
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
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 2,
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
                  fontSize: "1rem",
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
                    color: isActive && "rgb(24, 87, 196)",
                    backgroundColor: isActive && "rgba(24, 87, 196, 0.08)",
                    borderRadius: isActive && "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: 200,
                    letterSpacing: "0.075em",
                    fontSize: "0.9em",
                  })}
                >
                  {sub_item.icon} {sub_item.lable}
                </NavLink>
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          m: 2,
          padding: "20px",
          background: "rgba(226, 230, 238, 0.4)",
          border: "1px solid rgb(226, 230, 238)",
          borderRadius: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 600,
            color: "rgb(22, 36, 62)",
          }}
        >
          Нужна помощь?
        </Typography>
        <Typography
          sx={{
            fontWeight: "400",
            fontSize: 12,
          }}
        >
          Наша служба поддержки на связи 24/7
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1,
            py: 1,
          }}
        >
          <SupportContacts />
        </Box>
      </Box>
    </Box>
  );
};

export default SideBar;
