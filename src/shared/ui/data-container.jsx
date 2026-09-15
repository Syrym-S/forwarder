import { Alert } from "@mui/material";
import PageLoader from "./loaders/page-loader";

const DataContainer = ({
  isLoading,
  isEmpty,
  emptyText = "Список пуст",
  children,
}) => {
  if (isLoading) return <PageLoader />;
  return (
    <>
      {isEmpty ? (
        <Alert
          severity="info"
          sx={{
            my: 1,
          }}
        >
          {emptyText}
        </Alert>
      ) : (
        children
      )}
    </>
  );
};

export default DataContainer;
