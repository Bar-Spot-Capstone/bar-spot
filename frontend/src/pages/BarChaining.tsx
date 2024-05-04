import { Button, Container, Row, Col } from "react-bootstrap";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";

const BarChaining = () => {
  return (
    <Container>
      <Row className="mt-2 p-auto">
        <Col>
          <Link to={"/"}>
          <Button variant="light">
            {" "}
            <SlArrowLeft /> Back
          </Button>
          </Link>
        </Col>
        <Col xs={3} md={3} lg={3} xl={2}>
          <Button>
            Reset
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>

        </Col>
      </Row>
    </Container>
  );
};

export default BarChaining;
