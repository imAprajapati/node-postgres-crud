const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbConfig = {
  user: 'your_username', // replace with your username
  host: 'your_host', // replace with your host
  database: 'your_database_name', // replace with your database name
  password: 'your_password', // replace with your password
  port: 5432,
};

const client = new Client(dbConfig);

client.connect();

// Create (Insert) Operation
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const insertQuery = `
      INSERT INTO users (name, email, age)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const insertResult = await client.query(insertQuery, [name, email, age]);
    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read (Retrieve) Operation
app.get('/users', async (req, res) => {
  try {
    const selectQuery = 'SELECT * FROM users;';
    const selectResult = await client.query(selectQuery);
    res.json(selectResult.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Operation
app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email, age } = req.body;
  try {
    const updateQuery = `
      UPDATE users
      SET name = $1, email = $2, age = $3
      WHERE id = $4
      RETURNING *;
    `;

    const updateResult = await client.query(updateQuery, [name, email, age, id]);
    res.json(updateResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Operation
app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deleteQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING *;
    `;

    const deleteResult = await client.query(deleteQuery, [id]);
    res.json(deleteResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
