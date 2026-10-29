import { useState } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import HandshakeOutlined from "@mui/icons-material/HandshakeOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import DriveEtaOutlined from "@mui/icons-material/DriveEtaOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import RequestQuoteOutlined from "@mui/icons-material/RequestQuoteOutlined";
import RouteOutlined from "@mui/icons-material/RouteOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import "./style.css";
import { useTranslation } from "react-i18next";

export function SupportContacts() {
  const { t } = useTranslation();
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
            t("support_request_subject"),
          )}&body=${encodeURIComponent(t("support_request_body"))}`}
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
        title={copied ? t("copied") : t("copy_number")}
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
        lable: "menu.home_page",
        icon: (
          <RouteOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "map_routes_tooltip",
      },
    ],
  },
  {
    id: 2,
    label: "menu.leads",
    sub_items: [
      {
        id: 1,
        path: "/active-leads",
        lable: "menu.active_leads",
        icon: (
          <LocalShippingOutlinedIcon
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "active_leads_tooltip",
      },
      {
        id: 4,
        path: "/history-leads",
        lable: "menu.lead_history",
        icon: (
          <HistoryOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "lead_history_tooltip",
      },
    ],
  },
  {
    id: 3,
    label: "menu.finances",
    sub_items: [
      // {
      //   id: 1,
      //   path: "/account",
      //   lable: "Счёт",
      //   icon: (
      //     <ReceiptLongOutlined
      //       sx={{
      //         fontSize: "1.1rem",
      //       }}
      //     />
      //   ),
      //   tooltip_text: "Скоро",
      // },
      {
        id: 2,
        path: "/factorings",
        lable: "menu.factorings",
        icon: (
          <AccountBalanceOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "factorings_tooltip",
      },
      {
        id: 3,
        path: "/factoring-lines",
        lable: "menu.factoring_companies",
        icon: (
          <HandshakeOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "factoring_lines_tooltip",
      },
    ],
  },
  {
    id: 4,
    label: "menu.catalog",
    sub_items: [
      {
        id: 1,
        path: "/customers",
        lable: "menu.customers",
        icon: (
          <GroupsOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "customers_tooltip",
      },
      {
        id: 2,
        path: "/drivers",
        lable: "menu.drivers",
        icon: (
          <DriveEtaOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "drivers_tooltip",
      },
      {
        id: 3,
        path: "/handbook",
        lable: "menu.commodity_directory",
        icon: (
          <LibraryBooksOutlinedIcon
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "menu.commodity_directory",
      },
    ],
  },
  {
    id: 5,
    label: "menu.auctions",
    sub_items: [
      {
        id: 1,
        path: "/tender-applications",
        lable: "menu.auction_requests",
        icon: (
          <AssignmentOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "customer_auctions_tooltip",
      },
      {
        id: 2,
        path: "/tender-forwarders",
        lable: "menu.carrier_auctions",
        icon: (
          <RequestQuoteOutlined
            sx={{
              fontSize: "1.1rem",
            }}
          />
        ),
        tooltip_text: "your_auctions_tooltip",
      },
    ],
  },
];

const SideBar = ({ openMenu, setOpenMenu }) => {
  const { t } = useTranslation();

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
                {t(item.label)}
              </Typography>
            )}
            {item.sub_items.map((sub_item) => (
              <Tooltip
                key={sub_item.id}
                title={t(sub_item.tooltip_text)}
                disableInteractive
              >
                <NavLink
                  className={"link"}
                  to={sub_item.path}
                  style={({ isActive }) => ({
                    color: isActive && "primary.main",
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
                  {sub_item.icon} {t(sub_item.lable)}
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
          {t("need_help")}
        </Typography>
        <Typography
          sx={{
            fontWeight: "400",
            fontSize: 12,
          }}
        >
          {t("support_availability")}
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
