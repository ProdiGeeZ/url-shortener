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
            .send({
                "url": "https://www.example.com/some/long/url",
                "descriptor": "Url Description"
            })
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
    test('201: Should create a new record with extra random keys', () => {
        return request(app)
            .post("/api/shorten")
            .send({
                "url": "https://www.example.com/some/long/url",
                "descriptor": "Url Description",
                "xylophone": "this is random"
            })
            .expect(201)
            .then(({ body }) => {
                const { url } = body;
                expect(url).toMatchObject({
                    id:  expect.any(Number),
                    url: 'https://www.example.com/some/long/url',
                    short_code: expect.any(String),
                    access_count: 0,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                })
            })
    });
    test('201: Should create a new record without the descriptor key', () => {
        return request(app)
            .post("/api/shorten")
            .send({
                "url": "https://www.example.com/some/long/url",
            })
            .expect(201)
            .then(({ body }) => {
                const { url } = body;
                expect(url).toMatchObject({
                    id:  expect.any(Number),
                    url: 'https://www.example.com/some/long/url',
                    short_code: expect.any(String),
                    access_count: 0,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                })
            })
    });
    test('400: Should return an error message when the url is empty', () => {
        return request(app)
            .post("/api/shorten")
            .send({
                "url": "",
                "descriptor": "Description"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: Invalid or missing URL");
            })
    });
    test('400: Should return an error message when the url is invalid', () => {
        return request(app)
            .post("/api/shorten")
            .send({
                "url": 1,
                "descriptor": "Description"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: Invalid or missing URL");
            })
    });
});
