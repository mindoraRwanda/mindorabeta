# Mindora API Endpoints - Organized by User Role

## Base URL

```
http://localhost:5000/api/v1
```

---

## 🔓 PUBLIC ENDPOINTS (No Authentication)

### Authentication

```
POST   /auth/register          - Register new user
POST   /auth/login             - User login
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password with token
POST   /auth/verify-email      - Verify email address
```

### Public Resources

```
GET    /emergency-contacts     - Get emergency contact list
GET    /resources              - Get public resources (filtered)
```

**Total Public Endpoints: 7**

---

## 👤 PATIENT ROLE ENDPOINTS

### Authentication & Profile (8 endpoints)

```
POST   /auth/logout
POST   /auth/refresh-token
POST   /auth/change-password
GET    /users/profile
PUT    /users/profile
POST   /users/profile/avatar
DELETE /users/profile/avatar
GET    /users/:userId
```

### Therapist Discovery (4 endpoints)

```
GET    /therapists                          - Browse approved therapists
GET    /therapists/:therapistId             - Get therapist details
GET    /therapists/:therapistId/availability - Check availability
GET    /therapists/:therapistId/reviews     - Read reviews
```

### Appointments (6 endpoints)

```
GET    /appointments                        - Get my appointments
GET    /appointments/:appointmentId         - Get appointment details
POST   /appointments                        - Book appointment
PUT    /appointments/:appointmentId/cancel  - Cancel appointment
PUT    /appointments/:appointmentId/reschedule - Reschedule
GET    /appointments/upcoming               - Get upcoming appointments
```

### Reviews (4 endpoints)

```
POST   /reviews                - Create therapist review
GET    /reviews/:reviewId      - Get review details
PUT    /reviews/:reviewId      - Update my review
DELETE /reviews/:reviewId      - Delete my review
```

### Exercises (7 endpoints)

```
GET    /exercises                              - Browse exercises
GET    /exercises/:exerciseId                  - Get exercise details
POST   /exercises                              - Create exercise (pending approval)
GET    /user-exercises                         - My exercise progress
POST   /user-exercises/:exerciseId/start       - Start exercise
PUT    /user-exercises/:userExerciseId/progress - Update progress
PUT    /user-exercises/:userExerciseId/complete - Mark complete
```

### Community (16 endpoints)

```
GET    /posts                          - Browse posts
GET    /posts/:postId                  - Get post details
POST   /posts                          - Create post (can be anonymous)
POST   /posts/:postId/images           - Upload post images
PUT    /posts/:postId                  - Update my post
DELETE /posts/:postId                  - Delete my post
POST   /posts/:postId/like             - Like post
DELETE /posts/:postId/like             - Unlike post
POST   /posts/:postId/flag             - Flag inappropriate post
GET    /posts/user/:userId             - Get user's posts
GET    /posts/:postId/comments         - Get comments
POST   /posts/:postId/comments         - Add comment
PUT    /comments/:commentId            - Update my comment
DELETE /comments/:commentId            - Delete my comment
POST   /comments/:commentId/like       - Like comment
DELETE /comments/:commentId/like       - Unlike comment
```

### Mood Tracking (5 endpoints)

```
GET    /mood-logs                - Get my mood logs
GET    /mood-logs/:logId         - Get specific log
POST   /mood-logs                - Create mood log
PUT    /mood-logs/:logId         - Update mood log
DELETE /mood-logs/:logId         - Delete mood log
GET    /mood-logs/analytics      - Get mood analytics
```

### Messaging (6 endpoints)

```
GET    /messages                          - Get my messages
GET    /messages/conversations            - Get conversations
POST   /messages                          - Send message
POST   /messages/:messageId/attachment    - Upload attachment
PUT    /messages/:messageId/read          - Mark as read
DELETE /messages/:messageId               - Delete message
```

### Notifications (5 endpoints)

```
GET    /notifications                      - Get notifications
GET    /notifications/unread-count         - Get unread count
PUT    /notifications/:notificationId/read - Mark as read
PUT    /notifications/read-all             - Mark all as read
DELETE /notifications/:notificationId      - Delete notification
```

### Resources (2 endpoints)

```
GET    /resources                - Browse resources
GET    /resources/:resourceId    - Get resource details
```

### User Stats & Gamification (4 endpoints)

```
GET    /users/streaks           - Get my streaks
GET    /users/achievements      - Get my achievements
GET    /users/statistics        - Get my statistics
GET    /analytics/dashboard     - Get dashboard analytics
```

### Search (1 endpoint)

```
GET    /search                  - Global search
```

**Total Patient Endpoints: 68**

---

## 👨‍⚕️ THERAPIST ROLE ENDPOINTS

### All Patient Endpoints (68) PLUS:

### Therapist Profile & Documents (5 endpoints)

```
PUT    /therapists/profile                  - Update therapist profile
POST   /therapists/documents                - Upload verification documents
GET    /therapists/documents                - Get my documents
DELETE /therapists/documents/:documentId    - Delete document
GET    /therapists/profile/status           - Get approval status
```

### Availability Management (4 endpoints)

```
GET    /therapists/availability             - Get my availability
POST   /therapists/availability             - Set availability
PUT    /therapists/availability/:scheduleId - Update schedule
DELETE /therapists/availability/:scheduleId - Delete schedule
```

### Appointment Management (3 endpoints)

```
PUT    /appointments/:appointmentId/confirm  - Confirm appointment
PUT    /appointments/:appointmentId/complete - Mark as completed
GET    /appointments/therapist/all           - Get all my appointments
```

### Session Notes (5 endpoints)

