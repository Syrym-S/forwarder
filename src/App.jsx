import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/router";
import { AppInitializer } from "./app/router/app-init";
import { useEffect, useState } from "react";
import AgreementInfo from "./shared/ui/agreement-modal";
import { getContractStatusApi } from "./app/store/agreement/api";

function App() {
  const [isContractSigned, setIsContractSigned] = useState(false);

  const getContractStatus = async () => {
    try {
      const response = await getContractStatusApi();

      const data = response.data;

      setIsContractSigned(data.signed);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getContractStatus();
  }, []);

  // if (!isContractSigned) return <AgreementInfo openModal={!isContractSigned} />;

  return (
    <>
      <RouterProvider router={router} />
      <AppInitializer />
    </>
  );
}

export default App;
