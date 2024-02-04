import { Button, Container, Row, Col } from "react-bootstrap";
import Logo from "./Logo";
import FormInput from "./FormInput";
interface Props {
  onLogin: () => void;
}

const CreateNewAcc = ({ onLogin }: Props) => {
  return (
    <>
      <Container className="main w-75 h-75 d-flex flex-column position-absolute top-50 start-50 translate-middle">
        <Row className=" d-flex justify-content-end">
          <Button variant="link" onClick={onLogin} className="w-50" size="sm">
            Already Have an Account?
          </Button>
        </Row>
        <Logo />
        <Container className="col-md-7 mx-auto">
          <FormInput
            lable="Username"
            type="username"
            placeholder="Username"
          />
          <FormInput
            lable="Email"
            type="email"
            placeholder="johndoe@example.com"
          />
          <FormInput
            lable="Password"
            type="password"
            placeholder="Type password here"
          />
          <FormInput
            lable="Confirm Password"
            type="password"
            placeholder="Confirm password here"
          />
          <Row>
            <Col className="p-3">
              <Button variant="success" type="submit">
                Sign Up
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default CreateNewAcc;