```
POST   /session-notes                       - Create session note
GET    /session-notes/:appointmentId        - Get note by appointment
GET    /session-notes/patient/:patientId    - Get patient's notes
PUT    /session-notes/:noteId               - Update note
DELETE /session-notes/:noteId               - Delete note
```

### Patient Management & Monitoring (8 endpoints)

```
GET    /therapists/patients                           - Get assigned patients
GET    /therapists/patients/:patientId                - Get patient details
GET    /therapists/patients/:patientId/monitoring     - Get monitoring data
GET    /therapists/patients/:patientId/mood-history   - Get mood history
GET    /therapists/patients/:patientId/exercise-progress - Get exercise progress
GET    /therapists/patients/:patientId/appointments   - Get patient appointments
GET    /therapists/patients/:patientId/session-notes  - Get patient notes
POST   /therapists/patients/:patientId/monitoring     - Add monitoring note
```

### Exercise Management (2 endpoints)

```
POST   /exercises                    - Create exercise
PUT    /exercises/:exerciseId        - Update exercise
POST   /exercises/:exerciseId/media  - Upload media
```

### Resource Management (2 endpoints)

```
POST   /resources                - Create resource
PUT    /resources/:resourceId    - Update resource
```

### Therapist Analytics (3 endpoints)

```
GET    /analytics/therapist-dashboard  - Get therapist dashboard
GET    /therapists/statistics          - Get my statistics
GET    /therapists/reviews             - Get my reviews
```

**Total Therapist Endpoints: 100 (68 + 32)**

---

## 👑 ADMIN ROLE ENDPOINTS

### All Therapist & Patient Endpoints (100) PLUS:

### User Management (6 endpoints)

```
GET    /admin/users                      - Get all users
GET    /admin/users/:userId              - Get user details
PUT    /admin/users/:userId/activate     - Activate user
PUT    /admin/users/:userId/deactivate   - Deactivate user
DELETE /admin/users/:userId              - Delete user
PUT    /admin/users/:userId/role         - Change user role
```

### Therapist Approval & Management (9 endpoints)

```
GET    /admin/therapists/pending                        - Get pending approvals
GET    /admin/therapists/:therapistId/documents         - View documents
PUT    /admin/therapists/:therapistId/approve           - Approve therapist
PUT    /admin/therapists/:therapistId/reject            - Reject application
PUT    /admin/therapists/:therapistId/suspend           - Suspend therapist
PUT    /admin/therapists/:therapistId/reactivate        - Reactivate therapist
POST   /admin/therapists/:therapistId/assign-patient    - Assign patient
DELETE /admin/therapists/:therapistId/unassign-patient/:patientId - Unassign
GET    /admin/therapists/all                            - Get all therapists
```

### Content Moderation (10 endpoints)

```
GET    /admin/flagged-content              - Get flagged content
GET    /admin/posts/pending                - Get pending posts
PUT    /admin/posts/:postId/approve        - Approve post
DELETE /admin/posts/:postId                - Delete post
PUT    /admin/comments/:commentId/approve  - Approve comment
DELETE /admin/comments/:commentId          - Delete comment
GET    /admin/exercises/pending            - Get pending exercises
PUT    /admin/exercises/:exerciseId/approve - Approve exercise
PUT    /admin/exercises/:exerciseId/reject  - Reject exercise
DELETE /admin/exercises/:exerciseId        - Delete exercise
```

### System Monitoring & Analytics (10 endpoints)

```
GET    /admin/dashboard                    - Admin dashboard
GET    /admin/statistics/overview          - System overview
GET    /admin/statistics/users             - User statistics
GET    /admin/statistics/appointments      - Appointment statistics
GET    /admin/statistics/community         - Community statistics
GET    /admin/statistics/exercises         - Exercise statistics
GET    /admin/activity-logs                - Activity logs
GET    /admin/audit-logs                   - Audit logs
GET    /admin/system-health                - System health check
GET    /admin/analytics/trends             - Trend analysis
```

### Patient Monitoring (System-wide) (5 endpoints)

```
GET    /admin/monitoring/patients          - All patients monitoring
GET    /admin/monitoring/patients/:patientId - Patient monitoring details
GET    /admin/monitoring/alerts            - Patients needing attention
GET    /admin/monitoring/statistics        - Monitoring statistics
POST   /admin/monitoring/generate-report   - Generate monitoring report
```

### Reports & Export (6 endpoints)

```
GET    /admin/reports/users                - User reports
GET    /admin/reports/appointments         - Appointment reports
GET    /admin/reports/therapists           - Therapist reports
GET    /admin/reports/engagement           - Engagement reports
GET    /admin/reports/mood-trends          - Mood trend reports
GET    /admin/reports/export               - Export data
```

### Resource Management (3 endpoints)

```
POST   /resources                  - Create resource
PUT    /resources/:resourceId      - Update resource
DELETE /resources/:resourceId      - Delete resource
```

### Emergency Contacts Management (3 endpoints)

```
POST   /emergency-contacts                - Create contact
PUT    /emergency-contacts/:contactId     - Update contact
DELETE /emergency-contacts/:contactId     - Delete contact
```

### System Settings (2 endpoints)

```
GET    /admin/settings             - Get system settings
PUT    /admin/settings             - Update settings
```

**Total Admin Endpoints: 154 (100 + 54)**

---

## ENDPOINT SUMMARY

| Role      | Unique Endpoints | Total Access           |
| --------- | ---------------- | ---------------------- |
| Public    | 7                | 7                      |
| Patient   | 68               | 75 (7 + 68)            |
| Therapist | 32               | 107 (7 + 68 + 32)      |
| Admin     | 54               | 161 (7 + 68 + 32 + 54) |

**Total Unique Endpoints: 161**

---
