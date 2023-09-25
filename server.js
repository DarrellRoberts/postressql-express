const express = require('express')
const app = express()
require('colors');
require('dotenv').config()
const PORT = 8080;
const {  Pool, Client } = require("pg");
const pool = new Pool();
app.use(express.json());
const cors = require('cors')

// allows access to API from frontend, only works in frontend if server is running
// unless backend is deployed with e.g. render.com
app.use(cors());

app.get("/", (req,res) => {
    res.send("Welcome to my API")
})

app.get('/fighters', (req,res) => {
    pool
    .query("SELECT * FROM fighters;")
    .then(data => res.json(data.rows))
    .catch(e => res.sendStatus(500).send
    ("Something went wrong"))
})

app.get("/time", async (req,res) => {
    await pool.query('SELECT NOW()', (err, response) => {
    res.send(response.rows);
    // pool.end(); 
});
})

// paramaterised queries to prevent users from destroying your database
app.get("/fighters/:id", (req, res) => {
    const { id } = req.params;
    pool
    .query("SELECT * FROM fighters WHERE id=$1;", [id])
    .then(data => res.json(data.rows))
    .catch(e => res.sendStatus(500).json(e));
});

app.post("/fighters", (req, res) => {
    const { first_name, last_name, country_id, style } = req.body
    pool
    .query("INSERT INTO fighters (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4) RETURNING *", 
    [first_name, last_name, country_id, style])
    .then(data => res.json(data.rows))
    .catch((e) => res.sendStatus(500).json(e));
})

// Edit

// Delete

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.rainbow) // confirmation that server is running
})