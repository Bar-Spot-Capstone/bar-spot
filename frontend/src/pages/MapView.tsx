import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import Error from "../components/Error";
import visibleStyle from "../styles/mapstyle";

interface LngLat {
  lat: number;
  lng: number;
}
interface marker {
  position: LngLat;
  lable: string;
}

const MapView = () => {
  //https://www.youtube.com/watch?v=OvDu9c8PYrk <= the geolocation tutorial I used
  const [userGeo, setUserGeo] = useState<LngLat>({
    lat: 0,
    lng: 0,
  });

  const [markers, setMarkers] = useState<marker[]>([]);
  const [showMarkers, setShowMarkers] = useState<boolean>(false);

  const getGeoloaction = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserGeo({
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
          });

          setMarkers([
            {
              position: {
                lng: pos.coords.longitude,
                lat: pos.coords.latitude,
              },
              lable: "me"
            }
          ]);
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

  const fetchLocalBars = async (): Promise<any> => {
    try {
      if (userGeo.lat === 0 && userGeo.lng === 0) {
        console.log('User location is off')
        return;
      }

      const response: Response = await fetch(`http://localhost:3001/yelp/pubs/${userGeo.lat}/${userGeo.lng}`, { method: 'GET' });

      if (response.ok) {
        const res: any = await response.json();

        let localPubs: Array<object> = res.businesses.map(Pub => {
          const { coordinates, display_phone, distance, image_url, is_closed, location, name, price, rating, review_count, url } = Pub;
          return {
            coordinates,
            display_phone,
            distance,
            is_closed,
            location,
            name,
            price,
            rating,
            review_count,
            url,
            image_url
          };
        });

        return localPubs;
      }
      else {
        const error = await response.json();
        console.log(`Error failed to fetch Pubs with error: ${error}`);
        return;
      };
    }
    catch (error: any) {
      console.log(`Failed to fetch from yelp API with error: ${error}`);
    };
  };

  fetchLocalBars();

  //this is the styling for the map that gives it its color and removes the default pins
  //provided by using https://mapstyle.withgoogle.com

  return (
    <div style={mapStyle}>
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
          {showMarkers ? (markers.map((marker, index) => (
            <MarkerF
              key={index}
              position={marker.position}
              label={marker.lable}
            />
          ))) : null}
          <MarkerF label={"Barcade"} position={
            {
              lat: 40.744202,
              lng: -73.994423
            }
          }>

          </MarkerF>
        </GoogleMap>
      ) : (
        <Error />
      )}
    </div>
  );
};

export default MapView;
