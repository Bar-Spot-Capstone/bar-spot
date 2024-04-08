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
  const [sort, setSort] = useState<boolean>(false);

  const handleTestClick = () => {
    sortByName("ascending");
  };

  const sortByName = (direction: string) => {
    if (direction == "ascending") {
      // let sortingArr: barMenuInfo[] = barData;
      console.log(barData);
      // let initialI: number = 0;
      // console.log(barData.length);
      mergeSort(barData, 0, barData.length - 1);
      setSort(true);
      console.log(barData);
    }
  };
  const merge = (
    arr: barMenuInfo[],
    left: number,
    middle: number,
    right: number
  ) => {
    console.log(arr.length);
    let size1: number = middle - left + 1;
    let size2: number = right - middle;

    let array1: barMenuInfo[] = new Array(size1);
    let array2: barMenuInfo[] = new Array(size2);

    for (let index = 0; index < size1; index++) {
      array1[index] = arr[left + index];
    }
    for (let x = 0; x < size2; x++) {
      array2[x] = arr[middle + 1 + x];
    }

    let index1 = 0;
    let index2 = 0;
    let mergedIndex = left;

    while (index1 < size1 && index2 < size2) {
      if (array1[index1].name <= array2[index2].name) {
        arr[mergedIndex] = array1[index1];
        index1++;
      } else {
        arr[mergedIndex] = array2[index2];
        index2++;
      }
      mergedIndex++;
    }

    while (index1 < size1) {
      arr[mergedIndex] = array1[index1];
      index1++;
      mergedIndex++;
    }
    while (index2 < size2) {
      arr[mergedIndex] = array2[index2];
      index2++;
      mergedIndex++;
    }
  };

  const mergeSort = (arr: barMenuInfo[], left: number, right: number) => {
    if (left >= right) {
      return;
    }

    let middle: number = left + Math.floor((right - left) / 2);

    mergeSort(arr, left, middle);
    mergeSort(arr, middle + 1, right);
    merge(arr, left, middle, right);
  };

  useEffect(() => {
    setShow(true);
  }, [sort]);

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
                    <Button
                      variant="outline-secondary"
                      onClick={handleTestClick}
                    >
                      A-Z
                    </Button>
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
