# Patient API

Endpoints available to users with `PATIENT` role. All require authentication.

**Header:** `Authorization: Bearer <access_token>`

---

## Profile Management

### GET /users/profile

Get current user's profile.

**Response: `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "PATIENT",
    "profile": {
      "fullName": "John Doe",
      "avatarUrl": "https://...",
      "phoneNumber": "+1234567890",
      "dateOfBirth": "1990-01-15",
      "gender": "male",
      "bio": "About me..."
    }
  }
}
```

### PATCH /users/profile

Update profile information.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "gender": "male",
  "bio": "Updated bio..."
}
```

### POST /users/profile/avatar

Upload profile avatar.

**Request:** `multipart/form-data`

- `avatar`: Image file (JPG, PNG)

### DELETE /users/profile/avatar

Remove profile avatar.

---

## Therapist Discovery

### GET /therapists

Browse approved therapists.

**Query Parameters:**
| Param | Description |
|-------|-------------|
| specialization | Filter by specialty |
| page | Page number |
| limit | Items per page |

### GET /therapists/:therapistId

Get therapist details.

### GET /therapists/:therapistId/availability

Get therapist's available time slots.

### GET /therapists/:therapistId/reviews

Get therapist reviews.

---

## Appointments

### POST /appointments

Book an appointment.

**Request Body:**

```json
{
  "therapistId": "therapist-uuid",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "notes": "First session"
}
```

### GET /appointments

Get all my appointments.

### GET /appointments/:appointmentId

Get appointment details.

### GET /appointments/upcoming

Get upcoming appointments.

### PUT /appointments/:appointmentId/cancel

Cancel an appointment.

**Request Body:**

```json
{
  "reason": "Schedule conflict"
}
```

### PUT /appointments/:appointmentId/reschedule

Reschedule appointment.

---

## Mood Tracking

### POST /mood

Log a mood entry.

**Request Body:**

```json
{
  "moodScore": 7,
  "emotions": ["happy", "calm"],
  "anxietyLevel": "MILD",
  "notes": "Feeling good today"
}
```

### GET /mood

Get mood logs with optional date filter.

**Query Parameters:**
| Param | Description |
|-------|-------------|
| startDate | Start date (ISO) |
| endDate | End date (ISO) |

### GET /mood/:logId

Get specific mood log.

### PUT /mood/:logId

Update mood log.

### DELETE /mood/:logId

Delete mood log.

### GET /mood/analytics

Get mood trends and analytics.

**Query Parameters:**
| Param | Values |
|-------|--------|
| period | week, month, year |

---

## Exercises

### GET /exercises

Browse available exercises.

**Query Parameters:**
| Param | Description |
|-------|-------------|
| category | Filter by category |
| difficulty | Filter by difficulty |

### GET /exercises/:exerciseId

Get exercise details.

### GET /exercises/user-exercises

Get my exercise progress.

### POST /exercises/user-exercises/:exerciseId/start

Start an exercise.

### PUT /exercises/user-exercises/:userExerciseId/progress

Update exercise progress.

**Request Body:**

```json
{
  "progress": 50
}
```

### PUT /exercises/user-exercises/:userExerciseId/complete

Mark exercise as complete.

---

## Community

### GET /community/posts

Browse community posts.

### GET /community/posts/:postId

Get post details.

### POST /community/posts

Create a post.

**Request Body:**

```json
{
  "content": "My post content",
  "isAnonymous": false
}
```

### POST /community/posts/:postId/images

Upload post images.

### PUT /community/posts/:postId

Update my post.

### DELETE /community/posts/:postId

Delete my post.

### POST /community/posts/:postId/like

Like a post.

### DELETE /community/posts/:postId/like

Unlike a post.

### POST /community/posts/:postId/flag

Flag inappropriate content.

**Request Body:**

```json
{
  "reason": "Inappropriate content"
}
```

### GET /community/posts/:postId/comments

Get post comments.

### POST /community/posts/:postId/comments

Add a comment.

### PUT /community/comments/:commentId

Update my comment.

### DELETE /community/comments/:commentId

Delete my comment.

### POST /community/comments/:commentId/like

Like a comment.

### DELETE /community/comments/:commentId/like

Unlike a comment.

---

## Messaging

### GET /messages/conversations

Get all conversations.

### POST /messages

Send a message.

**Request Body:**

```json
{
  "recipientId": "user-uuid",
  "content": "Hello!"
}
```

### PATCH /messages/:messageId/read

Mark as read.

### DELETE /messages/:messageId

Delete message.

---

## Notifications

### GET /notifications

Get all notifications.

### GET /notifications/unread-count

Get unread count.

### PATCH /notifications/:notificationId/read

Mark as read.

### PUT /notifications/read-all

Mark all as read.

### DELETE /notifications/:notificationId

Delete notification.

---

## User Stats & Gamification

### GET /users/streaks

Get activity streaks.

### GET /users/achievements

Get earned achievements.

### GET /users/statistics

Get user statistics.

### GET /users/dashboard

Get dashboard data.

---

## Reviews

### POST /reviews/therapists/:therapistId/reviews

Review a therapist.

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Great therapist!"
}
```

### PUT /reviews/:reviewId

Update my review.

### DELETE /reviews/:reviewId

Delete my review.

---

## Monitoring

### GET /monitoring/me

Get my monitoring data (visible to my therapist).

---

## Summary

**Total Patient Endpoints: 68**

| Category            | Count |
| ------------------- | ----- |
| Profile             | 4     |
| Therapist Discovery | 4     |
| Appointments        | 6     |
| Mood                | 6     |
| Exercises           | 6     |
| Community           | 16    |
| Messaging           | 4     |
| Notifications       | 5     |
| Stats               | 4     |
| Reviews             | 3     |
| Monitoring          | 1     |
| Resources           | 2     |
| Search              | 1     |
