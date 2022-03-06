import React, { Component, useState } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-bootstrap/Modal";
import { MDBInput } from "mdbreact";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      setShow: false,

      formData: {
        address: "",
        date: "",
        amount: "",
      },
      result: "",
    };
  }

  // MyVerticallyCenteredModal = (props) => {
  //   return (
  //     <Modal
  //       {...props}
  //       size="lg"
  //       aria-labelledby="contained-modal-title-vcenter"
  //       centered
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title id="contained-modal-title-vcenter">
  //           Modal heading
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <h4>Centered Modal</h4>
  //         <p>
  //           Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
  //           dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
  //           ac consectetur ac, vestibulum at eros.
  //         </p>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button onClick={props.onHide}>Close</Button>
  //       </Modal.Footer>
  //     </Modal>
  //   );
  // };

  handleClose = (event) => {
    this.setState({ setShow: false });
  };

  handleShow = (event) => {
    this.setState({ setShow: true });
  };

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData,
    });
  };

  handlePredictClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isLoading: true });
    fetch("http://127.0.0.1:5000/prediction/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          result: response.result,
          isLoading: false,
        });
      });
  };

  handleCancelClick = (event) => {
    this.setState({ result: "" });
  };

  render() {
    const isLoading = this.state.isLoading;
    const formData = this.state.formData;
    const result = this.state.result;
    const setShow = this.state.setShow;

    // const [show, setShow] = this.state.useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => this.state.setShow(true);

    return (
      <div>
        <div>
          <h1 className="title">Safe Crypto</h1>
        </div>

        <div className="content">
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                {/* <Form.Label>Bitcoin Address</Form.Label> */}
                <Form.Control
                  className="border border-5 transp"
                  type="text"
                  placeholder="BITCOIN ADDRESS"
                  name="address"
                  value={formData.address}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                {/* <Form.Label>Date of Transaction</Form.Label> */}
                <Form.Control
                  className="border border-5 transp"
                  type="text"
                  placeholder="DATE"
                  name="date"
                  value={formData.date}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                {/* <Form.Label>Transaction Amount</Form.Label> */}
                <Form.Control
                  className="border border-5 transp"
                  type="text"
                  placeholder="AMOUNT"
                  name="amount"
                  value={formData.amount}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Row>
              <Col>
                <Button
                  block
                  className="finalbutton"
                  variant="success"
                  disabled={isLoading}
                  onClick={!isLoading ? this.handlePredictClick : null}
                >
                  {isLoading ? "Making prediction" : "Verify"}
                </Button>
              </Col>
              <Col>
                <Button
                  className="finalbutton"
                  block
                  // variant="danger"
                  disabled={isLoading}
                  onClick={this.handleCancelClick}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
          {result === "" ? null : (
            <Row>
              <Col className="result-container">
                <h5 id="result">{result}</h5>
              </Col>
            </Row>
          )}
        </div>
        <div className="about">
          <Button
            variant="outline-primary"
            className="border border-light"
            onClick={this.handleShow}
          >
            About Us
          </Button>
          <Modal show={setShow} onHide={this.handleClose} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>About Us!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bharadwaj has a weird paneer addiction.</Modal.Body>
            <Modal.Body>Rohit eats a lot of biryani.</Modal.Body>
            <Modal.Body>Akheel likes food truck food too much.</Modal.Body>
            <Modal.Body>Simran throws up when she sees Siva.</Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
export default App;
