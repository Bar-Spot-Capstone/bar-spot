import "./App.css";
import Login from "./components/Login";
import { Fragment, useState } from "react";
const App = () => {
  const [page, setPage] = useState<string>("login");
  const handleOnNewAcc = () =>{ 
    setPage("CreateAcc");
  }
  return (
    <Fragment>
      {page == "login" && <Login onNewAcc={handleOnNewAcc}/>}
    </Fragment>
  );
};

export default App;
