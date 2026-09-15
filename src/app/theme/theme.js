import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "rgb(24, 87, 196)",
    },

    font_color: {
      heading: "rgb(22,36,62)",
    },

    background: {
      main: "#2196f31a",
      slate: "rgba(148, 163, 184, 0.1)",
      default: "#f5f7fa",
      paper: "#ffffff",
    },

    color: {
      slate: "#94A3B8",
      slate_2: "#475569",
    },
  },
});
