const express = require('express');
const { postNewUrl } = require('./controllers/url.controller');

const app = express();
app.use(express.json());

app.post('/api/shorten', postNewUrl)

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    if (err.code === '23502') {
        return res.status(400).send({ msg: "Bad Request: Invalid request body" });
    }
    res.status(status).send({ msg: message });
});

module.exports = app;