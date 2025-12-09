# Mindora API Documentation

Base URL: `/api/v1`

---

## Public Endpoints (No Authentication Required)

### Exercises

#### GET /exercises
Get all exercises.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| difficulty | string | Filter by difficulty |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "category": "string",
      "difficulty": "string"
    }
  ]
}
```

---

#### GET /exercises/{id}
Get exercise details.

**Path Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| id | string | Yes |

**Response:** `200 OK`

---

### Resources

#### GET /resources
Get all resources.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| search | string | Search term |

**Response:** `200 OK`

---

#### GET /resources/{id}
Get resource details.

**Path Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| id | string | Yes |

**Response:** `200 OK`

---

### Community (Public)

#### GET /community/posts
Get community posts.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number |
| limit | integer | Items per page |

**Response:** `200 OK`

---

#### GET /community/posts/{id}
Get a specific post.

**Path Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| id | string | Yes |

**Response:** `200 OK`

---

#### GET /community/posts/{id}/comments
Get comments for a post.

**Response:** `200 OK`

---

#### GET /community/posts/user/{userId}
Get posts by a specific user.

**Response:** `200 OK`

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "John Doe",
  "role": "PATIENT"  // Optional: "PATIENT" or "THERAPIST"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "role": "PATIENT",
      "profile": {}
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

---

### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "role": "string"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

---

### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

---

### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token-string",
  "password": "NewPassword123!"
}
```

**Response:** `200 OK`

---

### POST /auth/verify-email
Verify email address.

**Request Body:**
```json
{
  "token": "verification-token"
}
```

**Response:** `200 OK`

---

### POST /auth/refresh-token
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token-string"
}
```

**Response:** `200 OK`

---

### POST /auth/logout
Logout user. **Requires Authentication**

**Request Body:**
```json
{
  "refreshToken": "refresh-token-string"
}
```

**Response:** `200 OK`

---

### POST /auth/change-password
Change password. **Requires Authentication**

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response:** `200 OK`

---

## User Endpoints (All Authenticated Users)

### GET /users/profile
Get current user profile.

**Response:** `200 OK`

---

### PATCH /users/profile
Update user profile.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "bio": "About me..."
}
```

**Response:** `200 OK`

---

### POST /users/profile/avatar
Upload user avatar.

**Request Body:** `multipart/form-data`
| Field | Type |
|-------|------|
| avatar | file (binary) |

**Response:** `200 OK`

---

### DELETE /users/profile/avatar
Delete user account.

**Response:** `200 OK`

---

### GET /users/statistics
Get user statistics.

**Response:** `200 OK`

---

### GET /users/dashboard
Get user dashboard data.

**Response:** `200 OK`

---

### GET /users/achievements
Get user achievements.

**Response:** `200 OK`

---

### GET /users/streaks
Get user streaks.

**Response:** `200 OK`

---

### GET /users/{userId}
Get user by ID.

**Path Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| userId | string | Yes |

**Response:** `200 OK`

---

### Emergency Contacts

