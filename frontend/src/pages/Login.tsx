import Logo from "../components/Logo";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import FormInput from "../components/FormInput";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Login = () => {
  return (
    <div className="vh-100 ">
      <NavBar />
      <Container className="my-5">

        <Logo />

        <FormInput
          lable="Email/Username"
          type="email"
          placeholder="johndoe@example.com"
        />

        <FormInput lable="Password" type="password" placeholder="password" />

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
            <Button variant="success" type="submit" className="w-25">
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
