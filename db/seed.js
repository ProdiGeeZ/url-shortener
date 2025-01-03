const format = require("pg-format");
const db = require("./connection");

const seed = ({ urlData }) => {
    return db
        .query(`DROP TABLE IF EXISTS urls;`)
        .then(() => {
            return db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        })
        .then(() => {
            return db.query(`CREATE TABLE urls (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL UNIQUE,
                short_code VARCHAR(10) UNIQUE DEFAULT SUBSTRING(uuid_generate_v4()::TEXT FROM 1 FOR 8),
                descriptor VARCHAR(100),
                access_count INTEGER DEFAULT 0 CHECK (access_count >= 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`)
        })
        .then(() => {
            const urlQuery = format(
                `
                INSERT INTO urls (url, short_code, descriptor, access_count, created_at, updated_at)
                VALUES %L;`,
                urlData.map(({ url, short_code, descriptor, access_count, created_at, updated_at }) =>
                    [url, short_code, descriptor, access_count, created_at, updated_at]
                )
            );
            return db.query(urlQuery);
        })
        .catch((error) => {
            console.log("Error Seeding Database", error);
        });
}

module.exports = seed;