# Backend API - Kudrat Anand RA2311026010844

Lightweight, optimized Express.js backend.

## Setup

```bash
npm install
npm start
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/process` | Process data array |
| POST | `/api/stats` | Calculate statistics |
| POST | `/api/filter` | Filter items |

## Example Requests

### POST /api/stats
```json
{
  "numbers": [1, 2, 3, 4, 5]
}
```

### POST /api/filter
```json
{
  "items": [{"name": "A", "age": 25}, {"name": "B", "age": 30}],
  "criteria": {"age": {"min": 26}}
}
```

## Author
Kudrat Anand - RA2311026010844
