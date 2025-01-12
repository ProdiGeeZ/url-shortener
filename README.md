# URL Shortening Service

A simple RESTful API built with Node.js, Express, and PostgreSQL that allows users to shorten long URLs, retrieve the original URLs, update or delete short URLs, and track statistics for short URLs.

---

## Features

- **Create Short URL**: Shorten a long URL into a unique short code.
- **Retrieve Original URL**: Retrieve the original URL using the short code.
- **Update Short URL**: Update an existing short URL.
- **Delete Short URL**: Delete an existing short URL.
- **Get Statistics**: Track the number of times a short URL has been accessed.

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) 
- [PostgreSQL](https://www.postgresql.org/) 

---

## Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ProdiGeeZ/url-shortener.git
   cd url-shortener
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root and configure the following variable (requires pgpass configuration): 
   ```env
   PGDATABASE=url_shortener
   ```

4. **Setup PostgreSQL Database**
    ```bash
   npm run setup
   ```

5. **Start the Server**
   ```bash
   npm start
   ```
   The server will be available at `http://localhost:3000`.

---

## API Endpoints

### 1. Create Short URL
**POST** `/api/shorten`

Request Body:
```json
{
  "url": "https://www.example.com/some/long/url"
}
```

Response:
- **201 Created**
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/some/long/url",
    "shortCode": "abc123",
    "descriptor": "description of shortened link",
    "createdAt": "2021-09-01T12:00:00Z",
    "updatedAt": "2021-09-01T12:00:00Z"
  }
  ```
- **400 Bad Request**: Validation errors.

### 2. Retrieve Original URL
**GET** `/api/shorten/:shortCode`

Response:
- **200 OK**
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/some/long/url",
    "shortCode": "abc123",
    "descriptor": "description of shortened link",
    "createdAt": "2021-09-01T12:00:00Z",
    "updatedAt": "2021-09-01T12:00:00Z"
  }
  ```
- **404 Not Found**: If the short code does not exist.

### 3. Update Short URL
**PUT** `/api/shorten/:shortCode`

Request Body:
```json
{
  "url": "https://www.example.com/some/updated/url"
}
```

Response:
- **200 OK**
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/some/updated/url",
    "shortCode": "abc123",
    "descriptor": "description of shortened link",
    "createdAt": "2021-09-01T12:00:00Z",
    "updatedAt": "2021-09-01T12:30:00Z"
  }
  ```
- **400 Bad Request**: Validation errors.
- **404 Not Found**: If the short code does not exist.

### 4. Delete Short URL
**DELETE** `/api/shorten/:shortCode`

Response:
- **204 No Content**: If the short URL was successfully deleted.
- **404 Not Found**: If the short code does not exist.

### 5. Get URL Statistics
**GET** `/shorten/:shortCode/stats`

Response:
- **200 OK**
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/some/long/url",
    "shortCode": "abc123",
    "descriptor": "description of shortened link",
    "accessCount": 10
    "createdAt": "2021-09-01T12:00:00Z",
    "updatedAt": "2021-09-01T12:00:00Z",
  }
  ```
- **404 Not Found**: If the short code does not exist.

---

## Database Schema

**Table: urls**
| Column       | Type         | Description                              |
|--------------|--------------|------------------------------------------|
| id           | SERIAL       | Primary key                             |
| url          | TEXT         | Original long URL                       |
| short_code   | VARCHAR(10)  | Unique short code                       |
| descriptor   | VARCHAR(100) | Optional description for the URL        |
| access_count | INTEGER      | Number of times the short URL is accessed |
| created_at   | TIMESTAMP    | Timestamp when the URL was created      |
| updated_at   | TIMESTAMP    | Timestamp when the URL was last updated |

---

## Testing

1. **Run Tests**
   ```bash
   npm test
   ```

2. **API Testing**
   Use tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/) to test the API endpoints.

---

#### Roadmap.sh
##### Project Brief: `https://roadmap.sh/projects/url-shortening-service` 