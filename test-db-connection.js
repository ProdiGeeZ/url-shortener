const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const path = require('path');

const envPath = path.join(__dirname, `.env.${ENV}`);
require("dotenv").config({
    path: envPath
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Connected! Current time:", res.rows[0].now);
    }
    pool.end();
});
