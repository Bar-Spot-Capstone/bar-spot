import { Button, Card, ListGroup, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Rootstate } from "../state/store";
import { addFav, getFav } from "../types/fetchCall";

interface Favorite {
  id: number;
  userId: number;
  barName: string;
  address: string;
  note: string;
  imageURL: string;
}

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
    const [showModal, setShowModal] = useState(false);
    const [note, setNote] = useState("");

    useEffect(() => {
      // Fetch user favorites when component mounts or when userId changes
      if (userId) {
        fetchFavorites(userId);
      }
    }, [userId, name]);
  
    const fetchFavorites = async (userId: number) => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await fetch(`http://localhost:3001/favorite/get/${userId}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        const favorites: Favorite[] = data.favorites;
        setIsFavorite(favorites.some((favorite: Favorite) => favorite.barName === name));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };  

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNote(e.target.value);
    };

    const addToFavorites = async () => {
        if (userId == -1 || !userId) {
          console.error('User is not logged in');
          return;
        } 

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
                note: note,
                imageURL: image,
              })
            };

            const response: Response = await fetch(addFav, options);
            const res = await response.json();

            if (response.ok) {
                setIsFavorite(true);
                setShowModal(false);
            } else {
                console.error('Failed to add to favorites:', res.error);
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
          onClick = {() => setShowModal(true)}
          disabled = {isFavorite}
        >
          {isFavorite ? "Favorite Added!" : "Add Favorite"}
        </Button>
      </Card.Body>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter note here..."
                value={note}
                onChange={handleNoteChange}
              />
            </Form.Group> 
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addToFavorites}>
            Add to Favorites
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default CardInfo;