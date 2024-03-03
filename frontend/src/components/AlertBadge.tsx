import { Row, Alert } from "react-bootstrap";

interface Props {
  text: string;
  variant: string;
  active: boolean;
}

const AlertBadge = ({ text, variant, active }: Props) => {
  const hide = "d-none";
  const show = "d-inline";
  const displayHandler = () => {
    if (active == true) {
      return show;
    } else {
      return hide;
    }
  };

  return (
    <Row className="mx-lg-5 my-lg-4 my-2 justify-content-lg-center">
      <Alert
        variant={variant}
        className={displayHandler() + " w-50 my-auto"}
        dismissible
      >
        
        {text}
      </Alert>
    </Row>
  );
};

export default AlertBadge;
