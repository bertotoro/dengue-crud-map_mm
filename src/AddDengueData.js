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

const AddNatData = () => {
  const [respondents, setRespondents] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [academicPerformance, setAcademicPerformance] = useState("");
  const [academicDescription, setAcademicDescription] = useState("");
  const [iq, setIq] = useState("");
  const [typeSchool, setTypeSchool] = useState("");
  const [socioStatus, setSocioStatus] = useState("");
  const [studyHabit, setStudyHabit] = useState("");
  const [natResult, setNatResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "NatData"), {
        respondents,
        age: Number(age),  // Ensure age is numeric
        sex,
        ethnic,
        academicPerformance: Number(academicPerformance), // Ensure academicPerformance is numeric
        academicDescription,
        iq, // Ensure IQ is numeric
        typeSchool,
        socioStatus,
        studyHabit,
        natResult: Number(natResult), // Ensure natResult is numeric
      });
      // Clear form fields
      setRespondents("");
      setAge("");
      setSex("");
      setEthnic("");
      setAcademicPerformance("");
      setAcademicDescription("");
      setIq("");
      setTypeSchool("");
      setSocioStatus("");
      setStudyHabit("");
      setNatResult("");
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Container>
      <h3>Add NAT Data</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Respondents"
                value={respondents}
                onChange={(e) => setRespondents(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Ethnic"
                value={ethnic}
                onChange={(e) => setEthnic(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="Academic Performance"
                value={academicPerformance}
                onChange={(e) => setAcademicPerformance(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Academic Description"
                value={academicDescription}
                onChange={(e) => setAcademicDescription(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="IQ"
                value={iq}
                onChange={(e) => setIq(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Type of School"
                value={typeSchool}
                onChange={(e) => setTypeSchool(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Socio-economic Status"
                value={socioStatus}
                onChange={(e) => setSocioStatus(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="text"
                placeholder="Study Habit"
                value={studyHabit}
                onChange={(e) => setStudyHabit(e.target.value)}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Input
                type="number"
                placeholder="NAT Result"
                value={natResult}
                onChange={(e) => setNatResult(e.target.value)}
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

export default AddNatData;
