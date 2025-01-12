const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 150;
    config.ssl = {
        rejectUnauthorized: false
    };
} else if (ENV === "development") {
    config.connectionString = process.env.PG_DATABASE;
    config.max = 5;
} else if (ENV === "test") {
    config.connectionString = process.env.PGDATABASE;
    config.max = 5;
}

module.exports = new Pool(config);
