import "./App.css";
import logo from "./assets/Bar-Spot-Transparent.png";
import Form from "react-bootstrap/Form";
import { Fragment } from "react";
import { Container, Row } from "react-bootstrap";

const App = () => {
  return (
    <Fragment>
      <Container id="main">
        <img src={logo}></img>
        <p>Login</p>
        <Form>
          <Row>
            <Form.Group>
              <Form.Label>Email Address/ Username</Form.Label>
              <Form.Control type="email" placeholder="johndoe@example.com" />
            </Form.Group>
          </Row>

          <Row >
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="password" />
            </Form.Group>
          </Row>

        </Form>
      </Container>
    </Fragment>
  );
};

export default App;
