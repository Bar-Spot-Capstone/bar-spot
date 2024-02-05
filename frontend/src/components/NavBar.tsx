import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import Logo from "../assets/Bar-Spot-Translucent-Logo.png";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar expand="md">
      <Container>
        <Link to="/">
          <Navbar.Brand href="#home">
            <img
              src={Logo}
              width="100"
              height="50"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <Link to="/login">Oscar Comunidad</Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
