import "./App.css"
import CreateNewAcc from "./components/CreateNewAcc";
import Login from "./components/Login";
import { Fragment, useState } from "react";

const App = () => {
  const [page, setPage] = useState<string>("login");

  const handleOnNewAcc = () => {
    setPage("createAcc");
  };
  const handleOnLogin = () => {
    setPage("login");
  };

  if (page == "login") {
    return (
      <Fragment>
        <Login onNewAcc={handleOnNewAcc} />
      </Fragment>
    );
  } else if (page == "createAcc") {
    return (
      <Fragment>
        <CreateNewAcc onLogin={handleOnLogin} />
      </Fragment>
    );
  } else {
    return <h1>Error 404 Page Not Found</h1>;
  }
};

export default App;
