import { Row, Alert } from "react-bootstrap";

import "animate.css";

interface Props {
  text: string;
  variant: string;
  active: boolean;
}

const AlertBadge = ({ text, variant, active }: Props) => {
if(active){
  return (
    <Row className="mx-lg-5 my-lg-4 my-2 justify-content-lg-center">
      <Alert
        variant={variant}
        className={
          " animate__animated animate__shakeX w-50 my-auto"
        }
        dismissible
      >
        {text}
      </Alert>
      
    </Row>
  );
}



};

export default AlertBadge;
