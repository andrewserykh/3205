# URL Quantizer

A Node.js/TypeScript service that processes and quantizes URLs, providing analysis and metadata extraction capabilities through a REST API.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Make

## Quick Start

### Build and Run

```bash
make build    # Build the Docker image
make up       # Start the service
make down     # Stop the service
make logs     # View service logs
```

The service will be available at `http://localhost:20001`

## API Documentation

### 1. Create Short URL

**POST** `/v1.0/quantize`

Analyzes a given URL and creates a short quantized version with metadata extraction.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response (201 Created):**
```json
{
  "uql": "abc123",
  "shortUrl": "http://localhost:20001/abc123",
  "meta": {
    "title": "Example Domain",
    "description": "Example of a domain",
    "image": null
  }
}
```

**Error Cases:**
- 400: Empty request body or missing/invalid "url" field
- 400: Invalid URL format
- 500: Internal server error during quantization

---

### 2. Get All Links

**GET** `/v1.0/quantize`

Retrieves all stored quantized links.

**Response (200 OK):**
```json
[
  {
    "uql": "abc123",
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "Example of a domain",
    "image": null,
    "created": "2026-03-06T08:30:39.883Z"
  }
]
```

---

### 3. Get Link by Short ID

**GET** `/v1.0/quantize/:uql`

Retrieves detailed information about a specific quantized link.

**Parameters:**
- `uql` (string, required): The short ID of the link

**Response (200 OK):**
```json
{
  "uql": "abc123",
  "url": "https://example.com",
  "meta": {
    "title": "Example Domain",
    "description": "Example of a domain",
    "image": null
  }
}
```

**Error Cases:**
- 404: Link not found
- 500: Internal server error

---

### 4. Redirect by Short ID

**GET** `/:uql`

Redirects to the original URL using the short ID (301 permanent redirect).

**Parameters:**
- `uql` (string, required): The short ID of the link

**Response:**
- 301 Moved Permanently (redirects to original URL)

**Error Cases:**
- 404: Link not found
- 500: Internal server error

---

### 5. Get All History

**GET** `/v1.0/history`

Retrieves all quantized links in the history.

**Response (200 OK):**
```json
[
  {
    "uql": "abc123",
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "Example of a domain",
    "image": null,
    "created": "2026-03-06T08:30:39.883Z"
  }
]
```

---

### 6. Get Recent Links

**GET** `/v1.0/history/:limit`

Retrieves the last N quantized links ordered by creation date (newest first).

**Parameters:**
- `limit` (number, required): Maximum number of links to retrieve (must be positive)

**Response (200 OK):**
```json
[
  {
    "uql": "abc123",
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "Example of a domain",
    "image": null,
    "created": "2026-03-06T08:30:39.883Z"
  }
]
```

**Error Cases:**
- 400: Limit is not a positive number
- 500: Internal server error

