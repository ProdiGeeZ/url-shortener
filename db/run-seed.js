const data = require('../db/data/dev-data/index.js');
const seed = require("./seed.js");
const db = require("../db/connection");

const runSeed = () => {
    return seed(data).then(() => db.end());
};

runSeed();
