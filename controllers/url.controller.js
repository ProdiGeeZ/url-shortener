const { insertNewUrl } = require("../models/url.model");

exports.postNewUrl = (req, res, next) => {
    const { url, descriptor } = req.body;
    if (!url || typeof url !== 'string') {
        return next({ status: 400, msg: "Bad Request: Invalid or missing URL" });
    }
    insertNewUrl(url, descriptor)
        .then((url) => {
            res.status(201).send({ url })
        }).catch(next);
}