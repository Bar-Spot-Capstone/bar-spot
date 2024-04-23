import "animate.css";
import "../styles/MapView.css";
import imageUnavailable from "../assets/image_unavailable_photo.png";
import { FaLocationArrow } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Image,
  Button,
  Accordion,
  ListGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { barMenuInfo } from "../types/types";
import MoreInfo from "./MoreInfo";

interface Props {
  barData: barMenuInfo[];
  handleRecenter: () => void;
}

const QuickInfo = ({ barData, handleRecenter }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [sort, setSort] = useState<boolean>(false);
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [currentBar, setCurrentBar] = useState<barMenuInfo>({
    id: "NULL",
    name: "NULL",
    display_phone: "NULL",
    rating: "0.0",
    location: {
      address1: "NULL",
    },
    image_url: imageUnavailable,
    is_closed: true,
    url: "www.google.com",
    price: "$$$$$",
    distance: 100,
  });

  const handleDscName = () => {
    sortByName("dsc");
  };

  const handleAscName = () => {
    sortByName("asc");
  };

  const handleAscRating = () => {
    sortByRating("asc");
  };

  const handleDscRating = () => {
    sortByRating("dsc");
  };

  const handleAscDist = () => {
    sortByDistance("asc");
  };

  const handleDscDist = () => {
    sortByDistance("dsc");
  };

  const handleAscPrice = () => {
    sortByPrice("asc");
  };
  const handleDscPrice = () => {
    sortByPrice("dsc");
  };

  const sortByName = (direction: string) => {
    mergeSort(barData, 0, barData.length - 1, direction, "name");
    setSort(true);
  };

  const sortByRating = (direction: string) => {
    mergeSort(barData, 0, barData.length - 1, direction, "rating");
    setSort(true);
  };

  const sortByDistance = (direction: string) => {
    mergeSort(barData, 0, barData.length - 1, direction, "distance");
    setSort(true);
  };

  const sortByPrice = (direction: string) => {
    mergeSort(barData, 0, barData.length - 1, direction, "price");
    setSort(true);
  };

  const merge = (
    arr: barMenuInfo[],
    left: number,
    middle: number,
    right: number,
    direction: string,
    factor: string
  ) => {
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

    let index1: number = 0;
    let index2: number = 0;
    let mergedIndex: number = left;

    if (factor == "name" || factor == "price") {
      if (direction == "asc") {
        while (index1 < size1 && index2 < size2) {
          if (
            array1[index1][factor as keyof barMenuInfo] <=
            array2[index2][factor as keyof barMenuInfo]
          ) {
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
      } else {
        while (index1 < size1 && index2 < size2) {
          if (
            array1[index1][factor as keyof barMenuInfo] >=
            array2[index2][factor as keyof barMenuInfo]
          ) {
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
      }
    } else {
      if (direction == "asc") {
        while (index1 < size1 && index2 < size2) {
          if (
            Number(array1[index1][factor as keyof barMenuInfo]) <=
            Number(array2[index2][factor as keyof barMenuInfo])
          ) {
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
      } else {
        while (index1 < size1 && index2 < size2) {
          if (
            Number(array1[index1][factor as keyof barMenuInfo]) >=
            Number(array2[index2][factor as keyof barMenuInfo])
          ) {
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
      }
    }
  };

  const mergeSort = (
    arr: barMenuInfo[],
    left: number,
    right: number,
    direction: string,
    factor: string
  ) => {
    if (left >= right) {
      return;
    }

    let middle: number = left + Math.floor((right - left) / 2);

    mergeSort(arr, left, middle, direction, factor);
    mergeSort(arr, middle + 1, right, direction, factor);
    merge(arr, left, middle, right, direction, factor);
  };

  useEffect(() => {
    setShow(true);
    setSort(false);
  }, [sort, setSort]);

  const handleCloseout = () => {
    setOffCanvas(false);
  };

  if (show) {
    return (
      <div className="p-2">
        <MoreInfo
          barInfo={currentBar}
          show={offCanvas}
          handleCloseout={handleCloseout}
        ></MoreInfo>
        <Container>
          <Row>
            <Col xs={10}>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Sort/Filter</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        Sort By Name:
                        <ToggleButtonGroup type="radio" name="nameSort">
                          <ToggleButton
                            id="name-radio-1"
                            value={1}
                            onClick={handleAscName}
                          >
                            Asc
                          </ToggleButton>
                          <ToggleButton
                            id="name-radio-2"
                            value={2}
                            onClick={handleDscName}
                          >
                            Desc
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        Distance:{" "}
                        <ToggleButtonGroup type="radio" name="distanceSort">
                          <ToggleButton
                            id="distance-radio-1"
                            value={1}
                            onClick={handleAscDist}
                          >
                            Asc
                          </ToggleButton>
                          <ToggleButton
                            id="distance-radio-2"
                            value={2}
                            onClick={handleDscDist}
                          >
                            Desc
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        Rating:{" "}
                        <ToggleButtonGroup type="radio" name="ratingSort">
                          <ToggleButton
                            id="rating-radio-1"
                            value={1}
                            onClick={handleAscRating}
                          >
                            Asc
                          </ToggleButton>
                          <ToggleButton
                            id="rating-radio-2"
                            value={2}
                            onClick={handleDscRating}
                          >
                            Desc
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </ListGroup.Item>

                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        Price:{" "}
                        <ToggleButtonGroup type="radio" name="priceSort">
                          <ToggleButton
                            id="price-radio-1"
                            value={1}
                            onClick={handleAscPrice}
                          >
                            Asc
                          </ToggleButton>
                          <ToggleButton
                            id="price-radio-2"
                            value={2}
                            onClick={handleDscPrice}
                          >
                            Desc
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col>
              <Button
                onClick={handleRecenter}
                variant="light"
                className="w-100"
              >
                <FaLocationArrow className="w-25 h-25" />
              </Button>
            </Col>
          </Row>
        </Container>
        {barData.map((bar, index) => (
          <Container
            className="d-flex flex-column m-2 p-2 rounded info w-auto "
            key={index}
          >
            <Row>
              <Col className="my-1">
                <h3 className="text-center">{bar.name}</h3>
              </Col>
            </Row>
            <Row>
              <Col className="w-50 m-0">
                <ListGroup>
                  <ListGroup.Item className="px-1 d-flex justify-content-between align-items-center">
                    <p>Rating: {bar.rating}/5 Stars</p>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-1 d-flex justify-content-between  align-items-center">
                    <p>Address: {bar.location.address1}</p>
                  </ListGroup.Item>
                  <ListGroup.Item className="p-0 d-flex justify-content-between  align-items-center text-center">
                    <p className="text-center">Phone: {bar.display_phone}</p>
                  </ListGroup.Item>
                  <ListGroup.Item className="p-2 d-flex justify-content-center align-items-center">
                    <Button
                      onClick={() => {
                        setOffCanvas(true);
                        setCurrentBar(barData[index]);
                      }}
                    >
                      More Info
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
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
