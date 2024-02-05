import Logo from "./Logo";
import Button from "react-bootstrap/Button";
import { Col, Container, Row } from "react-bootstrap";
import FormInput from "./FormInput";

interface Props {
  onNewAcc: () => void;
}

const Login = ({ onNewAcc }: Props) => {
  return (
    <>
      <Container className="main h-75 position-absolute top-50 start-50 translate-middle">
        <Logo />

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

        <Row className="justify-content-lg-center mx-lg-5 my-2">
          <Col lg="6">
            <Button variant="link" size="sm" onClick={onNewAcc}>
              Create new account
            </Button>
            <Button variant="link" size="sm">
              Reset Password
            </Button>
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
    </>
  );
};

export default Login;
