import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../assets/Bar-Spot-Translucent-Logo.png";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar expand="md">
      <Container>
        <Link to="/">
          <Navbar.Brand>
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
        <Navbar.Collapse className="justify-content-end my-2">

        <NavDropdown title="Dropdown" id="basic-nav-dropdown" className="me-3">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
            <Link to={"/login"}>
            Test
            </Link>
            </NavDropdown.Item>
          </NavDropdown>

          <Navbar.Text>
            Signed in as: <Link to="/login">Oscar Comunidad</Link>
          </Navbar.Text>

          

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
