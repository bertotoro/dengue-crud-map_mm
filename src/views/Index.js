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
  Col,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import {  Line, Scatter, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import classnames from "classnames";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);


const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [previousForm, setPreviousForm] = useState(null);


  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
    };

    fetchData();
  }, []);

  // Delete data
  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
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
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  // Update data
  const handleUpdate = async () => {
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      
      await updateDoc(dengueDocRef, { ...editForm });
      setDengueData(dengueData.map((data) =>
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
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: "ascending" });

  const sortedData = [...dengueData].sort((a, b) => {
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


  const [activeNav, setActiveNav] = useState(1); // State to manage active tab
  const [scatterFilter, setScatterFilter] = useState("month");


//Line Chart
// Prepare data for the chart
const getChartData = () => {
  const groupedData = {};

  // Group data by month or year based on activeNav
  dengueData.forEach(data => {
    const date = new Date(data.date);
    const key = activeNav === 1 
      ? date.toLocaleString('default', { month: 'long', year: 'numeric' }) 
      : date.getFullYear();

    if (!groupedData[key]) {
      groupedData[key] = { cases: 0, deaths: 0 }; // Initialize deaths to 0
    }
    groupedData[key].cases += data.cases;
    groupedData[key].deaths += data.deaths; // Correctly accumulate deaths
  });

  const labels = Object.keys(groupedData);
  const casesData = labels.map(label => groupedData[label].cases);
  const deathsData = labels.map(label => groupedData[label].deaths); // Collect deaths data

 
  
  return {
    labels,
    datasets: [
      {
        label: 'Dengue Cases by Date',
        data: casesData,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Dengue Deaths by Date',
        data: deathsData,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.4)', // Color for deaths
        borderColor: 'rgba(255, 99, 132, 1)', // Border color for deaths
      }
    ],
  };
};

const chartData = getChartData();

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
  };


  // ScatterChart
  const getScatterChartData = () => {
    const filteredCasesData = scatterFilter === "month"
      ? dengueData.map((data) => {
          const date = new Date(data.date);
          return {
            x: date.getMonth() + 1, // Months are 0-based in JS Date
            y: data.cases,
          };
        })
      : dengueData.map((data) => {
          const date = new Date(data.date);
          return {
            x: date.getFullYear(),
            y: data.cases,
          };
        });
  
    const filteredDeathsData = scatterFilter === "month"
      ? dengueData.map((data) => {
          const date = new Date(data.date);
          return {
            x: date.getMonth() + 1, // Months are 0-based in JS Date
            y: data.deaths, // Assuming 'deaths' is a field in your data
          };
        })
      : dengueData.map((data) => {
          const date = new Date(data.date);
          return {
            x: date.getFullYear(),
            y: data.deaths, // Assuming 'deaths' is a field in your data
          };
        });
  
    return {
      datasets: [
        {
          label: 'Dengue Deaths',
          data: filteredDeathsData,
          backgroundColor: 'rgba(255,99,132,0.4)', // Different color for deaths
          borderColor: 'rgba(255,99,132,1)', // Different border color for deaths
          borderWidth: 1,
        },
        {
          label: 'Dengue Cases',
          data: filteredCasesData,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        }
        
      ],
    };
  };


//bubbleChart
const [bubbleFilter, setBubbleFilter] = useState("month"); // New state for bubble chart filter

// Prepare data for the bubble chart with month/year filter
const getBubbleChartData = () => {
  const bubbleCasesData = dengueData
    .filter(data => {
      const date = new Date(data.date);
      return bubbleFilter === "month" ? date.getMonth() + 1 : date.getFullYear();
    })
    .map(data => {
      const date = new Date(data.date);
      return {
        x: bubbleFilter === "month" ? date.getMonth() + 1 : date.getFullYear(), // Filter based on selection
        y: data.cases,
        r: Math.sqrt(data.deaths) * 2, // Bubble radius based on deaths
      };
    });

  const bubbleDeathsData = dengueData
    .filter(data => {
      const date = new Date(data.date);
      return bubbleFilter === "month" ? date.getMonth() + 1 : date.getFullYear();
    })
    .map(data => {
      const date = new Date(data.date);
      return {
        x: bubbleFilter === "month" ? date.getMonth() + 1 : date.getFullYear(), // Filter based on selection
        y: data.deaths,
        r: Math.sqrt(data.cases) * 2, // Bubble radius based on cases
      };
    });

  return {
    datasets: [
      {
        label: 'Dengue Cases by Mortality Rate',
        data: bubbleCasesData,
        backgroundColor: 'rgba(255,99,132,0.4)', // Different color for deaths
        borderColor: 'rgba(255,99,132,1)',
        
      },
      {
        label: 'Dengue Deaths by Case Volume',
        data: bubbleDeathsData,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)', // Different border color for deaths
      },
    ],
  };
};

 


  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col xl="11">
            <Card className="shadow" style={{ marginBottom: "40px" }}>
              <CardHeader className="border-0">
                <h3 className="mb-0">Dengue Data List</h3>
              </CardHeader>
              <CardBody>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" onClick={() => requestSort('location')}>
                      Location
                      {sortConfig.key === 'location' && (
                        <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                      )}
                    </th>
                    <th scope="col" onClick={() => requestSort('cases')}>
                      Cases
                      {sortConfig.key === 'cases' && (
                        <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                      )}
                    </th>
                    <th scope="col" onClick={() => requestSort('deaths')}>
                      Deaths
                      {sortConfig.key === 'deaths' && (
                        <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                      )}
                    </th>
                    <th scope="col" onClick={() => requestSort('date')}>
                      Date
                      {sortConfig.key === 'date' && (
                        <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                      )}
                    </th>
                    <th scope="col" onClick={() => requestSort('regions')}>
                      Regions
                      {sortConfig.key === 'regions' && (
                        <i className={`ni ${sortConfig.direction === 'ascending' ? 'ni-bold-up' : 'ni-bold-down'}`}></i>
                      )}
                    </th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
              </Table>

                {/* Scrollable Body */}
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
                                name="location"
                                value={editForm.location}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.location}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="number"
                                name="cases"
                                value={editForm.cases}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.cases}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="number"
                                name="deaths"
                                value={editForm.deaths}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.deaths}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="date"
                                name="date"
                                value={editForm.date}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.date}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <input
                                type="text"
                                name="regions"
                                value={editForm.regions}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <span onDoubleClick={() => handleEdit(data)}>{data.regions}</span>
                            )}
                          </td>
                          <td>
                            {editingId === data.id ? (
                              <>
                                <Button color="success" onClick={handleUpdate} size="sm">  Save </Button>
                                <Button color="danger" onClick={handleCancel} size="sm">  Cancel </Button>
                              </>
                            ) : (
                              <Button
                                color="danger"
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(data.id);
                                }}
                                size="sm"
                              >
                                Delete
                              </Button>
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

          



              <Row className="mt-5">
                        <Col className="mb-5 mb-xl-0" xl="8">
                          <Card className="bg-gradient-default shadow " style={{ marginBottom: "40px" }}>
                            <CardHeader className="bg-transparent">
                              <Row className="align-items-center">
                                <div className="col">
                                  <h6 className="text-uppercase text-light ls-1 mb-1">Dengue Cases Statistics</h6>
                                  <h2 className="text-white mb-0">Line Graph</h2>
                                </div>
                                <div className="col-auto">
                                  <Nav className="nav-pills-icons justify-content-end" pills>
                                    <NavItem>
                                      <NavLink
                                        className={classnames("mb-3", { active: activeNav === 1 })}
                                        onClick={(e) => toggleNavs(e, 1)}
                                      >
                                        Month
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        className={classnames("mb-3", { active: activeNav === 2 })}
                                        onClick={(e) => toggleNavs(e, 2)}
                                      >
                                        Year
                                      </NavLink>
                                    </NavItem>
                                  </Nav>
                                </div>
                              </Row>
                            </CardHeader>
                            <CardBody>
                              <div className="chart">
                                <Line data={chartData} />
                              </div>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col xl="8">
                          <Card className="bg-gradient-default shadow" style={{ marginBottom: "40px" }}>
                            <CardHeader className="bg-transparent">
                              <Row className="align-items-center">
                                <div className="col">
                                  <h6 className="text-uppercase text-light ls-1 mb-1">Dengue Cases Statistics</h6>
                                  <h2 className="text-white mb-0">Scatter Plot</h2>
                                </div>
                                <div className="col-auto">
                                  <Nav className="nav-pills-icons justify-content-end" pills>
                                    <NavItem>
                                      <NavLink
                                        className={classnames("mb-3", { active: scatterFilter === "month" })}
                                        onClick={() => setScatterFilter("month")}
                                      >
                                        Month
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        className={classnames("mb-3", { active: scatterFilter === "year" })}
                                        onClick={() => setScatterFilter("year")}
                                      >
                                        Year
                                      </NavLink>
                                    </NavItem>
                                  </Nav>
                                </div>
                              </Row>
                            </CardHeader>
                            <CardBody>
                              <div className="chart">
                                <Scatter options={{
                                    scales: {
                                      x: {
                                        title: {
                                          display: true,
                                          text: scatterFilter === "month" ? "Month" : "Year",
                                        },
                                        ticks: {
                                          callback: function(value) {
                                            return scatterFilter === "month"
                                              ? new Date(0, value - 1).toLocaleString('default', { month: 'long' })
                                              : value;
                                          },
                                        },
                                      },
                                      y: {
                                        title: {
                                          display: true,
                                          text: "Cases",
                                        },
                                        beginAtZero: true,
                                      },
                                    },
                                  }}
                                  data={getScatterChartData()}
                                />
                              </div>
                            </CardBody>
                          </Card>
                        </Col>

                        <Col xl="8">
                <Card className="bg-gradient-default shadow">
                  <CardHeader className="bg-transparent">
                    <Row className="align-items-center">
                      <div className="col">
                        <h6 className="text-uppercase text-light ls-1 mb-1">Dengue Cases Statistics</h6>
                        <h2 className="text-white mb-0">Bubble Chart</h2>
                      </div>
                      <div className="col-auto">
                        <Nav className="nav-pills-icons justify-content-end" pills>
                          <NavItem>
                            <NavLink
                              className={classnames("mb-3", { active: bubbleFilter === "month" })}
                              onClick={() => setBubbleFilter("month")}
                            >
                              Month
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames("mb-3", { active: bubbleFilter === "year" })}
                              onClick={() => setBubbleFilter("year")}
                            >
                              Year
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="chart">
                    <Bubble
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: bubbleFilter === "month" ? "Month" : "Year",
                      },
                      ticks: {
                        callback: function(value) {
                          // Check if we are filtering by month or year
                          return bubbleFilter === "month"
                            ? new Date(Date.parse(value + " 1, 2000")).toLocaleString('default', { month: 'long' }) // Convert month to long format
                            : value; // Return the year as is
                        },
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Cases",
                      },
                      beginAtZero: true,
                    },
                  },
                }}
                data={getBubbleChartData()}
              />

                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

        </Row>
      </Container>
    </>
  );
};

export default DengueDataList;
