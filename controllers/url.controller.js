const { insertNewUrl, fetchOriginalUrl, updateOriginalUrl, deleteUrlByShortcode, fetchUrlStats } = require("../models/url.model");
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

exports.putOriginalUrl = (req, res, next) => {
    const { shortcode } = req.params;
    const { url, descriptor } = req.body;

    if (url && (typeof url !== 'string' || !validateURL(url))) {
        return next({ status: 400, msg: "Bad Request: Invalid URL" });
    }

    if (descriptor && typeof descriptor !== 'string') {
        return next({ status: 400, msg: "Bad Request: Invalid descriptor" });
    }

    if (!url && !descriptor) {
        return next({ status: 400, msg: "Bad Request: Missing URL and descriptor" });
    }

    updateOriginalUrl(shortcode, url, descriptor)
        .then((updatedUrl) => {
            if (!updatedUrl) {
                return next({ status: 404, msg: "Not Found - Short URL does not exist" });
            }
            res.status(200).send({ url: updatedUrl, msg: "Successfully updated record." });
        }).catch(next);
};

exports.deleteUrl = (req, res, next) => {
    const { shortcode } = req.params;
    deleteUrlByShortcode(shortcode)
        .then(() => {
            res.status(204).send({ msg: "Deleted record successfully." });
        }).catch(next);
};

exports.getUrlStats = (req, res, next) => {
    const { shortcode } = req.params;
    fetchUrlStats(shortcode)
        .then((urlStats) => {
            if (!urlStats) {
                return next({ status: 404, msg: "Not Found - Short URL does not exist" });
            }
        res.status(200).send({ urlStats })
    }).catch(next);
}