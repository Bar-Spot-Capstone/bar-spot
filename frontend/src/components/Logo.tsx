import logo from "../assets/Bar-Spot-Translucent-Logo.png";
import Row from "react-bootstrap/Row";
const Logo = () => {
  return (
    <>
      <Row>
        <div className="d-flex d-md-none d-sm-inline-flex justify-content-center ">
          <img src={logo} className="w-50"></img>
        </div>
        <div className="d-flex d-none d-md-inline-flex justify-content-center ">
          <img src={logo} className="w-25"></img>
        </div>
      </Row>
    </>
  );
};

export default Logo;
