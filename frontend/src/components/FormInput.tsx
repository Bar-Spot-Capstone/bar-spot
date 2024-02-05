import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col"
interface Props {
  lable: string;
  placeholder: string;
  type: string;
}
const FormInput = ({ lable, placeholder, type }: Props) => {
  return (
    <>
      <Row className="mx-lg-5 my-lg-4 my-2 justify-content-lg-center" >
        <Col lg="6">
        <Form.Group >
          <Form.Label>{lable} </Form.Label>
          <Form.Control type={type} placeholder={placeholder} />
        </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default FormInput;
