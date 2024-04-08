import { Button, Card, ListGroup } from "react-bootstrap";

interface Props {
    rating: string;
    name: string;
    phone: string;
    address: string;
    image: string;
    description: string;

}
const CardInfo = ({rating, name, address, phone, image, description}:Props) => {
  return (
    <Card>
        <Card.Img variant="top" src={image}/>
        <Card.Body>
            <Card.Title>
                {name}
            </Card.Title>
            <Card.Text>
                <ListGroup>
                    <ListGroup.Item>
                        Rating: {rating}/5 Stars
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Phone Number: {phone}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Address: {address}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Description: {description}
                    </ListGroup.Item>
                </ListGroup>
                <Button variant="success" className="my-3">Start Hopping</Button>
                <Button variant="outline-success" className="my-3 mx-2">Add to Favorites</Button>
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default CardInfo