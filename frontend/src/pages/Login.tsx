import Logo from "../components/Logo";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import FormInput from "../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, setUsername, setUserID, setEmail } from "../state/slices/userSlice";
import AlertBadge from "../components/AlertBadge";


interface loginData {
  email: string;
  password: string;
}

const Login = () => {
  //Hooks
  const [data, setData] = useState<loginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //updates the data everytime there is a change to the input fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  //click handler for the login button
  const handleLogin = () => {
    setError(false);
    callLogin();
  };

  // @param => number
  // returns void
  // if status # == 200 then there is no error and we can anvigate to home page
  // else sets error to true
  const loadPage = (status: number) => {
    if (status == 200) {
      setError(false);
    } else {
      setError(true);
    }
  };

  // @param => none
  // returns error || none
  // fetch request for login endpoint, if successful, stores necessary info and sets user as actively logged in
  // else returns 400 error code
  const callLogin = async (): Promise<any> => {
    try {
      const response = await fetch("http://localhost:3001/user/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setError(false);

        const res = response.json();
        //console.log(res);
        loadPage(response.status);

        dispatch(login());

        res.then((userInfo) => {
          //console.log("Data: ", userInfo);

          dispatch(setUsername(userInfo.username));
          dispatch(setEmail(userInfo.email));
          dispatch(setUserID(userInfo.user_id));
        });

        navigate("/");
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(true);
    }
  };

  return (
    <div className="vh-100 ">
      <Container className="my-5">
        <Logo />

        <AlertBadge
          text="ALERT! Incorrect Password or E-mail!"
          active={error}
          variant="danger"
        ></AlertBadge>

        <FormInput
          lable="Email"
          type="email"
          placeholder="johndoe@example.com"
          name="email"
          value={data.email}
          handler={handleInputChange}
        />

        <FormInput
          lable="Password"
          type="password"
          placeholder="password"
          name="password"
          value={data.password}
          handler={handleInputChange}
        />

        <Row className="justify-content-lg-center mx-lg-5 my-2">
          <Col lg="6">
            <Link to="/sign-up">
              <Button variant="link" size="sm">
                Create new account
              </Button>
            </Link>
            <Link to="/">
              <Button variant="link" size="sm">
                Reset Password
              </Button>
            </Link>
          </Col>
        </Row>

        <Row className="justify-content-lg-center mx-lg-5 my-2">
          <Col lg="6">
            <Button
              variant="success"
              type="submit"
              className="w-25"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
