const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");


beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
});

