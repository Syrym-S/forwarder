import { Alert, AlertTitle, Typography } from "@mui/material";
import React from "react";
import RootLayout from "../../components/layout/root-layout";
import { useTranslation } from "react-i18next";

const Account = () => {
  const { t } = useTranslation();
  return <RootLayout>{t("ui.account")}</RootLayout>;
};

export default Account;
