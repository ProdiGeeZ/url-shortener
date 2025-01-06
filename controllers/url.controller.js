const { insertNewUrl } = require("../models/url.model");
const { validateURL } = require("../utils");

exports.postNewUrl = (req, res, next) => {
    const { url, descriptor } = req.body;
    if (!url || typeof url !== 'string' || !validateURL(url)) {
        return next({ status: 400, msg: "Bad Request: Invalid or missing URL" });
    }
    insertNewUrl(url, descriptor)
        .then((url) => {
            res.status(201).send({ url, msg: "Short URL created successfully" })
        }).catch(next);
}