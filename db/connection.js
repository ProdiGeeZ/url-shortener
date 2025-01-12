const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`,
});

const config = {};

if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 150;
    config.ssl = {
        rejectUnauthorized: false
    };
} else {
    config.database = process.env.PGDATABASE;
    config.max = 5;
}

module.exports = new Pool(config);
