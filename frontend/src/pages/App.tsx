import Container from "react-bootstrap/Container";
import NavBar from "../components/NavBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import QuickInfo from "../components/QuickInfo";
import FormInput from "../components/FormInput";
import Form from "react-bootstrap/Form";

const App = () => {
  const testStyle = {
    overflow: 'auto',
    height: "500px"
  };
  return (
    <>
      <NavBar />
{/* 
      <Container className="mx-0 mw-100 min-vh-100">
        <Row className="bg-primary-subtle" xs={1}>
          <Col className="bg-secondary order-md-last vh-100" md={9}>
            <p>Map</p>

          </Col>
          <Col md={3} className=" bg-secondary-subtle">
            <h2>Details</h2>
            <Form>
              <FormInput
                placeholder="What are you looking for?"
                type="string"
                lable="Search"
              ></FormInput>
            </Form>
            <div style={testStyle}>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>
              <QuickInfo></QuickInfo>

            </div>
          </Col>
        </Row>
      </Container> */}
    </>
  );
};

export default App;
