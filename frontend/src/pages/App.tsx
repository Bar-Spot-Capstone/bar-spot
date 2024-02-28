import { useState } from "react";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const App = () => {
  const [login, setLogin] = useState<boolean>(false);


  return (
    <>
      <NavBar isLoggedIn={login} />
      <div id="view">
        <Outlet />
      </div>
    </>
  );
};

export default App;