#### POST /emergency
Add emergency contact.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phoneNumber": "+1234567890",
  "relationship": "Mother"
}
```

**Response:** `201 Created`

---

#### GET /emergency
Get all emergency contacts.

**Response:** `200 OK`

---

#### DELETE /emergency/{id}
Delete emergency contact.

**Response:** `200 OK`

---

### Notifications

#### GET /notifications
Get all notifications.

**Response:** `200 OK`

---

#### PATCH /notifications/{id}/read
Mark notification as read.

**Response:** `200 OK`

---

#### DELETE /notifications/{id}
Delete a notification.

**Response:** `200 OK`

---

### Messages

#### POST /messages
Send a message.

**Request Body:**
```json
{
  "recipientId": "user-id",
  "content": "Hello!"
}
```

**Response:** `201 Created`

---

#### GET /messages/conversations
Get all conversations.

**Response:** `200 OK`

---

#### PATCH /messages/{id}/read
Mark message as read.

**Response:** `200 OK`

---

## Patient Endpoints

### Appointments

#### POST /appointments
Create a new appointment. **Patient Only**

**Request Body:**
```json
{
  "therapistId": "therapist-id",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "notes": "First session"
}
```

**Response:** `201 Created`

---

#### GET /appointments
Get all appointments.

**Response:** `200 OK`

---

#### GET /appointments/{id}
Get appointment by ID.

**Response:** `200 OK`

---

#### PATCH /appointments/{id}/cancel
Cancel an appointment. **Patient Only**

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

**Response:** `200 OK`

---

### Mood Logging

#### POST /mood
Log a mood entry.

**Request Body:**
```json
{
  "moodScore": 7,
  "emotions": ["happy", "calm"],
  "notes": "Feeling good today"
}
```

**Response:** `201 Created`

---

#### GET /mood
Get mood logs.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | date | Start date |
| endDate | date | End date |

**Response:** `200 OK`

---

#### GET /mood/analytics
Get mood analytics/trends.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | week, month, year |

**Response:** `200 OK`

---

#### GET /mood/{logId}
Get a specific mood log.

**Response:** `200 OK`

---

#### PUT /mood/{logId}
Update a mood log.

**Request Body:**
```json
{
  "moodScore": 8,
  "notes": "Updated notes"
}
```

**Response:** `200 OK`

---

#### DELETE /mood/{logId}
Delete a mood log.

**Response:** `200 OK`

---

### Exercise Progress

#### GET /exercises/user-exercises
Get user exercise progress.

**Response:** `200 OK`

---

#### POST /exercises/user-exercises/{id}/start
Start an exercise.

**Response:** `200 OK`

---

#### PUT /exercises/user-exercises/{id}/progress
Update exercise progress.

**Request Body:**
```json
{
  "progress": 50
}
```

**Response:** `200 OK`

---

#### PUT /exercises/user-exercises/{id}/complete
Complete an exercise.

**Response:** `200 OK`

---

### Monitoring

#### GET /monitoring/me
Get my monitoring data. **Patient Only**

**Response:** `200 OK`

---

### Reviews

#### POST /reviews/therapists/{therapistId}/reviews
Create a review for a therapist. **Patient Only**

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great therapist!"
}
```

**Response:** `201 Created`

---

#### GET /reviews/therapists/{therapistId}/reviews
Get reviews for a therapist.

**Response:** `200 OK`

---

### Community (Authenticated)

#### POST /community/posts
Create a new post.

**Request Body:**
```json
{
  "content": "My post content",
  "isAnonymous": false
}
```

**Response:** `201 Created`

---

#### POST /community/posts/{id}/images
Upload images for a post.

**Request Body:** `multipart/form-data`
| Field | Type |
|-------|------|
| images | file[] (binary) |

**Response:** `200 OK`

---

#### PUT /community/posts/{id}
Update a post.

**Request Body:**
```json
{
  "content": "Updated content"
}
```

**Response:** `200 OK`

---

#### DELETE /community/posts/{id}
Delete a post.

**Response:** `200 OK`

---

#### POST /community/posts/{id}/like
Like a post.

**Response:** `200 OK`

---

#### DELETE /community/posts/{id}/like
Unlike a post.

**Response:** `200 OK`

---

#### POST /community/posts/{id}/flag
Flag a post for moderation.

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

**Response:** `200 OK`

---

#### POST /community/posts/{postId}/comments
Add a comment to a post.

**Request Body:**
```json
{
  "content": "My comment"
}
```

**Response:** `201 Created`

---

#### PUT /community/comments/{commentId}
Update a comment.

**Response:** `200 OK`

---

#### DELETE /community/comments/{commentId}
Delete a comment.

**Response:** `200 OK`

---

#### POST /community/comments/{commentId}/like
Like a comment.

**Response:** `200 OK`

---

#### DELETE /community/comments/{commentId}/like
Unlike a comment.

**Response:** `200 OK`

---

## Therapist Endpoints

