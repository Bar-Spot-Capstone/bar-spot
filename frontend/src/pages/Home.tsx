import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";


const Home = () => {
  return (
    <>
      <NavBar />
      <div id="view">
        <Outlet />
      </div>
    </>
  );
};

export default Home;
