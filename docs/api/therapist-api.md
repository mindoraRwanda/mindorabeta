# Therapist API

Endpoints for users with `THERAPIST` role. Therapists have access to all [Patient API](patient-api.md) endpoints plus these additional ones.

**Header:** `Authorization: Bearer <access_token>`

---

## Therapist Profile & Documents

### PUT /therapists/profile
Update therapist profile.

**Request Body:**
```json
{
  "specialization": "Cognitive Behavioral Therapy",
  "licenseNumber": "LIC-12345",
  "bio": "Experienced therapist...",
  "yearsOfExperience": 5,
  "education": "PhD Psychology",
  "languages": ["English", "French"]
}
```

### POST /therapists/documents
Upload verification documents.

**Request:** `multipart/form-data`
- `document`: File (PDF, JPG, PNG)
- `type`: "license" | "certificate" | "id_proof"

### GET /therapists/documents
Get my uploaded documents.

### DELETE /therapists/documents/:documentId
Delete a document.

### GET /therapists/profile/status
Get approval status.

**Response:**
```json
{
  "status": "PENDING" | "APPROVED" | "REJECTED",
  "message": "Awaiting document verification"
}
```

---

## Availability Management

### GET /therapists/availability
Get my availability schedule.

### POST /therapists/availability
Set availability slots.

**Request Body:**
```json
{
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "isRecurring": true
}
```

### PUT /therapists/availability/:scheduleId
Update availability slot.

### DELETE /therapists/availability/:scheduleId
Delete availability slot.

---

## Appointment Management

### PUT /appointments/:appointmentId/confirm
Confirm a pending appointment.

### PUT /appointments/:appointmentId/complete
Mark appointment as completed.

### GET /appointments/therapist/all
Get all appointments for my patients.

**Query Parameters:**
| Param | Description |
|-------|-------------|
| status | Filter by status |
| patientId | Filter by patient |
| startDate | Start date |
| endDate | End date |

---

## Session Notes

### POST /session-notes
Create session notes.

**Request Body:**
```json
{
  "appointmentId": "appointment-uuid",
  "content": "Session summary...",
  "treatmentPlan": "Next steps...",
  "isPrivate": true
}
```

### GET /session-notes/:appointmentId
Get notes for an appointment.

### GET /session-notes/patient/:patientId
Get all notes for a patient.

### PUT /session-notes/:noteId
Update session note.

### DELETE /session-notes/:noteId
Delete session note.

---

## Patient Management

### GET /therapists/patients
Get my assigned patients.

**Response:**
```json
{
  "data": [
    {
      "id": "patient-uuid",
      "fullName": "John Doe",
      "email": "patient@example.com",
      "lastAppointment": "2024-01-10",
      "nextAppointment": "2024-01-20",
      "riskLevel": "LOW"
    }
  ]
}
```

### GET /therapists/patients/:patientId
Get patient details.

### GET /therapists/patients/:patientId/monitoring
Get patient monitoring data.

**Response:**
```json
{
  "moodTrend": "IMPROVING",
  "averageMood": 6.5,
  "exerciseCompletion": 75,
  "appointmentAttendance": 100,
  "alerts": []
}
```

### GET /therapists/patients/:patientId/mood-history
Get patient's mood history.

### GET /therapists/patients/:patientId/exercise-progress
Get patient's exercise progress.

### GET /therapists/patients/:patientId/appointments
Get patient's appointment history.

### GET /therapists/patients/:patientId/session-notes
Get patient's session notes.

### POST /therapists/patients/:patientId/monitoring
Add monitoring note.

**Request Body:**
```json
{
  "note": "Patient showing improvement",
  "riskLevel": "LOW",
  "flags": []
}
```

---

## Exercise Management

### POST /exercises
Create an exercise (pending admin approval).

**Request Body:**
```json
{
  "title": "Breathing Exercise",
  "content": "Instructions...",
  "category": "relaxation",
  "difficulty": "beginner",
  "duration": 10
}
```

### PUT /exercises/:exerciseId
Update my exercise.

### POST /exercises/:exerciseId/media
Upload exercise media.

**Request:** `multipart/form-data`
- `media`: Image or video file

---

## Resource Management

### POST /resources
Create a resource.

**Request Body:**
```json
{
  "title": "Understanding Anxiety",
  "description": "A comprehensive guide...",
  "type": "article",
  "category": "anxiety",
  "url": "https://..."
}
```

### PUT /resources/:resourceId
Update my resource.

---

## Therapist Analytics

### GET /analytics/therapist-dashboard
Get therapist dashboard analytics.

**Response:**
```json
{
  "totalPatients": 25,
  "activePatients": 20,
  "appointmentsThisMonth": 45,
  "completionRate": 92,
  "averageRating": 4.8,
  "upcomingAppointments": 5
}
```

### GET /therapists/statistics
Get my statistics.

### GET /therapists/reviews
Get reviews received.

---

## Summary

**Additional Therapist Endpoints: 32**

| Category | Count |
|----------|-------|
| Profile & Documents | 5 |
| Availability | 4 |
| Appointments | 3 |
| Session Notes | 5 |
| Patient Management | 8 |
| Exercises | 3 |
| Resources | 2 |
| Analytics | 3 |

**Total Access: 100 endpoints** (68 patient + 32 therapist)
