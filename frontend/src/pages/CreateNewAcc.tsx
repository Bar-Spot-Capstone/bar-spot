import { Button, Container, Row, Col } from "react-bootstrap";
import Logo from "../components/Logo";
import FormInput from "../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AlertBadge from "../components/AlertBadge";

interface signUpData {
  email: string;
  password: string;
  username: string;
  confirmationPassword: string;
}

const CreateNewAcc = () => {
  //Hooks
  const [data, setData] = useState<signUpData>({
    email: "",
    password: "",
    confirmationPassword: "",
    username: "",
  });
  const [alert, setAlert] = useState<boolean>(false);
  const [alertTxt, setAlertTxt] = useState<string>("");
  const navigate = useNavigate();

  // @param => event element
  // return => void
  // updates the data everytime there is a change to the input fields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlert(false);
    const { name, value } = event.target;

    setData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // @param => number
  // returns void
  // if status # == 200 then there is no error and we can anvigate to home page
  // else sets error to true
  // const loadPage = (status: number) => {
  //   if (status == 200) {
  //     setAlert(false);
  //   } else {
  //     setAlert(true);
  //   }
  // };

  // @param => none
  // returns error || none
  // fetch request for login endpoint, if successful, creates a new user in the database table
  // else returns 400 error code
  const callSignUp = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
        }),
      });
      const res = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setAlertTxt(res.error);
        setAlert(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //returns true if password and comfirmation password match
  //returns false if they are different
  const checkInputs = (): boolean => {
    if (
      data.password != data.confirmationPassword ||
      data.password == "" ||
      data.confirmationPassword == ""
    ) {
      setAlertTxt("Passwords do not match or are empty");
      setAlert(true);
      return false;
    } else if (data.username == "") {
      setAlertTxt("Username Field is left empty");
      setAlert(true);
      return false;
    } else if (data.email == "") {
      setAlertTxt("Email Field is left empty");
      setAlert(true);
      return false;
    }
    setAlert(false);
    return true;
  };

  //click handler for the sign up button
  const handleRegister = () => {
    setAlert(false);
    if (checkInputs()) {
      callSignUp();
    }
  };

  return (
    <div className="d-flex flex-column vh-100 ">
      <Container className="">
        <Logo />

        <AlertBadge
          active={alert}
          variant="danger"
          text={alertTxt}
        ></AlertBadge>

        <FormInput
          lable="Username"
          type="username"
          placeholder="Username"
          name="username"
          value={data.username}
          handler={handleInputChange}
        />
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
          placeholder="Type password here"
          name="password"
          value={data.password}
          handler={handleInputChange}
        />
        <FormInput
          lable="Confirm Password"
          type="password"
          placeholder="Confirm password here"
          name="confirmationPassword"
          value={data.confirmationPassword}
          handler={handleInputChange}
        />
        <Row className="justify-content-end">
          <Col lg="5">
            <Link to="/login">
              <Button variant="link" size="sm">
                Already have an account?
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="justify-content-lg-center mx-lg-5 my-2">
          <Col lg="6">
            <Button variant="success" type="submit" onClick={handleRegister}>
              Sign-Up
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateNewAcc;
