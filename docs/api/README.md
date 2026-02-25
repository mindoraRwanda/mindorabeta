# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

Most endpoints require authentication via JWT Bearer token:

```
Authorization: Bearer <access_token>
```

### Getting a Token

1. Register: `POST /auth/register`
2. Login: `POST /auth/login`

Both return `accessToken` and `refreshToken`.

---

## API Sections

| Section                             | Auth Required | Description        |
| ----------------------------------- | ------------- | ------------------ |
| [🔓 Public API](public-api.md)      | ❌ No         | Open endpoints     |
| [Authentication](authentication.md) | Varies        | Auth flow          |
| [Patient API](patient-api.md)       | ✅ Yes        | Patient features   |
| [Therapist API](therapist-api.md)   | ✅ Yes        | Therapist features |
| [Admin API](admin-api.md)           | ✅ Yes        | Admin features     |
| [WebSocket](websocket.md)           | ✅ Yes        | Real-time events   |

---

## Response Format

All responses follow this structure:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

## HTTP Status Codes

| Code | Meaning                        |
| ---- | ------------------------------ |
| 200  | Success                        |
| 201  | Created                        |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized                   |
| 403  | Forbidden                      |
| 404  | Not Found                      |
| 409  | Conflict (duplicate)           |
| 429  | Rate Limited                   |
| 500  | Server Error                   |

---

## Rate Limiting

- **Auth endpoints**: 10 requests per minute
- **Password reset**: 3 requests per 15 minutes
- **General API**: 100 requests per minute

When rate limited, you'll receive a `429` status with retry information.

---

## Pagination

List endpoints support pagination:

| Parameter | Default | Description               |
| --------- | ------- | ------------------------- |
| `page`    | 1       | Page number               |
| `limit`   | 10      | Items per page (max: 100) |

Response includes:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```
