import { Offcanvas } from "react-bootstrap"
import { barMenuInfo } from "../types/types";
import CardInfo from "./CardInfo";

interface Props{
    handleCloseout: ()=>void;
    show: boolean;
    barInfo: barMenuInfo
}

const MoreInfo = ({handleCloseout, show, barInfo}:Props) => {
  return (
    <Offcanvas show={show} onHide={handleCloseout} id="canvas">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{barInfo.name}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <CardInfo
              description="This is some place holder text for now where we will have the bar
            info pop up"
              name={barInfo.name}
              rating={barInfo.rating}
              image={barInfo.image_url}
              phone={barInfo.display_phone}
              address={barInfo.location.address1}
            ></CardInfo>
          </Offcanvas.Body>
        </Offcanvas>
  )
}

export default MoreInfo