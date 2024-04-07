import "animate.css";
import "../styles/MapView.css";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Image,
  Button,
  Accordion,
  ListGroup,
  ButtonGroup,
} from "react-bootstrap";
import { barMenuInfo } from "../types/types";

interface Props {
  barData: barMenuInfo[];
}

const QuickInfo = ({ barData }: Props) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setShow(true);
  }, [barData]);

  if (show) {
    return (
      <div className="p-2">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Sort/Filter</Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <ListGroup.Item className="d-flex justify-content-around align-items-center">
                  Sort By Name:
                  <ButtonGroup>
                    <Button variant="outline-secondary">A-Z</Button>
                    <Button variant="outline-secondary">Z-A</Button>
                  </ButtonGroup>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-around align-items-center">
                  Distance:{" "}
                  <ButtonGroup>
                    <Button variant="outline-secondary">Closest</Button>
                    <Button variant="outline-secondary">Farthest</Button>
                  </ButtonGroup>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-around align-items-center">
                  Price:{" "}
                  <ButtonGroup>
                    <Button variant="outline-secondary">Ascending</Button>
                    <Button variant="outline-secondary">Descending</Button>
                  </ButtonGroup>
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {barData.map((bar, index) => (
          <Container
            className="d-flex flex-column bg-body-secondary m-2 p-2 rounded info w-auto "
            key={index}
          >
            <Row>
              <Col className="my-1">
                <h3 className="text-center">{bar.name}</h3>
              </Col>
            </Row>
            <Row>
              <Col className="w-50">
                <p>Rating: {bar.rating}/5 Stars</p>
                <p>Address: {bar.location.address1}</p>
                <p>Phone: {bar.display_phone}</p>
                <Button>More Info</Button>
              </Col>
              <Col className="w-50 d-flex justify-content-center align-items-center">
                <Image src={bar.image_url} thumbnail className="barImg"></Image>
              </Col>
            </Row>
          </Container>
        ))}
      </div>
    );
  } else {
    return <p>Loading Bars...</p>;
  }
};

export default QuickInfo;
