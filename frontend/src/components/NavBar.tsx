import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rootstate } from "../state/store";
import { createGroup } from "./Group";
import { useState } from "react";
import { Button, NavDropdown, Modal, Container, Navbar, Badge, Form } from "react-bootstrap";
import Logo from "../assets/Bar-Spot-Translucent-Logo.png";
import NavBadge from "./NavBadge";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../styles/NavBar.css"

const NavBar = () => {
  const isLoggedIn: boolean = useSelector((state: Rootstate) => state.user.isLoggedIn);
  const userId: number = useSelector((state: Rootstate) => state.user.userId);
  const [invitation, setInvites] = useState<Number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [creationView, setCreateView] = useState<boolean>(false);// for switching views
  const [groupName, setGroupName] = useState<string>("");// for group name
  const [usersList, setUsersList] = useState<Array<Object>>([]);// for fetching all users
  const [invitedMembers, setInvitedMembers] = useState<Array<object>>([]);// for storing invited members

  const handleGroupCreationSubmit = async (event: any) => {
    /*Creates group based on input name and possible invited members*/
    event.preventDefault();
    if (!groupName) {
      alert('No group name');
      return;
    };
    await createGroup(groupName, invitedMembers, userId);
  };

  const fetchAllOtherUsers = async () => {
    try {
      if (!userId || userId < 1) {
        console.log("UserId not found");
        return;
      };

      const options: object = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      };

      const response: Response = await fetch(`http://localhost:3001/user/all/${userId}`, options);

      if (!response.ok) {
        const res: any = await response.json();
        console.log(`Response was not okay with message: ${res}`);
        return;
      };

      const res: any = await response.json();
      setUsersList(res.users_list);
      return;
    }
    catch (error: any) {
      console.log(`Error failed to get other users with error: ${error}`);
    };
  };

  const handleUserSelect = (event: any) => {
    if (!event.target.value || event.target.value === 'Select users to invite') {
      return;
    };

    const userInfo: Array<string> = (event.target.value).split(':');
    const userId = parseInt(userInfo[0]);

    // Check if the user is already in invitedMembers
    const isAlreadyInvited = invitedMembers.some((user: any) => user.id === userId);

    // Find the user in usersList
    const user = usersList.find((user: any) => user.id === userId);

    if (user) {
      if (isAlreadyInvited) {
        // Remove the user from invitedMembers
        setInvitedMembers(invitedMembers.filter((user: any) => user.id !== userId));
      } else {
        // Add the user to invitedMembers
        setInvitedMembers([...invitedMembers, user]);
      }
    };
  };

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
            {/*Model for group options*/}
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Group Options</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex justify-content-center gap-5">
                <div>
                  <button className="btn btn-primary" onClick={() => {
                    setShow(!show);
                    setCreateView(!creationView);
                  }}>
                    Create
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
            {/*Model for group creation*/}
            <Modal show={creationView} onHide={() => setCreateView(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Create Group</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex">
                <div className="container-fluid">
                  {/*Options for group creation read-in as a form*/}
                  <form className="d-flex flex-column" onSubmit={handleGroupCreationSubmit}>
                    <div className="form-group pb-4">
                      <label className="pb-1">Group name</label>
                      <input onChange={(event) => { setGroupName(event.target.value) }} className="form-control" type="text" placeholder="Name of group" />
                    </div>
                    <div className="form-group pb-3">
                      <label className="pb-1">Add Some People</label>
                      <Form.Select onClick={fetchAllOtherUsers} onChange={handleUserSelect}>
                        <option>Select users to invite</option>
                        {usersList && usersList.length > 0 ? (
                          usersList.map((user: any, index) => (
                            <option key={user.id} value={`${user.id}:${user.username}`}>{user.username}</option>
                          ))
                        ) : (
                          null
                        )}
                      </Form.Select>
                    </div>
                    <div className="group-members pb-4">
                      <label className="pb-1">Selected members</label>
                      <input
                        className="form-control"
                        type="text"
                        value={invitedMembers.map((user: any) => user.username).join(', ')}
                        readOnly
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </form>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <div className="me-5">
                  <button className="btn btn-primary btn-transition" onClick={() => { setCreateView(!creationView); setShow(!show); }}>
                    Back
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary btn-transition" onClick={() => setCreateView(!creationView)}>
                    Cancel
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
