import React, { useState } from "react";
import Papa from "papaparse"; // To parse CSV files
import { collection, addDoc } from "firebase/firestore"; // Firestore
import { db } from "../firebase"; // Firebase configuration
import { Button, Spinner, Progress } from "reactstrap"; // Reactstrap components

const CsvUploader = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [progress, setProgress] = useState(0); // Track upload progress

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    // Parse the CSV file
    Papa.parse(file, {
      header: true, // Assumes first row is header
      skipEmptyLines: true,
      complete: async function (results) {
        const rows = results.data;

        // Debugging log to ensure correct parsing
        console.log("Parsed CSV data: ", rows);

        // Check if rows were parsed successfully
        if (rows.length === 0) {
          alert("CSV file is empty or incorrectly formatted.");
          setIsUploading(false);
          return;
        }

        try {
          const batch = collection(db, "dengueData");
          const totalRows = rows.length;

          for (let i = 0; i < totalRows; i++) {
            const row = rows[i];

            // Ensure all fields are present before upload and map the correct headers
            if (row.loc && row.cases && row.deaths && row.date && row.Region && row.year) {
              await addDoc(batch, {
                location: row.loc, // Mapping loc to location
                cases: Number(row.cases), // Ensure cases are numeric
                deaths: Number(row.deaths), // Ensure deaths are numeric
                date: row.date, // Date as is
                regions: row.Region, // Mapping Region to regions
                year: Number(row.year), // Year as numeric
              });
            } else {
              console.error("Missing required fields in row: ", row);
            }

            // Update progress
            setProgress(Math.round(((i + 1) / totalRows) * 100));
          }

          alert("CSV data uploaded successfully!");
        } catch (error) {
          console.error("Error uploading CSV data: ", error);
        }

        setIsUploading(false);
      },
      error: function (error) {
        console.error("Error parsing CSV: ", error);
        setIsUploading(false);
      },
    });
  };

  return (
    <div>
      <h3>Upload CSV</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button 
        color="primary" 
        onClick={handleUpload} 
        disabled={isUploading}
        size="sm"
      >
        {isUploading ? (
          <>
            <Spinner size="sm" /> Uploading...
          </>
        ) : (
          "Upload"
        )}
      </Button>
      {isUploading && (
        <div style={{ marginTop: "20px" }}>
          <Progress value={progress} />
          <p>{progress}% completed</p>
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
