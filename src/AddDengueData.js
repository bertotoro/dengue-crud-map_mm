import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  FormGroup,
  Form,
  Input,
  Button,
  Row,
  Col,
  Container,
} from "reactstrap";

const AddDengueData = () => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "dengueData"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      });
      // Clear form fields
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

   return (
    <Container>
      <h3>Add Dengue Data</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="Cases"
                value={cases}
                onChange={(e) => setCases(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="Deaths"
                value={deaths}
                onChange={(e) => setDeaths(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Regions"
                value={regions}
                onChange={(e) => setRegions(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="12">
            <Button color="primary" type="submit">
              Add Data
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddDengueData;
