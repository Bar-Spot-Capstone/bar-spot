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




const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <CreateNewAcc />,
      },
      {
        path: "/profile",
        element: <Profile />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
