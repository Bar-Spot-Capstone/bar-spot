import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import Error from "../components/Error";
import visibleStyle from "../styles/mapstyle";
import { Offcanvas, Image } from "react-bootstrap";

interface LngLat {
  lat: number;
  lng: number;
}
interface marker {
  position: LngLat;
  lable: string;
}
interface barMenuInfo {
  name: string;
  display_phone: string;
  rating: string;
  image_url: string;
}

const MapView = () => {
  //https://www.youtube.com/watch?v=OvDu9c8PYrk <= the geolocation tutorial I used
  const [userGeo, setUserGeo] = useState<LngLat>({
    lat: 0,
    lng: 0,
  });

  const [markers, setMarkers] = useState<marker[]>([]);
  const [showMarkers, setShowMarkers] = useState<boolean>(false);
  const [userMarker, setUserMarker] = useState<marker>();
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [barInfo, setBarInfo] = useState<barMenuInfo>({
    name: "NULL",
    display_phone: "NULL",
    rating: "0.0",
    image_url:
      "https://cdn1.vectorstock.com/i/1000x1000/31/20/image-error-icon-editable-outline-vector-30393120.jpg",
  });
  const [yelpData, setYelpData] = useState<barMenuInfo[]>([]);

  const getIndex = (target: string): number => {
    for (let index = 0; index < yelpData.length; index++) {
      if (target == yelpData[index].name) {
        return index;
      }
    }
    return 0;
  };

  const handleCloseout = () => {
    setOffCanvas(false);
  };

  const getGeoloaction = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserGeo({
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
          });
          setUserMarker({
            position: {
              lng: pos.coords.longitude,
              lat: pos.coords.latitude,
            },
            lable: "me",
          });
          fetchBars(pos.coords.latitude, pos.coords.longitude);
          setShowMarkers(true);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      alert("Browser does not support geolocation");
    }
  };

  const fetchBars = async (lat: number, lng: number) => {
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
        var newMarkers: marker[] = [];
        res.then((bars) => {
          setYelpData(bars.businesses);
          bars.businesses.forEach((barObj: any) => {
            const newMarker = {
              position: {
                lat: barObj.coordinates.latitude,
                lng: barObj.coordinates.longitude,
              },
              lable: barObj.name,
            };
            newMarkers.push(newMarker);
          });
          setMarkers(newMarkers);
        });
      } else {
        console.log("Failed to fetch response was not okay");
        return;
      }
    } catch (error: any) {
      console.log(`Error failed to fetch due to: ${error}`);
    }
  };

  useEffect(() => {
    getGeoloaction();
  }, []);

  const mapStyle = {
    height: "100vh",
    width: "100%",
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  //this is the styling for the map that gives it its color and removes the default pins
  //provided by using https://mapstyle.withgoogle.com

  return (
    <div style={mapStyle}>
      <Offcanvas show={offCanvas} onHide={handleCloseout}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{barInfo.name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Rating: {String(barInfo.rating)}</p>
          <p>Phone: {barInfo.display_phone}</p>
          <p>Description: </p>
          This is some place holder text for now where we will have the bar info
          pop up
          {/* <img src={barInfo.image_url}></img> */}
          <Image src={barInfo.image_url} fluid></Image>
        </Offcanvas.Body>
      </Offcanvas>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={userGeo}
          zoom={17}
          options={{
            streetViewControl: false,
            disableDefaultUI: true,
            clickableIcons: true,
            mapTypeControl: false,

            styles: visibleStyle,
          }}
        >
          {/* Render Markers */}
          {showMarkers ? (
            <MarkerF
              position={userMarker?.position || { lat: 40.7678, lng: 73.9645 }} //either it finds a users position or it will default on hunter
              label={userMarker?.lable}
            ></MarkerF>
          ) : null}
          {showMarkers
            ? markers.map((marker, index) => (
                <MarkerF
                  key={index}
                  position={marker.position}
                  label={marker.lable}
                  onClick={() => {
                    const index = getIndex(marker.lable);
                    setBarInfo({
                      name: yelpData[index].name,
                      display_phone: yelpData[index].display_phone,
                      image_url: yelpData[index].image_url,
                      rating: String(yelpData[index].rating),
                    });
                    setOffCanvas(true);
                    console.log(yelpData);
                  }}
                />
              ))
            : null}
        </GoogleMap>
      ) : (
        <Error />
      )}
    </div>
  );
};

export default MapView;
