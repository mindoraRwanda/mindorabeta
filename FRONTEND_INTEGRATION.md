# Frontend Integration Guide

This guide provides all the necessary information for frontend developers to integrate with the Mindora API.

## 🌐 Base URL

**Development:** `http://localhost:5000/api/v1`
**Production:** `https://api.mindora.com/api/v1` (Example)

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

1.  **Login/Register:**
    *   Endpoint: `POST /auth/login` or `POST /auth/register`
    *   Response includes `accessToken` and `refreshToken`.
2.  **Authenticated Requests:**
    *   Include the `accessToken` in the `Authorization` header of every request.
    *   Format: `Authorization: Bearer <your_access_token>`
3.  **Token Refresh:**
    *   When `accessToken` expires (401 Unauthorized), use `POST /auth/refresh-token` with the `refreshToken` to get a new pair.

## 📦 Response Format

All API responses follow a consistent JSON structure.

### Success Response (`200`, `201`)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // ... payload data
  }
}
```

### Error Response (`400`, `401`, `403`, `404`, `500`)

```json
{
  "success": false,
  "message": "Error description message",
  "error": {
    // Optional details (stack trace in dev mode)
  }
}
```

### Validation Error (`422`)

```json
{
  "success": false,
  "message": "Validation error: email: Invalid email address",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "email", "message": "Invalid email address" }
    ]
  }
}
```

## 📄 Pagination

List endpoints support pagination using query parameters:

*   `page`: Page number (default: 1)
*   `limit`: Items per page (default: 10, max: 100)

**Response Structure:**

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalItems": 50,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🔌 Real-time (Socket.IO)

**Connection URL:** `http://localhost:5000` (Root URL, not `/api/v1`)

**Authentication:**
Pass the `token` in the handshake auth object:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'Bearer <your_access_token>'
  }
});
```

### Events

| Direction | Event Name | Description | Payload |
| :--- | :--- | :--- | :--- |
| **Client -> Server** | `join_room` | Join a specific chat room | `{ roomId: string }` |
| **Client -> Server** | `send_message` | Send a text message | `{ recipientId: string, content: string }` |
| **Client -> Server** | `typing_start` | User started typing | `{ roomId: string }` |
| **Client -> Server** | `typing_stop` | User stopped typing | `{ roomId: string }` |
| **Server -> Client** | `receive_message` | New message received | `{ id: string, senderId: string, content: string, ... }` |
| **Server -> Client** | `notification` | New notification | `{ type: string, message: string, ... }` |
| **Server -> Client** | `user:online` | User came online | `{ userId: string }` |
| **Server -> Client** | `user:offline` | User went offline | `{ userId: string }` |

## 📂 File Uploads

Use `multipart/form-data` for endpoints that accept files (e.g., avatar upload).

*   **Avatar:** Field name `avatar`
*   **Documents:** Field name `document`
*   **Post Images:** Field name `images` (supports multiple)

## 🗂️ Data Types & Enums

### User Roles
*   `PATIENT`
*   `THERAPIST`
*   `ADMIN`

### Appointment Status
*   `PENDING`
*   `CONFIRMED`
*   `COMPLETED`
*   `CANCELLED`
*   `NO_SHOW`

### Appointment Type
*   `VIDEO`
*   `AUDIO`
*   `CHAT`
*   `IN_PERSON`

### Mood Levels
*   `VERY_SAD`
*   `SAD`
*   `NEUTRAL`
*   `HAPPY`
*   `VERY_HAPPY`

### Notification Types
*   `APPOINTMENT`
*   `MESSAGE`
*   `POST`
*   `SYSTEM`
*   `ACHIEVEMENT`

## 🛠️ Tools & Resources

*   **Swagger UI:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs) - Interactive API testing.
*   **Postman Collection:** Import `postman_collection.json` from the root directory.
*   **Detailed Docs:** See `docs/api/` for endpoint-specific details.