### POST /therapists
Create therapist profile. **Therapist Only**

**Request Body:**
```json
{
  "specialization": "Cognitive Behavioral Therapy",
  "licenseNumber": "LIC-12345",
  "bio": "Experienced therapist..."
}
```

**Response:** `201 Created`

---

### GET /therapists/{id}
Get therapist details.

**Response:** `200 OK`

---

### PATCH /therapists/{id}
Update therapist profile. **Therapist Only**

**Request Body:**
```json
{
  "specialization": "Updated specialization",
  "bio": "Updated bio"
}
```

**Response:** `200 OK`

---

### POST /therapists/availability
Set therapist availability. **Therapist Only**

**Request Body:**
```json
{
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

**Response:** `200 OK`

---

### POST /therapists/documents
Upload professional document. **Therapist Only**

**Request Body:** `multipart/form-data`
| Field | Type |
|-------|------|
| document | file (binary) |

**Response:** `200 OK`

---

### GET /therapists/patients
Get my patients. **Therapist Only**

**Response:** `200 OK`

---

### GET /therapists/analytics
Get therapist analytics. **Therapist Only**

**Response:** `200 OK`

---

### Appointment Management (Therapist)

#### PATCH /appointments/{id}/confirm
Confirm an appointment. **Therapist Only**

**Response:** `200 OK`

---

#### PATCH /appointments/{id}/complete
Mark appointment as complete. **Therapist Only**

**Response:** `200 OK`

---

#### POST /appointments/{id}/notes
Add session notes. **Therapist Only**

**Request Body:**
```json
{
  "notes": "Session notes..."
}
```

**Response:** `200 OK`

---

### Patient Monitoring (Therapist)

#### POST /monitoring/patients/{patientId}
Create monitoring entry for patient. **Therapist Only**

**Request Body:**
```json
{
  "riskLevel": "LOW",
  "notes": "Patient is progressing well"
}
```

**Response:** `201 Created`

---

#### GET /monitoring/patients/{patientId}/report
Get patient monitoring report. **Therapist Only**

**Response:** `200 OK`

---

### Exercise Management (Therapist/Admin)

#### POST /exercises
Create a new exercise. **Therapist/Admin Only**

**Request Body:**
```json
{
  "title": "Breathing Exercise",
  "content": "Instructions..."
}
```

**Response:** `201 Created`

---

#### PUT /exercises/{id}
Update an exercise. **Therapist/Admin Only**

**Request Body:**
```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

**Response:** `200 OK`

---

#### POST /exercises/{id}/media
Upload media for exercise. **Therapist/Admin Only**

**Request Body:** `multipart/form-data`
| Field | Type |
|-------|------|
| file | file (binary) |

**Response:** `200 OK`

---

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard statistics. **Admin Only**

**Response:** `200 OK`

---

### GET /admin/users
Get all users. **Admin Only**

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| role | string | PATIENT, THERAPIST, ADMIN |
| page | integer | Page number |
| limit | integer | Items per page |

**Response:** `200 OK`

---

### PATCH /admin/therapists/{id}/approve
Approve a therapist application. **Admin Only**

**Response:** `200 OK`

---

### GET /admin/content
Get content statistics. **Admin Only**

**Response:** `200 OK`

---

### GET /admin/reports
Get system reports. **Admin Only**

**Response:** `200 OK`

---

### GET /admin/settings
Get system settings. **Admin Only**

**Response:** `200 OK`

---

### PATCH /appointments/{id}/status
Update appointment status. **Admin Only**

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Response:** `200 OK`

---

### GET /monitoring/high-risk
Get high risk patients. **Admin Only**

**Response:** `200 OK`

---

### PATCH /community/posts/{id}/moderate
Moderate a post. **Admin Only**

**Request Body:**
```json
{
  "action": "APPROVE"
}
```

**Response:** `200 OK`

---

### POST /exercises/admin
Admin create exercise. **Admin Only**

**Response:** `201 Created`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
