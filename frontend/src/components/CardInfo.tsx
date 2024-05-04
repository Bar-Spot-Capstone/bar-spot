import { Button, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
  rating: string;
  name: string;
  phone: string;
  address: string;
  image: string;
  description: string;
  price: string;
}
const CardInfo = ({
  rating,
  name,
  address,
  phone,
  image,
  description,
  price,
}: Props) => {
  return (
    <Card>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
      </Card.Body>
      <ListGroup>
        <ListGroup.Item>Rating: {rating}/5 Stars</ListGroup.Item>
        <ListGroup.Item>Estimated Price: {price}</ListGroup.Item>
        <ListGroup.Item>Phone Number: {phone}</ListGroup.Item>
        <ListGroup.Item>Address: {address}</ListGroup.Item>
        <ListGroup.Item>Description: {description}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Link to={"/bar-chain"}>
          <Button variant="success" className="my-3 me-2">
            Start Hopping
          </Button>
        </Link>
        <Button variant="outline-success" className="my-3">
          Add to Favorites
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CardInfo;
