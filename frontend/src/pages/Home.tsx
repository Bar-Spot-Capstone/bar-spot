
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import {  useSelector } from "react-redux";

import { Rootstate } from "../state/store";

const Home = () => {
  const login = useSelector((state: Rootstate) => state.user.isLoggedIn);

  return (
    <>
      
      <NavBar isLoggedIn={login} />
        <div id="view">
          <Outlet />
        </div>
    </>
  );
};

export default Home;
