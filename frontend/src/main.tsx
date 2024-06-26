import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import CreateNewAcc from "./pages/CreateNewAcc.tsx";
import Profile from "./pages/Profile.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./state/store";
import { Provider } from "react-redux";
import MapView from "./pages/MapView.tsx";
import BarChaining from "./pages/BarChaining.tsx";
import QuickInfo from "./components/QuickInfo.tsx";
import '@fontsource-variable/manrope';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/",
          element: <MapView />,
          children: [
            {
              path: "/",
              element: <QuickInfo />,
            },
            {
              path: "/bar-chain",
              element: <BarChaining />,
            },
          ],
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <CreateNewAcc />,
    },
  ],
  { basename: '/bar-spot/' }
);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
