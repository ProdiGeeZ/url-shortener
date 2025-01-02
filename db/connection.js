const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "test";

require('dotenv').config({
    path: `${__dirname}/../.env.${ENV}`,
});


if (!process.env.PGDATABASE) {
    throw new Error("No PGDATABASE configured");
}

const config = {};

if (ENV === 'development') {
    config.connectionString = process.env.PG_DATABASE;
    config.max = 5;
} else if (ENV === 'test') {
    config.connectionString = process.env.PGDATABASE;
    config.max = 5;
}

module.exports = new Pool();