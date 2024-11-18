import React, { useState } from "react";
import Papa from "papaparse"; // To parse CSV files
import { collection, addDoc } from "firebase/firestore"; // Firestore
import { db } from "../firebase"; // Firebase configuration
import { Button, Spinner } from "reactstrap"; // Import Reactstrap Button and Spinner

const CsvUploader = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload status

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    setIsUploading(true);

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
          const batch = collection(db, "NatData");

          for (const row of rows) {
            // Ensure all fields are present before upload and map the correct headers
            if (
              row.Respondents && row.Age && row.sex && row.Ethnic &&
              row.academic_perfromance && row.adamemic_description &&
              row.IQ && row.type_school && row.socio_economic_status && 
              row.Study_Habit && row.NAT_Results
            ) {
              await addDoc(batch, {
                respondents: row.Respondents,                    // Mapping Respondents to respondents
                age: Number(row.Age),                           // Mapping Age to age (numeric)
                sex: row.sex,                                   // Mapping sex to sex
                ethnic: row.Ethnic,                             // Mapping Ethnic to ethnic
                academicPerformance: Number(row.academic_perfromance),  // Mapping academic_perfromance to academicPerformance (numeric)
                academicDescription: row.adamemic_description,  // Mapping adamemic_description to academicDescription
                iq:row.IQ,                                      // Mapping IQ to iq 
                typeSchool: row.type_school,                    // Mapping type_school to typeSchool
                socioStatus: row.socio_economic_status,         // Mapping socio_economic_status to socioStatus
                studyHabit: row.Study_Habit,                    // Mapping Study_Habit to studyHabit
                natResult: Number(row.NAT_Results)              // Mapping NAT_Results to natResult (numeric)
              });
            } else {
              console.error("Missing required fields in row: ", row);
            }
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
    </div>
  );
};

export default CsvUploader;
