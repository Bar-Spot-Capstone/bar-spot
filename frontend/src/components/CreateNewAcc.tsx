import { Button, Container, Row, Col } from "react-bootstrap";
import Logo from "./Logo";
import FormInput from "./FormInput";
interface Props {
  onLogin: () => void;
}

const CreateNewAcc = ({ onLogin }: Props) => {
  return (
    <>
      {/* <Container className="main w-75 h-75 d-flex flex-column position-absolute top-50 start-50 translate-middle">
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
      </Container> */}
      <Container className="main py-3 position-absolute top-50 start-50 translate-middle">
        <Row className="justify-content-end">
          <Col lg="4">
            <Button variant="link" onClick={onLogin}  size="sm">
              Already have an account?
            </Button>
          </Col>
        </Row>
        <Logo />
        <FormInput lable="Username" type="username" placeholder="Username" />
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
        <Row className="justify-content-lg-center mx-lg-5 my-2">
          <Col lg="6">
            <Button variant="success" type="submit" >
              Sign-Up
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateNewAcc;
