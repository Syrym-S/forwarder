import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/router";
import { AppInitializer } from "./app/router/app-init";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AppInitializer />
    </>
  );
}

export default App;
