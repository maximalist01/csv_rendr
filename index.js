const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Store the latest fetched data
let cachedData = [];

// Function to fetch data from the API
async function fetchData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products"); // Replace with your API
    const data = await response.json();

    cachedData = data; // Store data in memory
    fs.writeFileSync("data.csv", convertToCSV(data)); // Save it to CSV
    console.log("Data fetched and saved to CSV.");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Convert JSON to CSV format
function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((item) => Object.values(item).join(","));
  return [headers, ...rows].join("\n");
}

// Fetch data every 5 minutes (300000 ms)
setInterval(fetchData, 300000);

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Data Fetcher!</h1><p>Endpoints:</p><ul><li><a href='/data'>View Data (JSON)</a></li><li><a href='/download'>Download CSV</a></li></ul>"
  );
});
// Endpoint to serve the latest data
app.get("/data", (req, res) => {
  res.json(cachedData);
});

// Endpoint to download the CSV
app.get("/download", (req, res) => {
  res.download("data.csv", "data.csv");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  fetchData(); // Fetch data once when the server starts
});
