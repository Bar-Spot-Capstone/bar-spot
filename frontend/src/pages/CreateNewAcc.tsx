import { Button, Container, Row, Col } from "react-bootstrap";
import Logo from "../components/Logo";
import FormInput from "../components/FormInput";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const CreateNewAcc = () => {
  return (
    <div className="d-flex flex-column vh-100 ">
      <NavBar />
      <Container className="">
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
            <Button variant="success" type="submit">
              Sign-Up
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateNewAcc;
