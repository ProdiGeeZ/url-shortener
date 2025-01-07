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
                const { url, msg } = body;
                expect(url).toMatchObject({
                    id: 6,
                    url: 'https://www.example.com/some/long/url',
                    short_code: expect.any(String),
                    descriptor: "Url Description",
                    access_count: 0,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                })
                expect(msg).toBe("Short URL created successfully");
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
                const { url, msg } = body;
                expect(url).toMatchObject({
                    id: expect.any(Number),
                    url: 'https://www.example.com/some/long/url',
                    short_code: expect.any(String),
                    descriptor: "Url Description",
                    access_count: 0,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                })
                expect(msg).toBe("Short URL created successfully");
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
                const { url, msg } = body;
                expect(url).toMatchObject({
                    id: expect.any(Number),
                    url: 'https://www.example.com/some/long/url',
                    short_code: expect.any(String),
                    descriptor: null,
                    access_count: 0,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                })
                expect(msg).toBe("Short URL created successfully");
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

describe('GET /api/shorten/:shortcode', () => {
    test('200: Fetch the correct record based on the shortcode', () => {
        return request(app)
            .get("/api/shorten/abc123")
            .expect(200)
            .then(({ body }) => {
                const { url } = body;
                expect(url).toMatchObject({
                    id: expect.any(Number),
                    url: "https://www.example.com/product/12345678",
                    short_code: "abc123",
                    descriptor: "product-page",
                    access_count: 15,
                    created_at: "2025-01-01T12:00:00.000Z",
                    updated_at: "2025-01-01T12:00:00.000Z",
                })
            })
    });
    test('404: Should send an error message when the shortcode does not exist', () => {
        return request(app)
            .get("/api/shorten/1")
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("Not Found - Short URL does not exist");
            })
    });
});

describe('PUT /api/shorten/:shortcode', () => {
    test('200: Should successfully update a record and return the updated object', () => {
        return request(app)
            .put("/api/shorten/abc123")
            .send({
                "url": "https://www.example.com/updated/url",
            })
            .expect(200)
            .then(({ body }) => {
                const { url } = body;
                expect(url).toMatchObject({
                    id: expect.any(Number),
                    url: "https://www.example.com/updated/url",
                    short_code: "abc123",
                    descriptor: expect.any(String),
                    access_count: expect.any(Number),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                })
            })
    });
    test('200: Should update the descriptor if provided with the correct shortcode', () => {
        return request(app)
            .put("/api/shorten/abc123")
            .send({
                "descriptor": "New Descriptor"
            })
            .expect(200)
            .then(({ body }) => {
                const { url } = body;
                expect(url).toMatchObject({
                    id: expect.any(Number),
                    url: expect.any(String),
                    short_code: "abc123",
                    descriptor: "New Descriptor",
                    access_count: expect.any(Number),
                    created_at: expect.any(String),
                    updated_at: expect.any(String),
                })
            })
    });
    test('404: Should return an error message when the shortcode does not exist', () => {
        return request(app)
            .put("/api/shorten/nonexistent")
            .send({
                "url": "https://www.example.com/updated/url",
                "descriptor": "Updated Description"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found - Short URL does not exist");
            })
    });
    test('400: Should return an error message when the provided url is invalid', () => {
        return request(app)
            .put("/api/shorten/abc123")
            .send({
                "url": "invalid-url",
                "descriptor": "Updated Description"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: Invalid URL");
            })
    });
    test('400: Should return an error message when the provided descriptor is invalid', () => {
        return request(app)
            .put("/api/shorten/abc123")
            .send({
                "url": "https://www.example.com/updated/url",
                "descriptor": 12345
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: Invalid descriptor");
            })
    });
    test('400: Should return an error message when both url and descriptor are missing', () => {
        return request(app)
            .put("/api/shorten/abc123")
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: Missing URL and descriptor");
            })
    });
});