import { useTranslation } from "react-i18next";
import { Alert } from "@mui/material";
import PageLoader from "./loaders/page-loader";

const DataContainer = ({
  isLoading,
  isEmpty,
  emptyText,
  loadingFallback = <PageLoader />,
  children,
}) => {
  const { t } = useTranslation();
  if (isLoading) return loadingFallback;
  return (
    <>
      {isEmpty ? (
        <Alert
          severity="info"
          sx={{
            my: 1,
          }}
        >
          {emptyText ?? t("ui.list_empty")}
        </Alert>
      ) : (
        children
      )}
    </>
  );
};

export default DataContainer;
