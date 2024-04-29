import { Button, Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Rootstate } from "../state/store";
import { addFav } from "../types/fetchCall";

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
    const userId: number = useSelector((state: Rootstate) => state.user.userId);
    
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteAdded, setFavoriteAdded] = useState(false);

    const addToFavorites = async () => {
        try {
            const authToken = localStorage.getItem('authToken');

            const options: object = {
              method: 'POST',
              headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${authToken}`
              },
              body: JSON.stringify({
                userId,
                barName: name,
                address,
                note: '',
                imageURL: image,
              })
            };

            const response: Response = await fetch(addFav, options);

            if (response.ok) {
                setIsFavorite(true);
                setFavoriteAdded(true);
            } else {
                console.error('Failed to add to favorites');
            }
        } catch (error) {
            console.error("Error adding to favorites: ", error);
        }
    };
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
        <Button variant="success" className="my-3 me-2">
          Start Hopping
        </Button>
        <Button 
          variant = "outline-success"
          className = "my-3"
          onClick = {addToFavorites}
          disabled = {isFavorite}
        >
          {favoriteAdded ? "Favorite Added!" : "Add Favorite"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CardInfo;