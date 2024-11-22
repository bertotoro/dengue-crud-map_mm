import React from "react";
import { Card, CardBody, CardTitle, Container, Col } from "reactstrap";
import CsvUploader from "../../core/CsvUploader"; // Import the CsvUploader component
import AddDengueData from "../../AddDengueData";

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-default shadow pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            
            {/* Add CsvUploader component here */}
            <Col lg="12" xl="10" className="mt-4">
              <Card className="card-upload mb-4">
                <CardBody>
                    <CardTitle
                        tag="h3"
                        className="text-uppercase  mb-2"
                      >
                        CSV Data Upload
                    </CardTitle>
                  <CsvUploader /> {/* Include the CsvUploader component */}
                </CardBody>
              </Card>
            </Col>
            <Col lg="12" xl="10" className="mt-4">
              <Card className="card-upload mb-4">
                <CardBody>
                    <CardTitle
                        tag="h3"
                        className="text-uppercase  mb-2"
                      >
                        Add DENGUE Data
                    </CardTitle>
                  <AddDengueData /> 
                </CardBody>
              </Card>
            </Col>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
