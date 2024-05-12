import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  DirectionsRenderer,
  InfoWindowF,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import Error from "../components/Error";
import visibleStyle from "../styles/mapstyle";
import { useOutletContext } from "react-router-dom";
import "../styles/MapView.css";
import { barMenuInfo } from "../types/types";
import imageUnavailable from "../assets/image_unavailable_photo.png";
import MoreInfo from "../components/MoreInfo";
import { fetchPubs } from "../types/fetchCall";
import { Outlet } from "react-router-dom";
import BeerIcon from "../assets/BeerIconTransparent.png";

import { useSelector, useDispatch } from "react-redux";
import { Rootstate } from "../state/store";
import { setNewMap, setCenter } from "../state/slices/mapSlice";
import {
  updateChain,
  updateBars,
  setPrevCords,
} from "../state/slices/barHopSlice";
import { Button } from "react-bootstrap";

interface LngLat {
  lat: number;
  lng: number;
}
interface marker {
  position: LngLat;
  lable: string;
}

type ContextType = {
  yelpData: barMenuInfo[];
  handleRecenter: () => void;
};

const MapView = () => {
  //global map state
  const dispatch: any = useDispatch();
  const googleMap: google.maps.Map | null = useSelector(
    (state: Rootstate) => state.map.map
  );
  const chainedDirections: google.maps.DirectionsResult[] = useSelector(
    (state: Rootstate) => state.barChain.chain
  );
  const isChaining: boolean = useSelector(
    (state: Rootstate) => state.barChain.isChaining
  );
  const prevBar: LngLat = useSelector(
    (state: Rootstate) => state.barChain.center
  );

  //https://www.youtube.com/watch?v=OvDu9c8PYrk <= the geolocation tutorial I used
  const [userGeo, setUserGeo] = useState<LngLat>({
    lat: 0,
    lng: 0,
  });

  const [infoWindow, setInfoWindow] = useState<marker>({
    position: {
      lat: 0,
      lng: 0,
    },
    lable: "null",
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const [markers, setMarkers] = useState<marker[]>([]);
  const [showMarkers, setShowMarkers] = useState<boolean>(false);
  const [showInfoWin, setShowInfoWin] = useState<boolean>(false);
  const [userMarker, setUserMarker] = useState<marker>();
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [path, setPath] = useState<boolean>(false);

  const [barInfo, setBarInfo] = useState<barMenuInfo>({
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
    resetMap();
  };

  const getGeoloaction = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserGeo({
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
          });
          dispatch(
            setCenter({
              lng: pos.coords.longitude,
              lat: pos.coords.latitude,
            })
          );
          dispatch(
            setPrevCords({
              lng: pos.coords.longitude,
              lat: pos.coords.latitude,
            })
          );
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
      const response = await fetch(`${fetchPubs}/${lat}/${lng}`, {
        method: "GET",
      });

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

  const handleRecenter = () => {
    googleMap?.panTo(userGeo);
    resetMap();
  };

  const calculateRoute = async (startingPoint: LngLat, endingPoint: LngLat) => {
    if (isChaining) {

      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: startingPoint,
        destination: endingPoint,
        travelMode: google.maps.TravelMode.WALKING,
      });

      dispatch(updateChain(results));
    } else {
      setDirections(null);
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: startingPoint,
        destination: endingPoint,
        travelMode: google.maps.TravelMode.WALKING,
      });

      setDirections(results);
    }
  };

  const resetMap = () => {
    setDirections(null);
    setPath(false);
  };
  useEffect(() => {
    getGeoloaction();
  }, []);

  const mapStyle = {
    height: "95vh",
    width: "100%",
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  //this is the styling for the map that gives it its color and removes the default pins
  //provided by using https://mapstyle.withgoogle.com

  return (
    <div className="totalView">
      <div id="infoHolder">
        <Outlet context={{ yelpData, handleRecenter } satisfies ContextType} />
      </div>
      <div style={mapStyle} className="mapView">
        <MoreInfo
          barInfo={barInfo}
          show={offCanvas}
          handleCloseout={handleCloseout}
        ></MoreInfo>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={userGeo}
            zoom={16}
            onLoad={(map) => {
              dispatch(setNewMap(map));
            }}
            options={{
              streetViewControl: false,
              disableDefaultUI: true,
              clickableIcons: true,
              mapTypeControl: false,

              styles: visibleStyle,
            }}
          >
            {/* Render Path normally*/}
            {path && directions && !isChaining && (
              <DirectionsRenderer directions={directions}></DirectionsRenderer>
            )}

            {/* Render Path during a chain*/}
            {isChaining && chainedDirections.length > 0
              ? chainedDirections.map((direction, index) => (
                  <DirectionsRenderer
                    directions={direction}
                    key={index}
                  ></DirectionsRenderer>
                ))
              : null}
            {/* Render Markers */}
            {showInfoWin ? (
              <InfoWindowF
                position={infoWindow.position}
                onCloseClick={() => {
                  setShowInfoWin(false);
                  handleCloseout()
                }}
              >
                <Button
                  variant="dark"
                  onClick={() => {
                    setOffCanvas(true);
                  }}
                >
                  {" "}
                  {infoWindow.lable}
                </Button>
              </InfoWindowF>
            ) : null}
            {showMarkers ? (
              <MarkerF
                position={
                  userMarker?.position || { lat: 40.7678, lng: 73.9645 }
                } //either it finds a users position or it will default on hunter
                label={userMarker?.lable}
              ></MarkerF>
            ) : null}
            {showMarkers
              ? markers.map((marker, index) => (
                  <MarkerF
                    key={index}
                    options={{
                      icon: BeerIcon,
                    }}
                    position={marker.position}

                    onClick={() => {
                      setInfoWindow({
                        position: {
                          lat: marker.position.lat,
                          lng: marker.position.lng,
                        },
                        lable: marker.lable,
                      });
                      setShowInfoWin(true);
                      googleMap?.panTo({
                        lat: marker.position.lat,
                        lng: marker.position.lng,
                      });
                      if (isChaining) {
                        calculateRoute(prevBar, {
                          lat: marker.position.lat,
                          lng: marker.position.lng,
                        });
                        dispatch(
                          setPrevCords({
                            lat: marker.position.lat,
                            lng: marker.position.lng,
                          })
                        );
                        dispatch(
                          updateBars({
                            id: yelpData[index].id,
                            name: yelpData[index].name,
                            display_phone: yelpData[index].display_phone,
                            image_url: yelpData[index].image_url,
                            rating: String(yelpData[index].rating),
                            location: {
                              address1: yelpData[index].location.address1,
                            },
                            url: yelpData[index].url,
                            is_closed: yelpData[index].is_closed,
                            price: yelpData[index].price,
                            distance: yelpData[index].distance,
                          })
                        );
                      } else {
                        calculateRoute(userGeo, {
                          lat: marker.position.lat,
                          lng: marker.position.lng,
                        });
                        const index = getIndex(marker.lable);
                        setBarInfo({
                          id: yelpData[index].id,
                          name: yelpData[index].name,
                          display_phone: yelpData[index].display_phone,
                          image_url: yelpData[index].image_url,
                          rating: String(yelpData[index].rating),
                          location: {
                            address1: yelpData[index].location.address1,
                          },
                          url: yelpData[index].url,
                          is_closed: yelpData[index].is_closed,
                          price: yelpData[index].price,
                          distance: yelpData[index].distance,
                        });
                        setPath(true);
                      }
                    }}
                  ></MarkerF>
                ))
              : null}
          </GoogleMap>
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
};

export default MapView;

export function useData() {
  return useOutletContext<ContextType>();
}
