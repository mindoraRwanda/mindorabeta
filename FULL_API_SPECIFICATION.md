# Mindora API Specification

Welcome to the Mindora API documentation. This document provides a complete reference for all available endpoints, including request payloads and response structures.

## Base URL
All API requests should be made to:
```
http://localhost:5000/api/v1
```

## Authentication
Mindora uses JWT (JSON Web Token) authentication.
1.  **Obtain tokens** by calling `/auth/register` or `/auth/login`.
2.  **Include the Access Token** in the header of all protected requests:
    `Authorization: Bearer <your_access_token>`

---

## 🔐 Auth & Identity

### Register User
`POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "John Doe",
  "role": "PATIENT" 
}
```
*Note: role can be "PATIENT" (default) or "THERAPIST".*

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com",
      "role": "PATIENT",
      "profile": {
        "id": "uuid-v4",
        "fullName": "John Doe",
        "anonymousName": "Brave Lion"
      }
    },
    "tokens": {
      "accessToken": "ey...",
      "refreshToken": "ey..."
    }
  }
}
```

### Login
`POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

### Refresh Token
`POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

---

## 👤 User & Profile

### Get Current User Profile
`GET /users/profile` (Protected)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "PATIENT",
    "profile": {
      "fullName": "John Doe",
      "bio": "Example bio",
      "streakCount": 5,
      "totalPoints": 150
    }
  }
}
```

### Update Profile
`PATCH /users/profile` (Protected)

**Request Body:**
```json
{
  "fullName": "John Smith",
  "bio": "New bio content",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "phone": "+1234567890"
}
```

---

## 👨‍⚕️ Therapists

### List Therapists
`GET /therapists` (Protected)

**Query Parameters:** `page`, `limit`, `specialization`, `minRating`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fullName": "Dr. Sarah Wilson",
      "specialization": ["CBT", "Anxiety"],
      "rating": 4.8,
      "hourlyRate": 5000
    }
  ]
}
```

---

## 📅 Appointments

### Book Appointment
`POST /appointments` (Protected)

**Request Body:**
```json
{
  "therapistId": "uuid",
  "startTime": "2024-03-20T10:00:00Z",
  "endTime": "2024-03-20T11:00:00Z",
  "type": "VIDEO",
  "notes": "First session"
}
```

### Get My Appointments
`GET /appointments` (Protected)

**Query Parameters:** `status`, `page`, `limit`

---

## 🧠 Mental Health Tools

### Log Mood
`POST /mood-logs` (Protected)

**Request Body:**
```json
{
  "mood": "HAPPY",
  "anxietyLevel": "MILD",
  "note": "Feeling great today after exercise!"
}
```
*Mood options: VERY_SAD, SAD, NEUTRAL, HAPPY, VERY_HAPPY*

### Get Mood Trends
`GET /mood-logs/analytics` (Protected)

---

## 🤝 Community

### Create Post
`POST /posts` (Protected)

**Request Body:**
```json
{
  "content": "Does anyone have tips for morning anxiety?",
  "visibility": "ANONYMOUS"
}
```
*Visibility: PUBLIC, ANONYMOUS, PRIVATE*

### Add Comment
`POST /posts/:postId/comments` (Protected)

**Request Body:**
```json
{
  "content": "I find deep breathing helps a lot!"
}
```

---

## 💬 Real-time Messaging

### Send Message
`POST /messages` (Protected)

**Request Body:**
```json
{
  "recipientId": "uuid",
  "content": "Hello, I have a question about our next session."
}
```

---

## 🆘 Emergency & Resources

### Get Emergency Contacts
`GET /emergency-contacts` (Public)

### List Resources
`GET /resources` (Public/Protected)

---

## 🏃 Exercises

### Browse Exercises
`GET /exercises` (Protected)

**Query Parameters:** `category`, `difficulty`, `isPremium`, `page`, `limit`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "5-Minute Breathing",
      "category": "mindfulness",
      "durationMinutes": 5,
      "difficulty": 1
    }
  ]
}
```

### Complete Exercise
`PUT /user-exercises/:userExerciseId/complete` (Protected)

**Request Body:**
```json
{
  "rating": 5,
  "notes": "Felt very relaxed after this."
}
```

---

## ⭐️ Reviews

### Create Therapist Review
`POST /reviews/:therapistId` (Protected)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Very helpful therapist, highly recommend."
}
```

---

## 📊 Monitoring (Therapist Only)

### Create Monitoring Entry
`POST /monitoring/patients/:patientId` (Therapist Protected)

**Request Body:**
```json
{
  "riskLevel": 1,
  "notes": "Patient is making steady progress."
}
```
*Risk levels: 0 (None), 1 (Mild), 2 (Moderate), 3 (Critical)*

---

## 🔔 Notifications

### Get All Notifications
`GET /notifications` (Protected)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Appointment Reminder",
      "body": "You have a session today at 2 PM",
      "isRead": false,
      "createdAt": "2024-03-08T10:00:00Z"
    }
  ]
}
```

### Mark as Read
`PATCH /notifications/:id/read` (Protected)

---

## 🔐 Authentication Utils

### Forgot Password
`POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
`POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePassword123!"
}
```

### Verify Email
`POST /auth/verify-email`

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

---

## 🛠 Admin Operations

### Get Admin Dashboard
`GET /admin/dashboard` (Admin Protected)

### Manage User Status
`PATCH /admin/users/:id/status` (Admin Protected)

**Request Body:**
```json
{
  "isActive": false,
  "reason": "Violation of community guidelines"
}
```
