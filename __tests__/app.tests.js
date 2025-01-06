const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seed.js");
const testData = require("../db/data/test-data/index.js");


beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
});

describe('POST /api/shorten', () => {
    test('201: Should create a new record with all the correct keys', () => {
        return request(app)
            .post("/api/shorten")
            .send({ "url": "https://www.example.com/some/long/url" })
            .expect(201)
            .then(({ body }) => {
                const { url } = body;
                expect(url).toMatchObject({
                    id: 6,
                    url: 'https://www.example.com/some/long/url',
                    short_code: expect.any(String),
                    access_count: 0,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                })
            })
    });
    test('400: Should return an error message when the request body is invalid', () => {
        return request(app)
        .post("/api/shorten")
        .send({ "invald": "not valid" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Invalid request body");
        })
    });
});
