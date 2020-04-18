import React, { Component } from "react";

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  Button,
  FormGroup,
  Input,
  Col,
} from "reactstrap";

import Weather from "./Weather";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: null,
      cityList: [],
      newCityName: "",
    };
  }

  getCityList = () => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((res) => {
        var cityList = res.map((r) => r.city_name);
        this.setState({ cityList });
      });
  };

  handleInputChange = (e) => {
    this.setState({ newCityName: e.target.value });
  };

  handleAddCity = () => {
    fetch("/api/cities", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: this.state.newCityName }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.getCityList();
        this.setState({ newCityName: "" });
      });
  };

  getWeather = (city) => {
    fetch(`/api/weather/${city}`)
      .then((res) => res.json())
      .then((weather) => {
        console.log(weather);
        this.setState({ weather });
      });
  };

  handleChangeCity = (e) => {
    this.getWeather(e.target.value);
  };

  componentDidMount() {
    this.getCityList();
  }

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand href="/">Weather Disk</NavbarBrand>
        </Navbar>
        <Row>
          <Col>
            <Jumbotron>
              <div className="inner-wrapper">
                <h1 className="display-3 cta">Weather Disk</h1>
                <p className="lead">
                  Add your city to the disk if you don't see it below.
                </p>
                <InputGroup>
                  <Input
                    placeholder="New city name..."
                    value={this.state.newCityName}
                    onChange={this.handleInputChange}
                  />
                  <InputGroupAddon addonType="append">
                    <Button color="secondary" onClick={this.handleAddCity}>
                      Add City
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="display-3 title">Current Weather</h1>
            <FormGroup>
              <Input type="select" onChange={this.handleChangeCity}>
                {this.state.cityList.length === 0 && (
                  <option>No cities added yet.</option>
                )}
                {this.state.cityList.length > 0 && (
                  <option>Select a city.</option>
                )}
                {this.state.cityList.map((city, i) => (
                  <option key={i}>{city}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Weather data={this.state.weather} />
      </Container>
    );
  }
}

export default App;
