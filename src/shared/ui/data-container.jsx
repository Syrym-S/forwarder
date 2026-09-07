import RootLayout from "../../components/layout/root-layout";
import PageLoader from "./loaders/page-loader";

const DataContainer = ({ isLoading, children }) => {
  if (isLoading) return <PageLoader />;
  return <>{children}</>;
};

export default DataContainer;
