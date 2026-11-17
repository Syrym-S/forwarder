import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "rgb(24, 87, 196)",
    },

    text: {
      primary: "#172b4d",
      secondary: "#44546a",
    },

    divider: "rgba(100, 116, 139, 0.2)",

    font_color: {
      heading: "rgb(22,36,62)",
    },

    background: {
      main: "#2196f31a",
      slate: "rgba(148, 163, 184, 0.1)",
      default: "rgba(245, 247, 250, 0.7)",
      paper: "rgba(255, 255, 255, 0.82)",
    },

    DataGrid: {
      bg: "transparent",
      headerBg: "rgba(245, 247, 250, 0.8)",
      pinnedBg: "rgba(245, 247, 250, 0.94)",
    },

    color: {
      slate: "#94A3B8",
      slate_2: "#475569",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100dvh",
          backgroundColor: "#f7f8fa",
          isolation: "isolate",
        },
        "#root": {
          minHeight: "100dvh",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(12px) saturate(115%)",
          WebkitBackdropFilter: "blur(12px) saturate(115%)",
        },
        rounded: {
          borderRadius: 12,
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.72)",
          boxShadow: "0 8px 28px rgba(22, 36, 62, 0.06)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255, 255, 255, 0.94)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        },
      },
    },
  },
});
