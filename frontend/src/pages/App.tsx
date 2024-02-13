import { Routes, Route } from "react-router-dom"
import Login from "./Login";
import Register from "./Register";

const App = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={< Register/>} />
      </Routes>
    </div>
  );
};

export default App;
