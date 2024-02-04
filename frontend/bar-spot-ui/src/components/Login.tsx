import { Fragment } from "react";
import Logo from "./Logo";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import FormInput from "./FormInput";

interface Props {
  onNewAcc: () => void;
}

const Login = ({ onNewAcc }: Props) => {
  return (
    <Fragment>
      <Container className="main w-75 h-75 d-flex flex-column position-absolute top-50 start-50 translate-middle">
        <Logo />
        <Container className="col-md-7 mx-auto">
          <Row>
            <h1 className="w-75">Login</h1>
          </Row>
          <Row >
            <Form>
              <Row>
                <Col>
                  <FormInput
                    lable="Email/Username"
                    type="email"
                    placeholder="johndoe@example.com"
                  />
                  <FormInput
                    lable="Password"
                    type="password"
                    placeholder="password"
                  />
                </Col>
              </Row>

              <Row>
                <Col className="p-2">
                  <Button variant="success" type="submit">
                    Login
                  </Button>
                </Col>
              </Row>

            </Form>
          </Row>

          <Row>
            <Button variant="link" size="sm" onClick={onNewAcc}>
              Create new account
            </Button>
            <Button variant="link" size="sm">
              Reset Password
            </Button>
          </Row>

        </Container>

      </Container>
      
    </Fragment>
  );
};

export default Login;
