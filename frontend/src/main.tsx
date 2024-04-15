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

const router = createBrowserRouter([
  {
    path: "/bar-spot/frontend/",
    element: <Home />,
    children: [
      {
        path: "/bar-spot/frontend/",
        element:<MapView/>,
      },
      {
        path: "/bar-spot/frontend/profile",
        element: <Profile />,
      }
    ],
  },
  {
    path: "/bar-spot/frontend/login",
    element: <Login />,
  },
  {
    path: "/bar-spot/frontend/sign-up",
    element: <CreateNewAcc />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
