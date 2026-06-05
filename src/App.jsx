import { useState } from "react";
import Header from "./components/layout/header";
import Sidebar from "./components/layout/menu";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRouter from "./app/router/app-router";
import { Box } from "@mui/material";
import RootLayout from "./components/layout/root-layout";

function App() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <BrowserRouter basename="/forwarder">
      <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />

      <Box style={{ display: "flex", width: "100%" }}>
        <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <AppRouter />
      </Box>
    </BrowserRouter>
  );
}

export default App;
