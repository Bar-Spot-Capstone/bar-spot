import "animate.css";
import "../styles/QuickInfo.css";
import { useEffect, useState } from "react";

// interface Props {
//   bar_name: string;
//   distance: string;
//   hours: string;
// }
interface Props {
  lat: number;
  lng: number;
}

interface barMenuInfo {
  name: string;
  display_phone: string;
  rating: string;
  location: {
    address1: string;
  };
  image_url: string;
}

const QuickInfo = ({ lat, lng }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [barInfo, setBarInfo] = useState<barMenuInfo[]>([
    {
      name: "NULL",
      display_phone: "NULL",
      rating: "0.0",
      location: {
        address1: "NULL",
      },
      image_url:
        "https://cdn1.vectorstock.com/i/1000x1000/31/20/image-error-icon-editable-outline-vector-30393120.jpg",
    },
  ]);
  const fetchBarInfo = async () => {
    console.log({ lat: lat, lng: lng });

    try {
      if (lat === 0 && lng === 0) {
        console.log("Position is at 0 did not fetch");
        return;
      }
      const response = await fetch(
        `http://localhost:3001/yelp/pubs/${lat}/${lng}`,
        { method: "GET" }
      );

      if (response.ok) {
        const res = response.json();
        res.then( (bars: any) => {
          setBarInfo(bars.businesses)
        })
      } else {
        console.log("Failed to fetch response was not okay");
        return;
      }
    } catch (error: any) {
      console.log(`Error failed to fetch due to: ${error}`);
    }
  };

  useEffect(() => {
    if (lat != 0) {
      fetchBarInfo();
      setShow(true);
      console.log(barInfo[0].name);
    }
  }, [lat]);

  if (show) {
    return barInfo.map((bar, index) => (
      <div
        key={index}
        className="d-flex flex-column bg-body-secondary m-2 p-1 rounded info"
      >
        <h3>{bar.name}</h3>
        <p>Rating: {bar.rating}</p>
        <p>Address: {bar.location.address1}</p>
      </div>
    ));
  } else {
    return <p>Loading Bars...</p>;
  }
};

export default QuickInfo;
