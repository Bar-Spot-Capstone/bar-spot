import { Button, Container, Row, Col } from "react-bootstrap";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";

import {
  endChain,
  resetChain,
  resetBars,
  setPrevCords,
} from "../state/slices/barHopSlice";
import { useSelector, useDispatch } from "react-redux";
import { Rootstate } from "../state/store";
import { barMenuInfo } from "../types/types";

interface LngLat {
  lat: number;
  lng: number;
}
const BarChaining = () => {
  const chainedBars: barMenuInfo[] = useSelector(
    (state: Rootstate) => state.barChain.bars
  );
  const centerOfMap: LngLat = useSelector(
    (state: Rootstate) => state.map.center
  );
  const map: google.maps.Map | null = useSelector(
    (state: Rootstate) => state.map.map
  );
  const dispatch = useDispatch();
  const clickHandler = () => {
    if (map != null && centerOfMap != null) {
      map.panTo(centerOfMap);
    }
    dispatch(endChain());
  };

  return (
    <Container>
      <Row className="mt-2 p-auto">
        <Col>
          <Link to={"/"}>
            <Button variant="light" onClick={clickHandler}>
              {" "}
              <SlArrowLeft /> Back
            </Button>
          </Link>
        </Col>
        <Col xs={3} md={3} lg={3} xl={2}>
          <Button
            onClick={() => {
              if (map != null && centerOfMap != null) {
                map.panTo(centerOfMap);
                map.setZoom(16);
              }
              dispatch(resetChain());
              dispatch(resetBars());
              dispatch(setPrevCords(centerOfMap));
            }}
          >
            Reset
          </Button>
        </Col>
        <Col xs={3} md={3} lg={3} xl={2}>
          <Button>Submit</Button>
        </Col>
      </Row>
      <Container>
        {chainedBars.length > 0
          ? chainedBars.map((bar, index) => (
              <Row
                key={index}
                className="p-auto my-2"
                style={{ backgroundColor: "rgb(255, 228, 196)" }}
              >
                <Col lg={2} className="d-flex align-items-center">
                  <p>Stop #{index}</p>
                </Col>
                <Col className="d-flex align-items-center">
                  <p>{bar.name}</p>
                </Col>
                <Col xs={4} lg={2} className="d-flex align-items-center">
                  <Button variant="secondary "> More info</Button>
                </Col>
              </Row>
            ))
          : null}
      </Container>
    </Container>
  );
};

export default BarChaining;
