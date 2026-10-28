import ReactDOM from "react-dom/client";
import { CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";
import {
  createBrowserRouter,
  redirectDocument,
  RouterProvider,
} from "react-router-dom";
import SharedLeadApp from "./shared-lead/shared-lead-app";
import { getSharedLeadApi } from "./shared-lead/api/index.api";
import ErrorPage from "../../src/pages/error";
import { theme } from "../../src/app/theme/theme";
import { isStaging } from "../../src/app/client";
import "../../src/leaflet-icon";
import "../../src/index.css";

const loadSharedLead = async ({ params }) => {
  let response;

  try {
    response = await getSharedLeadApi(params.leadId, params.token);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Response(null, { status: 404 });
    }

    throw error;
  }

  if (!response.data?.data) {
    throw new Response(null, { status: 404 });
  }

  return response.data.data;
};

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorPage />
      </ThemeProvider>
    ),
    hydrateFallbackElement: <CircularProgress />,
    children: [
      {
        index: true,
        loader: () =>
          redirectDocument(isStaging ? "/staging/forwarder" : "/forwarder"),
      },
      ...["shared/:leadId/:token", "staging/shared/:leadId/:token"].map(
        (path) => ({
          path,
          element: <SharedLeadApp />,
          loader: loadSharedLead,
        }),
      ),
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
