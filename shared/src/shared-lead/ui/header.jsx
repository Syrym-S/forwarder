import Box from "@mui/material/Box";
import { AppBar, Button, Tooltip } from "@mui/material";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useState } from "react";
import logo from "@assets/logo.png";

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
        display: "flex",
        gap: 1,
        minWidth: 0,
      }}
    >
      <Tooltip title={supportEmail} placement="top" arrow>
        <Button
          color="primary"
          variant="contained"
          component="a"
          href={`mailto:${supportEmail}?subject=${encodeURIComponent(
            "Обращение в поддержку",
          )}&body=${encodeURIComponent("Здравствуйте! У меня возник вопрос.")}`}
          sx={{
            boxShadow: 0,
            fontSize: 10,

            "& .MuiButton-startIcon": {
              flexShrink: 0,
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
          color="primary"
          variant="contained"
          onClick={handleCopyPhone}
          sx={{
            boxShadow: 0,
            fontSize: 10,
          }}
          startIcon={<PhoneOutlinedIcon />}
        >
          {supportPhone}
        </Button>
      </Tooltip>
    </Box>
  );
}

const Header = () => {
  return (
    <AppBar
      position="sticky"
      display="flex"
      sx={{
        top: 0,
        left: 0,
        height: 56,
        color: "#000000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        backgroundColor: "background.default",
        zIndex: 2,
        boxShadow: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <Box
          component="img"
          alt="Driver"
          src={logo}
          sx={{
            height: 32,
            width: "auto",
            maxWidth: 150,
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>

      <SupportContacts />
    </AppBar>
  );
};

export default Header;
