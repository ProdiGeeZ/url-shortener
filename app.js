const express = require('express');
const { postNewUrl, getOriginalUrl, putOriginalUrl, deleteUrl, getUrlStats } = require('./controllers/url.controller');
const { getHealthStatus, send404 } = require('./controllers/health.controller');
const cors = require('cors');
const { logger, requestLogger, errorLogger, requestId } = require('./config/logger');

const app = express();

app.use(requestId);

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.get('/health', getHealthStatus);

app.post('/api/shorten', postNewUrl)
app.get('/api/shorten/:shortcode', getOriginalUrl)
app.put('/api/shorten/:shortcode', putOriginalUrl)
app.delete('/api/shorten/:shortcode', deleteUrl)
app.get('/api/shorten/:shortcode/stats', getUrlStats)
app.all("*", send404);

app.use(errorLogger);

app.use((err, req, res, next) => {
    logger.error({
        error: {
            message: err.message,
            status: err.status || 500,
            stack: err.stack
        },
        requestId: req.id
    });

    const status = err.status || 500;
    const message = err.msg || "Internal Server Error";
    res.status(status).send({ msg: message });
});

module.exports = app;