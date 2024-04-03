import "animate.css";
import "../styles/QuickInfo.css";
import { useEffect, useState } from "react";
import { Col, Container, Row, Image, Button } from "react-bootstrap";
import { barMenuInfo } from "../types/types";

// interface Props {
//   lat: number;
//   lng: number;
// }
interface Props { 
  barData: barMenuInfo[];
}

const QuickInfo = ({ barData }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  // const [barInfo, setBarInfo] = useState<barMenuInfo[]>(barData);
  // const fetchBarInfo = async () => {
  //   try {
  //     if (lat === 0 && lng === 0) {
  //       console.log("Position is at 0 did not fetch");
  //       return;
  //     }
  //     const response = await fetch(
  //       `http://localhost:3001/yelp/pubs/${lat}/${lng}`,
  //       { method: "GET" }
  //     );

  //     if (response.ok) {
  //       const res = response.json();
  //       res.then((bars: any) => {
  //         setBarInfo(bars.businesses);
  //       });
  //     } else {
  //       console.log("Failed to fetch response was not okay");
  //       return;
  //     }
  //   } catch (error: any) {
  //     console.log(`Error failed to fetch due to: ${error}`);
  //   }
  // };

  useEffect(() => {
    setShow(true)

  }, );

  if (show) {
    return barData.map((bar, index) => (
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
            <Image src={bar.image_url} thumbnail className="barinfo"></Image>
          </Col>
        </Row>
      </Container>
    ));
  } else {
    return <p>Loading Bars...</p>;
  }
};

export default QuickInfo;
