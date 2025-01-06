const { insertNewUrl } = require("../models/url.model");

exports.postNewUrl = (req, res, next) => {
    const { url, descriptor } = req.body;
    return insertNewUrl(url, descriptor)
        .then((url) => {
            res.status(201).send({ url })
        }).catch(next);
}