const format = require("pg-format");
const db = require("../db/connection.js");

exports.insertNewUrl = (url, descriptor) => {
    const insertObj = [[url, descriptor]];
    const insertQuery = format(`
        INSERT INTO urls(url, descriptor)
        VALUES %L RETURNING *;
    `, insertObj);
    return db.query(insertQuery)
        .then((result) => {
            return result.rows[0]
        })
};

exports.fetchOriginalUrl = (shortcode) => {
    const queryStr = `
        SELECT * FROM urls WHERE short_code = $1;
    `;
    return db.query(queryStr, [shortcode])
        .then((result) => {
            return result.rows[0]
        });
};

