import React, { Component } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: {
        address: "",
        date: "",
        amount: "",
      },
      result: "",
    };
  }

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

    return (
      <div classname="main">
        <img src="random.jpg" alt="" />
        <div className>
          <h1 className="title">Template</h1>
        </div>

        <div className="content">
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Bitcoin Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: 36FDGSdSFr5EWYCAo8ymCTm9ktTUB9kYEp"
                  name="address"
                  value={formData.address}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Date of Transaction</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: 03/04/2022"
                  name="date"
                  value={formData.date}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Transaction Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: 0.12345678"
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
                  variant="success"
                  disabled={isLoading}
                  onClick={!isLoading ? this.handlePredictClick : null}
                >
                  {isLoading ? "Making prediction" : "Predict"}
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  disabled={isLoading}
                  onClick={this.handleCancelClick}
                >
                  Reset prediction
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
      </div>
    );
  }
}

export default App;

