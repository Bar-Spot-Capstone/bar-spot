import Logo from "../components/Logo";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import FormInput from "../components/FormInput";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Login = () => {
  return (
    <div
      style={{ backgroundColor: "#AC9F5D" }}
      className="min-vh-100 d-flex flex-column"
    >
      <NavBar />

      <div className=" p-lg-5 d-flex flex-column justify-content-center py-5">
        <Container style={{backgroundColor: "#E9EBA4"}} fluid={"md"} className="p-lg-5 py-5 my2">
          <Row>
            <Col>
              <Logo />
            </Col>
          </Row>
          <Row className="mx-lg-5 justify-content-lg-center">
            <Col lg="6">
              <h1>Login</h1>
            </Col>
          </Row>

          <FormInput
            lable="Email/Username"
            type="email"
            placeholder="johndoe@example.com"
          />

          <FormInput lable="Password" type="password" placeholder="password" />

          <Row className="justify-content-lg-center mx-lg-5 ">
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

          <Row className="justify-content-lg-center mx-lg-5">
            <Col lg="6">
              <Button variant="success" type="submit" className="w-25">
                Login
              </Button>
            </Col>
          </Row>

        </Container>

      </div>

    </div>
  );
};

export default Login;
