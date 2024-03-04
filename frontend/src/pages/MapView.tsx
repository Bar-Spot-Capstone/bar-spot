import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const MapView = () => {
  const mapStyle = {
    height: "100vh",
    width: "100%",
  };

  const mapCenter = {
    lat: 40.7685,
    lng: -73.9648,
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  return (
    <div style={mapStyle}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={mapCenter}
          zoom={17}
        ></GoogleMap>
      ) : null}
    </div>
  );
};

export default MapView;
