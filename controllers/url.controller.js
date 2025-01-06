const { insertNewUrl, fetchOriginalUrl } = require("../models/url.model");
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

exports.getOriginalUrl = (req, res, next) => {
    const { shortcode } = req.params;
    fetchOriginalUrl(shortcode)
        .then((url) => {
            if (!url) {
                return next({ status: 404, msg: "Not Found - Short URL does not exist" });
            }
            res.status(200).send({ url })
        }).catch(next);
}