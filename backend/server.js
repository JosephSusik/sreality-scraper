const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 1234;

app.use(cors());


// Create a PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // Change to your Docker container's IP or hostname if needed
  database: 'postgres',
  password: 'postgres',
  port: 5438, // Default PostgreSQL port
});

// Define an API endpoint to fetch data
app.get('/data', async (req, res) => {
  try {
    const queryResult = await pool.query('SELECT * FROM inzerat');
    res.json(queryResult.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/data/:id', async (req, res) => {
  id = req.params.id;
  
  try {
    //const queryResult = await pool.query('SELECT * FROM inzerat');
    const queryResult = await pool.query(`SELECT * FROM inzerat WHERE inzerat_id = ${id}`);
    res.json(queryResult.rows[0]);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
