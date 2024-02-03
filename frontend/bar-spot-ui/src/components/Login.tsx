import { Fragment } from "react";
import logo from "../assets/Transparent-logo.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { Container, Row } from "react-bootstrap";

interface Props{
    onNewAcc: () => void
}

const Login = ({onNewAcc}: Props) => {
  return (
    <Fragment>
      <Container className="main w-50 h-75 d-flex flex-column position-absolute top-50 start-50 translate-middle">
        <Row className="justify-content-center">
          <img src={logo} className="h-100 w-50"></img>
        </Row>
        <Row className="justify-content-center">
          <h1 className="w-75">Login</h1>
        </Row>
        <Row className="d-flex flex-row justify-content-center">
          <Form className="w-75">
            <Stack gap={4}>
              <Row>
                <Form.Group>
                  <Form.Label>Email Address/Username</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="johndoe@example.com"
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="password" />
                </Form.Group>
              </Row>

              <Row>
                <Stack>
                  <Button variant="success" type="submit">
                    Login
                  </Button>
                  <Button variant="link" size="sm" onClick={onNewAcc}>
                    Create new account
                  </Button>
                  <Button variant="link" size="sm">
                    Reset Password
                  </Button>
                </Stack>
              </Row>

            </Stack>

          </Form>

        </Row>
      </Container>
    </Fragment>
  );
};

export default Login;
