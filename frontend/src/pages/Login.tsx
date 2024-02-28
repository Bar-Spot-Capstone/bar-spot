import Logo from "../components/Logo";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import FormInput from "../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface loginData {
  email: string;
  password: string;
}

const Login = () => {
  const [data, setData] = useState<loginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();
  //updates the data everytime there is a change to the input feilds
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    callLogin();
  };

  const loadPage = (status: number) => {
    if (status == 200) {
      
      setError(false);
      navigate("/");
    } else {
      setError(true);
    }
  };

  const callLogin = async () => {
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
        const res = response.json();
        console.log(res);
        loadPage(response.status);
      }
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="vh-100 ">
      <Container className="my-5">
        <Logo />

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
