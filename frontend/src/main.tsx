import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import Login from "./pages/Login.tsx";
import CreateNewAcc from "./pages/CreateNewAcc.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <CreateNewAcc />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
