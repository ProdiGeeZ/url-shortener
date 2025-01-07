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

exports.updateOriginalUrl = (shortcode, url, descriptor) => {
    const fields = [];
    const queryParams = [];

    if (url) {
        fields.push(`url = $${fields.length + 1}`);
        queryParams.push(url);
    }

    if (descriptor) {
        fields.push(`descriptor = $${fields.length + 1}`);
        queryParams.push(descriptor);
    }

    if (fields.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad Request: Missing URL and descriptor" });
    }

    const queryStr = `
        UPDATE urls
        SET ${fields.join(', ')}
        WHERE short_code = $${fields.length + 1}
        RETURNING *;
    `;
    queryParams.push(shortcode);

    return db.query(queryStr, queryParams)
        .then((result) => {
            return result.rows[0];
        });
};

exports.deleteUrlByShortcode = (shortcode) => {
    const checkQuery = `
        SELECT * FROM urls WHERE short_code = $1;
    `;
    return db.query(checkQuery, [shortcode])
        .then((result) => {
            if (result.rowCount === 0) {
                return Promise.reject({ status: 404, msg: "Not Found - Short URL does not exist" });
            }
            const deleteQuery = `
                DELETE FROM urls
                WHERE short_code = $1
                RETURNING *;
            `;
            return db.query(deleteQuery, [shortcode]);
        })
        .then((result) => {
            return result.rows[0];
        });
}