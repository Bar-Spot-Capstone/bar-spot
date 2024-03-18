import { useSelector } from "react-redux";
import { Rootstate } from "../state/store";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

interface Props {
  isLoggedIn: boolean;
}

const NavBadge = ({ isLoggedIn }: Props) => {
  const username = useSelector((state: Rootstate) => state.user.username);

  if (isLoggedIn == true) {
    return <p className="my-auto"> Logged in as: {username}</p>;
  } else {
    return (
      <Link to={"/login"}>
        <Button variant="secondary">
          Login
        </Button>
      </Link>
    );
  }
};

export default NavBadge;
