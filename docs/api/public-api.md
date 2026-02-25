# 🔓 Public API

These endpoints require **no authentication** and are publicly accessible.

Base URL: `http://localhost:5000/api/v1`

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "PATIENT"
}
```

| Field    | Type   | Required | Description                        |
| -------- | ------ | -------- | ---------------------------------- |
| email    | string | ✅       | Valid email address                |
| password | string | ✅       | Min 8 characters                   |
| fullName | string | ✅       | User's full name                   |
| role     | string | ❌       | `PATIENT` (default) or `THERAPIST` |

**Response: `201 Created`**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "PATIENT",
      "profile": {}
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token"
    }
  }
}
```

**Errors:**

- `400` - Validation error
- `409` - Email already exists

---

### POST /auth/login

Authenticate user and get tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response: `200 OK`**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "PATIENT"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token"
    }
  }
}
```

**Errors:**

- `401` - Invalid credentials

---

### POST /auth/forgot-password

Request a password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response: `200 OK`**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

> **Note:** Always returns 200 even if email doesn't exist (security measure).

---

### POST /auth/reset-password

Reset password using token from email.

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

**Response: `200 OK`**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Errors:**

- `400` - Invalid or expired token

---

### POST /auth/verify-email

Verify email address using token.

**Request Body:**

```json
{
  "token": "verification-token"
}
```

**Response: `200 OK`**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Errors:**

- `400` - Invalid token

---

### POST /auth/refresh-token

Get new access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "valid-refresh-token"
}
```

**Response: `200 OK`**

```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-refresh-token"
  }
}
```

**Errors:**

- `401` - Invalid refresh token

---

## Resource Endpoints

### GET /emergency-contacts

Get list of emergency contacts (hotlines, crisis centers).

**Response: `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Crisis Hotline",
      "phoneNumber": "+1-800-273-8255",
      "description": "24/7 crisis support",
      "isActive": true
    }
  ]
}
```

---

### GET /resources

Browse public mental health resources.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| search | string | Search term |
| page | integer | Page number |
| limit | integer | Items per page |

**Response: `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Understanding Anxiety",
      "description": "A guide to managing anxiety",
      "type": "article",
      "category": "anxiety",
      "url": "https://...",
      "imageUrl": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

## Summary

| Endpoint                | Method | Description      |
| ----------------------- | ------ | ---------------- |
| `/auth/register`        | POST   | Create account   |
| `/auth/login`           | POST   | Get auth tokens  |
| `/auth/forgot-password` | POST   | Request reset    |
| `/auth/reset-password`  | POST   | Reset password   |
| `/auth/verify-email`    | POST   | Verify email     |
| `/auth/refresh-token`   | POST   | Refresh tokens   |
| `/emergency-contacts`   | GET    | Crisis contacts  |
| `/resources`            | GET    | Browse resources |

**Total Public Endpoints: 8**
