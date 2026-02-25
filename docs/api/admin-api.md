# Admin API

Endpoints for users with `ADMIN` role. Admins have access to all [Patient](patient-api.md) and [Therapist](therapist-api.md) endpoints plus these.

**Header:** `Authorization: Bearer <access_token>`

---

## User Management

### GET /admin/users

Get all users with filtering.

**Query Parameters:**
| Param | Description |
|-------|-------------|
| role | Filter by role |
| status | active, inactive |
| search | Search by name/email |
| page | Page number |
| limit | Items per page |

### GET /admin/users/:userId

Get user details.

### PUT /admin/users/:userId/activate

Activate user account.

### PUT /admin/users/:userId/deactivate

Deactivate user account.

### DELETE /admin/users/:userId

Delete user account.

### PUT /admin/users/:userId/role

Change user role.

**Request Body:**

```json
{
  "role": "THERAPIST"
}
```

---

## Therapist Approval

### GET /admin/therapists/pending

Get therapists awaiting approval.

### GET /admin/therapists/:therapistId/documents

View therapist verification documents.

### PUT /admin/therapists/:therapistId/approve

Approve therapist.

### PUT /admin/therapists/:therapistId/reject

Reject therapist application.

**Request Body:**

```json
{
  "reason": "Incomplete documentation"
}
```

### PUT /admin/therapists/:therapistId/suspend

Suspend therapist.

### PUT /admin/therapists/:therapistId/reactivate

Reactivate suspended therapist.

### POST /admin/therapists/:therapistId/assign-patient

Assign patient to therapist.

**Request Body:**

```json
{
  "patientId": "patient-uuid"
}
```

### DELETE /admin/therapists/:therapistId/unassign-patient/:patientId

Unassign patient from therapist.

### GET /admin/therapists/all

Get all therapists.

---

## Content Moderation

### GET /admin/flagged-content

Get flagged content for review.

### GET /admin/posts/pending

Get posts pending moderation.

### PUT /admin/posts/:postId/approve

Approve a post.

### DELETE /admin/posts/:postId

Delete a post.

### PUT /admin/comments/:commentId/approve

Approve a comment.

### DELETE /admin/comments/:commentId

Delete a comment.

### GET /admin/exercises/pending

Get exercises pending approval.

### PUT /admin/exercises/:exerciseId/approve

Approve an exercise.

### PUT /admin/exercises/:exerciseId/reject

Reject an exercise.

### DELETE /admin/exercises/:exerciseId

Delete an exercise.

---

## System Monitoring

### GET /admin/dashboard

Get admin dashboard.

**Response:**

```json
{
  "users": {
    "total": 1000,
    "patients": 850,
    "therapists": 100,
    "admins": 5,
    "newThisMonth": 50
  },
  "appointments": {
    "total": 5000,
    "completedThisMonth": 450,
    "pendingApproval": 10
  },
  "content": {
    "posts": 2500,
    "flagged": 15,
    "exercisesApproved": 100
  }
}
```

### GET /admin/statistics/overview

System overview statistics.

### GET /admin/statistics/users

User statistics breakdown.

### GET /admin/statistics/appointments

Appointment statistics.

### GET /admin/statistics/community

Community engagement stats.

### GET /admin/statistics/exercises

Exercise usage statistics.

### GET /admin/activity-logs

Get user activity logs.

**Query Parameters:**
| Param | Description |
|-------|-------------|
| userId | Filter by user |
| action | Filter by action type |
| startDate | Start date |
| endDate | End date |

### GET /admin/audit-logs

Get system audit logs.

### GET /admin/system-health

Check system health.

**Response:**

```json
{
  "status": "healthy",
  "database": "connected",
  "cache": "connected",
  "uptime": "5d 12h 30m"
}
```

### GET /admin/analytics/trends

Get trend analysis.

---

## Patient Monitoring (System-wide)

### GET /admin/monitoring/patients

Get all patients monitoring data.

### GET /admin/monitoring/patients/:patientId

Get detailed patient monitoring.

### GET /admin/monitoring/alerts

Get patients needing attention.

**Response:**

```json
{
  "data": [
    {
      "patientId": "uuid",
      "name": "John Doe",
      "alertType": "LOW_MOOD",
      "severity": "HIGH",
      "lastMoodScore": 2,
      "daysSinceActivity": 7
    }
  ]
}
```

### GET /admin/monitoring/statistics

Get monitoring statistics.

### POST /admin/monitoring/generate-report

Generate monitoring report.

**Request Body:**

```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "format": "pdf"
}
```

---

## Reports & Export

### GET /admin/reports/users

Generate user reports.

### GET /admin/reports/appointments

Generate appointment reports.

### GET /admin/reports/therapists

Generate therapist reports.

### GET /admin/reports/engagement

Generate engagement reports.

### GET /admin/reports/mood-trends

Generate mood trend reports.

### GET /admin/reports/export

Export data.

**Query Parameters:**
| Param | Values |
|-------|--------|
| type | users, appointments, mood |
| format | csv, json, pdf |
| startDate | Start date |
| endDate | End date |

---

## Resource Management

### POST /resources

Create resource.

### PUT /resources/:resourceId

Update resource.

### DELETE /resources/:resourceId

Delete resource.

---

## Emergency Contacts Management

### POST /emergency-contacts

Add emergency contact.

**Request Body:**

```json
{
  "name": "Crisis Hotline",
  "phoneNumber": "+1-800-273-8255",
  "description": "24/7 support",
  "isActive": true
}
```

### PUT /emergency-contacts/:contactId

Update contact.

### DELETE /emergency-contacts/:contactId

Delete contact.

---

## System Settings

### GET /admin/settings

Get system settings.

### PUT /admin/settings

Update system settings.

**Request Body:**

```json
{
  "maintenanceMode": false,
  "registrationEnabled": true,
  "maxFileUploadSize": 10485760
}
```

---

## Summary

**Additional Admin Endpoints: 54**

| Category           | Count |
| ------------------ | ----- |
| User Management    | 6     |
| Therapist Approval | 9     |
| Content Moderation | 10    |
| System Monitoring  | 10    |
| Patient Monitoring | 5     |
| Reports            | 6     |
| Resources          | 3     |
| Emergency Contacts | 3     |
| Settings           | 2     |

**Total Access: 154 endpoints** (68 + 32 + 54)
