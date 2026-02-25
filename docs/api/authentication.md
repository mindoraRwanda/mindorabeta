# Authentication Guide

This document explains the authentication flow for Mindora API.

## Overview

Mindora uses **JWT (JSON Web Token)** based authentication with access and refresh tokens.

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   1. Login/Register                                          │
│      ─────────────────►                                      │
│                         Returns: accessToken + refreshToken  │
│                                                              │
│   2. API Request                                             │
│      Authorization: Bearer <accessToken>                     │
│      ─────────────────►                                      │
│                         Returns: Data                        │
│                                                              │
│   3. Token Expired                                           │
│      POST /auth/refresh-token { refreshToken }               │
│      ─────────────────►                                      │
│                         Returns: New tokens                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Token Types

### Access Token

- **Purpose**: Authenticate API requests
- **Expiry**: 15 minutes
- **Usage**: Include in `Authorization` header

### Refresh Token

- **Purpose**: Get new access tokens
- **Expiry**: 7 days
- **Usage**: Store securely, use with `/auth/refresh-token`

---

## Using Authentication

### Step 1: Login or Register

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Response:

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "PATIENT" },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
    }
  }
}
```

### Step 2: Make Authenticated Requests

```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Step 3: Refresh When Expired

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "dGhpcyBpcyBhIHJlZnJl..."}'
```

---

## Role-Based Access

Users have one of three roles:

| Role        | Description                 | Access Level       |
| ----------- | --------------------------- | ------------------ |
| `PATIENT`   | Regular users               | Basic features     |
| `THERAPIST` | Mental health professionals | Patient management |
| `ADMIN`     | System administrators       | Full access        |

### Role Hierarchy

```
ADMIN (can access everything)
  └── THERAPIST (can access therapist + patient features)
        └── PATIENT (can access patient features)
```

---

## Protected Endpoints

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Example (JavaScript)

```javascript
const response = await fetch('http://localhost:5000/api/v1/users/profile', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
```

---

## Logout

Invalidate tokens by calling logout:

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<refreshToken>"}'
```

---

## Password Management

### Change Password (Authenticated)

```bash
curl -X POST http://localhost:5000/api/v1/auth/change-password \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123"
  }'
```

### Reset Password (Forgot)

1. Request reset: `POST /auth/forgot-password`
2. Check email for reset link
3. Reset: `POST /auth/reset-password` with token

---

## Error Codes

| HTTP Code | Error                   | Description              |
| --------- | ----------------------- | ------------------------ |
| 401       | `UNAUTHORIZED`          | Missing or invalid token |
| 401       | `TOKEN_EXPIRED`         | Access token expired     |
| 401       | `INVALID_REFRESH_TOKEN` | Refresh token invalid    |
| 403       | `FORBIDDEN`             | Insufficient permissions |

---

## Security Best Practices

1. **Store tokens securely** - Use httpOnly cookies or secure storage
2. **Don't expose tokens** - Never include in URLs or logs
3. **Refresh proactively** - Before expiry to avoid failed requests
4. **Logout on suspicious activity** - Invalidate all tokens
5. **Use HTTPS** - Always in production
