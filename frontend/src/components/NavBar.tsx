import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/Bar-Spot-Translucent-Logo.png";
import { Link } from "react-router-dom";
import NavBadge from "./NavBadge";
import { useSelector } from "react-redux";
import { Rootstate } from "../state/store";
import { Button, NavDropdown } from "react-bootstrap";


const NavBar = () => {
  const isLoggedIn: boolean = useSelector(
    (state: Rootstate) => state.user.isLoggedIn
  );
  return (
    <Navbar expand="md" className="bg-secondary-subtle">
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
        <Navbar.Collapse className="justify-content-end me-3">
          <NavDropdown
            title="Dropdown"
            id="basic-nav-dropdown"
            className="me-3"
          >
            
            <NavDropdown.Divider />
            <Link to="/profile">
              <Button variant="link">Profile</Button>
            </Link>
          </NavDropdown>

          <NavBadge isLoggedIn={isLoggedIn} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
