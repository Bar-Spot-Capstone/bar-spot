import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rootstate } from "../state/store";
import { Button, NavDropdown, Modal, Container, Navbar, Badge } from "react-bootstrap";
import { useState } from "react";
import Logo from "../assets/Bar-Spot-Translucent-Logo.png";
import NavBadge from "./NavBadge";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../styles/NavBar.css"

const NavBar = () => {
  const isLoggedIn: boolean = useSelector((state: Rootstate) => state.user.isLoggedIn);
  const [invitation, setInvites] = useState<Number>(0);
  const [show, setShow] = useState<boolean>(false);

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

            <NavDropdown.Divider />
            <h6 className="m-1" onClick={() => setShow(true)}>
              Group
            </h6>
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Group Options</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex justify-content-around">
                <div>
                  <button className="btn btn-primary" onClick={() => setShow(false)}>
                    Create
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={() => setShow(false)}>
                    Join
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={() => setInvites(invitation + 1)}>
                    Invites <Badge bg="danger">{invitation}</Badge>
                  </button>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <div>
                  <button className="btn btn-primary close-btn" onClick={() => setShow(false)}>
                    Close
                  </button>
                </div>
              </Modal.Footer>
            </Modal>
          </NavDropdown>
          <NavBadge isLoggedIn={isLoggedIn} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
