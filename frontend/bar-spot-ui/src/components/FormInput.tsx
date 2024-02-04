import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
interface Props{
    lable: string
    placeholder: string
    type: string
}
const FormInput = ({lable, placeholder, type}:Props) => {
  return (
    <Row >
    <Form.Group>
      <Form.Label>{lable} </Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
      />
    </Form.Group>
  </Row>
  )
}

export default FormInput
