const express = require('express');
const { postNewUrl, getOriginalUrl, putOriginalUrl, deleteUrl, getUrlStats } = require('./controllers/url.controller');

const app = express();
app.use(express.json());

app.post('/api/shorten', postNewUrl)
app.get('/api/shorten/:shortcode', getOriginalUrl)
app.put('/api/shorten/:shortcode', putOriginalUrl)
app.delete('/api/shorten/:shortcode', deleteUrl)
app.get('/api/shorten/:shortcode/stats', getUrlStats)

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    res.status(status).send({ msg: message });
});

module.exports = app;