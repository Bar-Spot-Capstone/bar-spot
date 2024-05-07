import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import Error from "../components/Error";

const Experimental = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  //div css
  const mapStyle = {
    height: "95vh",
    width: "100%",
  };

  if (!isLoaded) {
    return <Error></Error>
  }
  return <div style={mapStyle}>
    
  </div>;
};

export default Experimental;
