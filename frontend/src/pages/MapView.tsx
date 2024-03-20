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
  const [userMarker, setUserMarker] = useState<marker>();

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
          // setMarkers([

          // ]);
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
    const response = await fetch(
      "http://localhost:3001/yelp/pubs/" + lat + "/" + lng,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = response.json();
    if (response.ok) {
      console.log(res);
      var newMarkers: marker[] = [];
      res.then((bars) => {
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
