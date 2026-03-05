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

### Quantize Endpoint

**POST** `/v1.0/quantize`

Analyzes and quantizes a given URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Headers:**
```
Content-Type: application/json
```

### Examples

Google Docs:
```bash
curl -X POST http://localhost:20001/v1.0/quantize \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://docs.google.com/document/d/1stgIumhJOSl9bjoFfCvDFK7ExOBlkriL0y-bM6nMTiM/edit?tab=t.0"}'
```

Wikipedia:
```bash
curl -X POST http://localhost:20001/v1.0/quantize \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D1%88%D0%B0%D0%BB,_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%9B%D0%B0%D0%B7%D0%B0%D1%80%D0%B5%D0%B2%D0%B8%D1%87"}'
```

Website:
```bash
curl -X POST http://localhost:20001/v1.0/quantize \
  -H 'Content-Type: application/json' \
  -d '{"url":"http://nextflight.ru"}'
```

## Project Structure

- `src/` - TypeScript source code
  - `api/` - API endpoints and routes
  - `services/` - Business logic services
  - `entity/` - Data models
  - `data-source.ts` - Data source configuration
  - `index.ts` - Application entry point
- `docker/` - Docker configuration and deployment files
- `Makefile` - Build and deployment commands

## Development

The project uses TypeScript and is containerized with Docker for easy deployment and testing.