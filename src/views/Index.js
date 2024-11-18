import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Header from "components/Headers/Header.js";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


const NatDataList = () => {
  const [natData, setNatData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    respondents: "",
    age: "",
    sex: "",
    ethnic: "",
    academicPerformance: "",
    academicDescription: "",
    iq: "",
    typeSchool: "",
    socioStatus: "",
    studyHabit: "",
    natResult: "",
  });
  const [previousForm, setPreviousForm] = useState(null);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const natCollection = collection(db, "NatData");
      const natSnapshot = await getDocs(natCollection);
      const dataList = natSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNatData(dataList);
    };

    fetchData();
  }, []);

  // Delete data
  const handleDelete = async (id) => {
    const natDocRef = doc(db, "NatData", id);
    try {
      await deleteDoc(natDocRef);
      setNatData(natData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Edit data
  const handleEdit = (data) => {
    setEditingId(data.id);
    setPreviousForm({ ...data });
    setEditForm({
      respondents: data.respondents,
      age: data.age,
      sex: data.sex,
      ethnic: data.ethnic,
      academicPerformance: data.academicPerformance,
      academicDescription: data.academicDescription,
      iq: data.iq,
      typeSchool: data.typeSchool,
      socioStatus: data.socioStatus,
      studyHabit: data.studyHabit,
      natResult: data.natResult,
    });
  };

  // Update data
  const handleUpdate = async () => {
    const natDocRef = doc(db, "NatData", editingId);
    try {
      await updateDoc(natDocRef, { ...editForm });
      setNatData(natData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditForm(previousForm);
    setEditingId(null);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Sorting logic
  const [sortConfig, setSortConfig] = useState({ key: "respondents", direction: "ascending" });

  const sortedData = [...natData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };


  // Create histogram data
  const createHistogramData = () => {
    const resultNat = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90-99"];
    const natFrequencies = resultNat.map(() => 0);

    natData.forEach((data) => {
      const natResult = data.natResult;
      if (natResult >= 0 && natResult < 10) natFrequencies[0]++;
      else if (natResult >= 10 && natResult < 20) natFrequencies[1]++;
      else if (natResult >= 20 && natResult < 30) natFrequencies[2]++;
      else if (natResult >= 30 && natResult < 40) natFrequencies[3]++;
      else if (natResult >= 40 && natResult < 50) natFrequencies[4]++;
      else if (natResult >= 50 && natResult < 60) natFrequencies[5]++;
      else if (natResult >= 60 && natResult < 70) natFrequencies[6]++;
      else if (natResult >= 70 && natResult < 80) natFrequencies[7]++;
      else if (natResult >= 80 && natResult < 90) natFrequencies[8]++;
      else if (natResult >= 90 && natResult < 100) natFrequencies[9]++;
      else natFrequencies[10]++;
    });

    return {
      labels: resultNat,
      datasets: [
        {
          label: "Frequency of Respondents",
          data: natFrequencies,
          backgroundColor: 'rgba(75,192,192,0.4)', 
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  


  // Create pie chart data for Socio-Economic Status
  const createPieChartData = () => {
    const socioStatusCount = { "On poverty line": 0, "Above poverty line": 0, "Below poverty line": 0 };
    let total = 0;

    natData.forEach((data) => {
      const socioStatus = data.socioStatus;
      if (socioStatus === "On poverty line") socioStatusCount["On poverty line"]++;
      else if (socioStatus === "Above poverty line") socioStatusCount["Above poverty line"]++;
      else if (socioStatus === "Below poverty line") socioStatusCount["Below poverty line"]++;
    });



    total = socioStatusCount["On poverty line"] + socioStatusCount["Above poverty line"] + socioStatusCount["Below poverty line"];

    const getPercentage = (count) => ((count / total) * 100).toFixed(2);

    const labels = [
      `On poverty line (${getPercentage(socioStatusCount["On poverty line"])}%)`,
      `Above poverty line (${getPercentage(socioStatusCount["Above poverty line"])}%)`,
      `Below poverty line (${getPercentage(socioStatusCount["Below poverty line"])}%)`,
    ];

    return {
      labels: labels,
      datasets: [
        {
          data: [
            socioStatusCount["On poverty line"],
            socioStatusCount["Above poverty line"],
            socioStatusCount["Below poverty line"],
          ],
          backgroundColor: ['rgba(245, 59, 87, 0.8)', 'rgba(76, 81, 191, 0.8)', 'rgba(0, 192, 239, 0.8)'], // Different colors for each status
          borderColor: 'rgba(255,255,255, 0.8)',
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  };



   // Create doughnut chart data for Socio-Economic Status
   const createDoughnutChartData = () => {
    // Updated: New performance categories
    const performanceCount = {
      "Outstanding": 0,
      "Satisfactory": 0,
      "Did not meet expectation": 0,
      "Fairly Satisfactory": 0,
      "Very Satisfactory": 0,
    };
    let total = 0;
  
    // Iterate through the data and count each performance category
    natData.forEach((data) => {
      const performance = data.academicDescription;
      if (performance === "Outstanding") performanceCount["Outstanding"]++;
      else if (performance === "Satisfactory") performanceCount["Satisfactory"]++;
      else if (performance === "Did not meet expectation") performanceCount["Did not meet expectation"]++;
      else if (performance === "Fairly Satisfactory") performanceCount["Fairly Satisfactory"]++;
      else if (performance === "Very Satisfactory") performanceCount["Very Satisfactory"]++;
    });
  
    // Calculate the total count
    total =
      performanceCount["Outstanding"] +
      performanceCount["Satisfactory"] +
      performanceCount["Did not meet expectation"] +
      performanceCount["Fairly Satisfactory"] +
      performanceCount["Very Satisfactory"];
  
    // Helper function to calculate percentages
    const getPercentage = (count) => ((count / total) * 100).toFixed(2);
  
    // Updated: Labels with percentages for each performance category
    const labels = [
      `Outstanding (${getPercentage(performanceCount["Outstanding"])}%)`,
      `Satisfactory (${getPercentage(performanceCount["Satisfactory"])}%)`,
      `Did not meet expectation (${getPercentage(performanceCount["Did not meet expectation"])}%)`,
      `Fairly Satisfactory (${getPercentage(performanceCount["Fairly Satisfactory"])}%)`,
      `Very Satisfactory (${getPercentage(performanceCount["Very Satisfactory"])}%)`,
    ];
  
    return {
      labels: labels,
      datasets: [
        {
          data: [
            performanceCount["Outstanding"],
            performanceCount["Satisfactory"],
            performanceCount["Did not meet expectation"],
            performanceCount["Fairly Satisfactory"],
            performanceCount["Very Satisfactory"],
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)', // Outstanding
            'rgba(54, 162, 235, 0.8)', // Satisfactory
            'rgba(255, 99, 132, 0.8)', // Did not meet expectation
            'rgba(255, 206, 86, 0.8)', // Fairly Satisfactory
            'rgba(153, 102, 255, 0.8)', // Very Satisfactory
          ],
          borderColor: 'rgba(255,255,255, 0.8)',
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  };



  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col xl="12">
            <Card className="shadow" style={{ marginBottom: "40px" }}>
              <CardHeader className="border-0">
                <h3 className="mb-0">National Achievement Test Data List</h3>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col" onClick={() => requestSort("respondents")}>
                        Respondents
                        {sortConfig.key === "respondents" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("age")}>
                        Age
                        {sortConfig.key === "age" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("sex")}>
                        Sex
                        {sortConfig.key === "sex" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("ethnic")}>
                        Ethnic
                        {sortConfig.key === "ethnic" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      {/* Additional columns for new fields */}
                      <th scope="col" onClick={() => requestSort("academicPerformance")}>
                        Performance
                        {sortConfig.key === "academicPerformance" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("academicDescription")}>
                        Description
                        {sortConfig.key === "academicDescription" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("iq")}>
                        IQ
                        {sortConfig.key === "iq" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("typeSchool")}>
                        Type of School
                        {sortConfig.key === "typeSchool" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("socioStatus")}>
                        Socioeconomic Status
                        {sortConfig.key === "socioStatus" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("studyHabit")}>
                        Study Habit
                        {sortConfig.key === "studyHabit" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col" onClick={() => requestSort("natResult")}>
                        National Result
                        {sortConfig.key === "natResult" && (
                          <i className={`ni ${sortConfig.direction === "ascending" ? "ni-bold-up" : "ni-bold-down"}`}></i>
                        )}
                      </th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  </Table>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table className="align-items-center table-flush" responsive>
                    <tbody>
                      {sortedData.map((data, index) => (
                        <tr key={data.id}>
                          <td>{index + 1}</td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="respondents"
                                value={editForm.respondents}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '100%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.respondents}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="number"
                                name="age"
                                value={editForm.age}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.age}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="sex"
                                value={editForm.sex}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '100%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.sex}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="ethnic"
                                value={editForm.ethnic}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}

                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.ethnic}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="number"
                                name="academicPerformance"
                                value={editForm.academicPerformance}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.academicPerformance}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="academicDescription"
                                value={editForm.academicDescription}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '100%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.academicDescription}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="iq"
                                value={editForm.iq}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.iq}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="typeSchool"
                                value={editForm.typeSchool}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.typeSchool}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="socioStatus"
                                value={editForm.socioStatus}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.socioStatus}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="studyHabit"
                                value={editForm.studyHabit}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.studyHabit}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="number"
                                name="natResult"
                                value={editForm.natResult}
                                onChange={handleChange}
                                required
                                style={{ maxWidth: '150px', width: '150%' }}
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.natResult}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <>
                                <Button color="success" size='sm' onClick={handleUpdate}>Save</Button>
                                <Button color="danger" size='sm' onClick={handleCancel}>Cancel</Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  color="danger"
                                  onClick={() => handleDelete(data.id)}
                                  size="sm"
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>


              </CardBody>
            </Card>
          </Col>

          {/* Histogram Card */}
          <Col xl="7">
            <Card className="bg-gradient-default shadow" style={{ marginBottom: "40px" }}>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Respondent Nat Result Distribution</h6>
                    <h2 className="text-white mb-0">Nat Result Histogram</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar data={createHistogramData()} />
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Pie Chart Section for Socio-Economic Status */}
          <Col xl="5">
            <Card className="bg-gradient-default shadow" style={{ marginBottom: "40px" }}>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">Socio-Economic Status Distribution</h6>
                    <h2 className="text-white mb-0">Socio-Economic Status</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Pie data={createPieChartData()} />
                </div>
              </CardBody>
            </Card>
          </Col>



           {/* Pie Chart Section for Socio-Economic Status */}
           <Col xl="5" >
              <Card className="bg-gradient-default shadow" style={{ marginBottom: "40px" }}>
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">Performance Description Evaluation Distribution</h6>
                      <h2 className="text-white mb-0">Performance Evaluation</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    {/* Render the Doughnut Chart using Pie component */}
                    <Doughnut
                      data={createDoughnutChartData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          
                        },
                        cutoutPercentage: 70, // Make it a doughnut chart by adding cutout
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

        </Row>
      </Container>
    </>
  );
};

export default NatDataList;
