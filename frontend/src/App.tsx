import { Routes, Route } from "react-router-dom"
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={< Register />} />
      </Routes>
    </div>
  );
};

export default App;
