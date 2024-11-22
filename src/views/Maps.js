import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ph from "../ph.json"; // Your PH GeoJSON data
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firebase imports
import { Card,CardBody, CardTitle, Container, Row } from "reactstrap"; // For layout (if needed)

const MapComponent = () => {
  const [geoData, setGeoData] = useState(null);

  // Fetch dengue data from Firestore
  const fetchDengueData = async () => {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "dengueData"));
    
    const dengueData = [];
    snapshot.forEach((doc) => dengueData.push({ id: doc.id, ...doc.data() }));
    
    return dengueData;
  };

  // UseEffect to enrich GeoJSON with Firebase data
  useEffect(() => {
    const enrichGeoJSON = async () => {
      // Fetch dengue data from Firebase
      const dengueData = await fetchDengueData();

      // Aggregate the dengue cases by region
      const aggregatedDengueData = dengueData.reduce((acc, data) => {
        const regionName = data.regions?.toLowerCase(); // Ensure region name is lowercase for comparison
        if (regionName) {
          if (!acc[regionName]) {
            acc[regionName] = { cases: 0, deaths: 0 };
          }
          acc[regionName].cases += data.cases || 0; // Sum up cases
          acc[regionName].deaths += data.deaths || 0; // Sum up deaths
        }
        return acc;
      }, {});

      // Enrich GeoJSON data with aggregated dengue data
      const enrichedData = { ...ph };
      enrichedData.features = enrichedData.features.map((feature) => {
        const regionName = feature.properties.name.toLowerCase(); // Extract region name from GeoJSON

        // Find matching aggregated data
        const dengueInfo = aggregatedDengueData[regionName];

        // Return enriched GeoJSON feature
        return {
          ...feature,
          properties: {
            ...feature.properties,
            cases: dengueInfo ? dengueInfo.cases : 0,
            deaths: dengueInfo ? dengueInfo.deaths : 0,
          },
        };
      });

      setGeoData(enrichedData);
    };

    enrichGeoJSON();
  }, []);

  // Function to determine color based on number of cases
  const getColor = (density) => {
    return density > 200000
      ? "#2C003E"  // Purple (Extreme)
      : density > 100000
      ? "#800026"  // Dark Red (Very High)
      : density > 50000
      ? "#FF0000"  // Bright Red (High)
      : density > 10000
      ? "#FFA500"  // Orange (Moderate)
      : density > 5000
      ? "#FFFF00"  // Yellow (Low)
      : density > 1000
      ? "#00FF00"  // Green (Very Low)
      : density > 100
      ? "#00FFFF"  // Cyan (Minimal)
      : density > 10
      ? "#0000FF"  // Blue (Barely Any)
      : "#FFFFFF"; // White (No data)
};

  // Style for GeoJSON polygons based on the cases
  const style = (feature) => {
    return {
      fillColor: getColor(feature.properties.cases),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  return (
    <>
      <div className="header bg-gradient-default shadow pb-8 pt-5 pt-md-8">
        <div className="header-body"></div>
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card
                className="shadow border-0"
                style={{ marginTop: "40px" }}
              >
                <MapContainer
                  center={[12.8797, 121.774]}
                  zoom={6}
                  style={{ height: "600px", width: "100%", borderRadius: "5px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {geoData && <GeoJSON data={geoData} style={style} />}
                  
                </MapContainer>
              </Card>

             {/* Legend Card */}

            <Card className="shadow mt-4" style={{ borderRadius: '15px', width: '300px' }}>
              <CardBody>
                <CardTitle tag="h5" className="mb-3">Dengue Cases Color Legend</CardTitle>
                <div className="info legend" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#2C003E', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    200,000+ Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#800026', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    100,000 - 199,999 Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#FF0000', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    50,000 - 99,999 Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#FFA500', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    10,000 - 49,999 Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#FFFF00', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    5,000 - 9,999 Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#00FF00', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    1,000 - 4,999 Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#00FFFF', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    100 - 999 Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#0000FF', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px' }}></i>
                    10 - 99 Cases
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ backgroundColor: '#FFFFFF', width: '30px', height: '30px', borderRadius: '5px', marginRight: '10px', border: '1px solid black' }}></i>
                    0 - 9 Cases
                  </div>
                </div>
              </CardBody>
            </Card>


            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MapComponent;
