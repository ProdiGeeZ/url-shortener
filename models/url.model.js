const format = require("pg-format");
const db = require("../db/connection.js");

exports.insertNewUrl = (url, descriptor) => {
    if (url === '') {
        throw new createError.BadRequest();
    }
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