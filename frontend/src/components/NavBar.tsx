import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rootstate } from "../state/store";
import { createGroup } from "./Group"; //imported from Group.tsx
import { useState, useEffect } from "react";
import { NavDropdown, Modal, Container, Navbar, Badge, Form } from "react-bootstrap";
import { MdCheckCircle } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import Logo from "../assets/Bar-Spot-Translucent-Logo.png";
import NavBadge from "./NavBadge";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../styles/NavBar.css"

const NavBar = () => {
  const isLoggedIn: boolean = useSelector((state: Rootstate) => state.user.isLoggedIn);
  const userId: number = useSelector((state: Rootstate) => state.user.userId);
  const [invitation, setInvites] = useState<number>(0);
  const [inviteShow, setInviteShow] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [creationView, setCreateView] = useState<boolean>(false);// for switching views
  const [groupName, setGroupName] = useState<string>("");// for group name
  const [usersList, setUsersList] = useState<Array<Object>>([]);// for fetching all users
  const [invitedMembers, setInvitedMembers] = useState<Array<object>>([]);// for storing invited members
  const [invitationsFetched, setInvitationsFetched] = useState<Array<any>>([]);// for storing invites that were fetched 

  /*Used to refresh upon new invites*/
  useEffect(() => {
    fetchInvites();
  }, []);

  /*
  @params: userId -> fetchs the invites that a user has
  */
  const fetchInvites = async () => {
    try {
      if (!userId) {
        console.log("No userId provided");
      }

      const options: object = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      };

      const response: Response = await fetch(`http://localhost:3001/invite/${userId}`, options);

      if (!response.ok) {
        const res: any = await response.json();
        console.log(`Response was not okay with message: ${res.error}`);
        return;
      };

      const res: any = await response.json();
      setInvites(res.invitesFormatted.length);
      //Now need to store all invites into useState
      let filterInvites: Array<Object> = []
      for (let i = 0; i < res.invitesFormatted.length; i++) {
        filterInvites.push({
          ownerName: res.invitesFormatted[i].ownerName,
          id: res.invitesFormatted[i].id,
          status: res.invitesFormatted[i].status,
          groupId: res.invitesFormatted[i].groupId,
          groupName: res.invitesFormatted[i].groupName,
          numberOfMembers: res.invitesFormatted[i].numberOfMembers
        });
      };
      setInvitationsFetched(filterInvites);//update
      return;
    }
    catch (error: any) {
      console.log(`Failed to fetch invites for user with error: ${error}`);
    };
  };

  /*
  @breif: Rejects the invite to the user or accepts the invite to the user, making the user join a group and removes all other invites
  @param: user response -> true === accept invite || false === reject invite
  @param: groupId -> id of group to respond to
  */
  const inviteResponse = async (userRes: boolean, groupdId: number) => {
    if (!userId || userId < 1) {
      console.log("UserId not found");
      return;
    };

    try {
      if (userRes) {
        //User accepts the invite - Most likely have to update the slice
        const options: object = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: userId,
            groupId: groupdId,
            response: userRes
          })
        };

        const response: Response = await fetch('http://localhost:3001/invite/respond', options);

        if (!response.ok) {
          const res: any = await response.json();
          console.log(`Response was not okay with message: ${res.error}`);
          return;
        };

        //Invite has been accepted -> Most like have to update the slice to update this groupId
        const res: any = await response.json();
        console.log(res);
        fetchInvites();//refresh invites page
        return;

      }
      //Else the user wants to reject invite
      const options: object = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          groupId: groupdId,
          response: userRes
        })
      };

      const response: Response = await fetch('http://localhost:3001/invite/respond', options);

      if (!response.ok) {
        const res: any = await response.json();
        console.log(`Response was not okay with message: ${res.error}`);
        return;
      };

      const res: any = await response.json();
      console.log(res);
      fetchInvites();//refresh invites page
      return;
    }
    catch (error: any) {
      console.log(`Failed to fetch invites for user with error: ${error}`);
    };
  };

  const handleGroupCreationSubmit = async (event: any) => {
    /*Creates group based on input name and possible invited members*/
    //invited members is a list of user information
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
        console.log(`Response was not okay with message: ${res.error}`);
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
              <h6 className="m-1">Profile</h6>
            </Link>

            <NavDropdown.Divider />
            <h6 className="m-1" onClick={() => setShow(true)} style={{ cursor: "pointer" }}>
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
                  <button className="btn btn-primary" onClick={() => { setShow(!show); setInviteShow(!inviteShow); }}>
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
            {/*Model for invitation page*/}
            <Modal show={inviteShow} onHide={() => setInviteShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Invitations</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex">
                <div className="container-fluid">
                  <div className="row">
                    <table className="table col-12 table-responsive table-hover table-sm mb-4">
                      <thead>
                        <tr className="table-primary">
                          <th scope="col">Name</th>
                          <th scope="col">Owner</th>
                          <th scope="col"># Members</th>
                          <th scope="col">Confirm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invitationsFetched.map(invite => (
                          <tr key={invite.id}>
                            <td>{invite.groupName}</td>
                            <td>{invite.ownerName}</td>
                            <td>{invite.numberOfMembers}</td>
                            <td className="d-flex justify-content-evenly">
                              <button onClick={() => { inviteResponse(true, invite.groupId) }} type="button" className="btn btn-success btn-sm"><MdCheckCircle /></button>
                              <button onClick={() => { inviteResponse(false, invite.groupId) }} type="button" className="btn btn-danger btn-sm"><MdCancel /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <div className="me-5">
                  <button className="btn btn-primary btn-transition" onClick={() => { setInviteShow(!inviteShow); setShow(!show); }}>
                    Back
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary btn-transition" onClick={() => setInviteShow(!inviteShow)}>
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
