import { Button, Card, ListGroup } from "react-bootstrap";
import {useState} from "react";

interface Props {
    rating: string;
    name: string;
    phone: string;
    address: string;
    image: string;
    description: string;
    isFavorite: boolean; 

}
const CardInfo = ({rating, name, address, phone, image, description, isFavorite}:Props) => {
    const [favoriteText, setFavoriteText] = useState(
        isFavorite ? 'Favorited!': 'Add to Favorites'
    );

    const handleAddFavorite = async () => {
        if (isFavorite) {
            return;
        }

        try {
            const response = await fetch('/api/addFavorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 'your_user_id', // Provide actual user ID
                    barName: name,
                    address: address,
                    imageURL: image,
                }),
            });
            
            if (response.ok) {
                setFavoriteText('Favorited!');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    return (
        <Card>
            <Card.Img variant="top" src={image}/>
            <Card.Body>
                <Card.Title>
                    {name}
                </Card.Title>
            </Card.Body>
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
            <Card.Body>
            <Button variant="success" className="my-3 me-2">Start Hopping</Button>
                    <Button variant="outline-success" className="my-3" onClick={handleAddFavorite}>{favoriteText}</Button>
            </Card.Body>
        </Card>
    );
};

export default CardInfo;