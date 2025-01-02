const db = require("./connection");

const seed = () => {
    return db
        .query(`DROP TABLE IF EXISTS urls;`)
        .then(() => {
            return db.query(`CREATE TABLE urls (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL UNIQUE,
            short_code VARCHAR(10) UNIQUE,
            access_count INTEGER,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
            );`)
        })
        .catch((error) => {
            console.log("Error Seeding Database", error);
        });
}

seed();