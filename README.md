# URL Quantizer

A Node.js/TypeScript service that processes and quantizes URLs, providing analysis and metadata extraction capabilities through a REST API.

Andrew Serykh

## Quick Start

### Build and Run

```bash
make build    # Build the Docker image
make up       # Start the service
make down     # Stop the service
make logs     # View service logs
```

The service will be available at `http://localhost:8080`

### Docker compose

```base
docker-compose up -d
docker-compose down
```


### CURL Examples

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

