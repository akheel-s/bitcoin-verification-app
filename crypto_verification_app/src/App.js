import React, { Component } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "react-bootstrap/Modal";

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

    return (
      <div>
        <div>
          <h1 className="title">Safe </h1>

          <h1 className="title1"> Crypto</h1>
        </div>
        <div className="pic1">
          <a href="https://www.google.com/finance/quote/BTC-USD">
            <button className="btn"></button>
          </a>
        </div>
        <div className="pic2">
          <a href="https://cointelegraph.com/tags/bitcoin">
            <button className="btn2"></button>
          </a>
        </div>
        <div className="pic3">
          <a href="https://www.ig.com/en/bitcoin-btc/how-to-trade-bitcoin">
            <button className="btn3"></button>
          </a>
        </div>
        <div className="pic4">
          <a href="https://www.coinbase.com/partner/bitcoin?utm_source=google_search_nb&utm_medium=cpc&utm_campaign=1658290220&utm_content=64330542701&utm_term=bitcoin%20trading&utm_creative=580598118868&utm_device=c&utm_placement=&utm_network=g&utm_location=9032268&gclid=CjwKCAiA1JGRBhBSEiwAxXblwVPWPBKWDTOjXVK0M3HJ8yQOhttL7wX71RRI1wFGE7u1AB0SeHtO5hoCzz8QAvD_BwE">
            <button className="btn4"></button>
          </a>
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
          <div className="about">
            <Button
              block
              variant="flat"
              className="border border-light text-black-50"
              onClick={this.handleShow}
            >
              ABOUT US
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
      </div>
    );
  }
}
export default App;
