# Mindora API Endpoints

## Base URL

```
http://localhost:5000/api/v1
```

For detailed API documentation including request/response examples, please see the [API Documentation](docs/api/README.md) in the `docs/` folder.

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
GET    /resources/:id          - Get resource details
```

**Total Public Endpoints: 8**

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
POST   /posts/:postId/comments         - Add comment
GET    /posts/:postId/comments         - Get comments
PUT    /comments/:commentId            - Update comment
DELETE /comments/:commentId            - Delete comment
POST   /comments/:commentId/like       - Like comment
DELETE /comments/:commentId/like       - Unlike comment
POST   /posts/:postId/report           - Report post
POST   /comments/:commentId/report     - Report comment
```

### Mood Tracking (4 endpoints)

```
POST   /mood-logs                      - Log mood entry
GET    /mood-logs                      - Get mood history
GET    /mood-logs/analytics            - Get mood analytics/trends
GET    /mood-logs/:logId               - Get specific mood log
```

### Monitoring (1 endpoint)

```
GET    /monitoring/me                  - Get my monitoring data
```

### Notifications (3 endpoints)

```
GET    /notifications                  - Get all notifications
PATCH  /notifications/:id/read         - Mark notification as read
DELETE /notifications/:id              - Delete notification
```

### Messages (3 endpoints)

```
POST   /messages                       - Send message
GET    /messages/conversations         - Get conversations
PATCH  /messages/:id/read              - Mark message as read
```

### Emergency Contacts (3 endpoints)

```
POST   /emergency-contacts             - Add emergency contact
GET    /emergency-contacts             - Get emergency contacts
DELETE /emergency-contacts/:id         - Delete emergency contact
```

---

## 👨‍⚕️ THERAPIST ROLE ENDPOINTS

Includes all authenticated endpoints plus:

### Professional Profile (3 endpoints)

```
PUT    /therapists/profile             - Update professional profile
GET    /therapists/dashboard           - Get therapist dashboard stats
POST   /therapists/documents           - Upload verification documents
```

### Patient Management (4 endpoints)

```
GET    /therapists/patients            - Get my patients
GET    /therapists/patients/:id        - Get patient details
GET    /monitoring/patients/:patientId/report - Get patient monitoring report
POST   /monitoring/patients/:patientId - Create monitoring entry/risk assessment
```

### Appointment Management (3 endpoints)

```
GET    /appointments/therapist         - Get my schedule
PUT    /appointments/:id/confirm       - Confirm appointment
PUT    /appointments/:id/complete      - Complete appointment & add notes
```

### Availability (2 endpoints)

```
GET    /therapists/availability        - Get my availability settings
PUT    /therapists/availability        - Update availability slots
```

---

## 👑 ADMIN ROLE ENDPOINTS

### Dashboard & Analytics (2 endpoints)

```
GET    /admin/dashboard                - Get system overview stats
GET    /admin/content                  - Get content moderation stats
```

### User Management (3 endpoints)

```
GET    /admin/users                    - List all users (filter by role)
GET    /admin/users/:id                - Get user details
PATCH  /admin/users/:id/status         - Suspend/Activate user
```

### Therapist Management (2 endpoints)

```
GET    /admin/therapists               - List therapist applications
PATCH  /admin/therapists/:id/approve   - Approve/Reject therapist
```

### Content Moderation (2 endpoints)

```
GET    /admin/reports                  - Get reported content
PATCH  /admin/reports/:id/resolve      - Resolve report (delete content/dismiss)
```

### System Settings (1 endpoint)

```
GET    /admin/settings                 - Get system configuration
```

---

## 🔌 WEBSOCKET EVENTS

### Client -> Server

```
join_room       - Join a specific chat/notification room
send_message    - Send a chat message
typing_start    - User started typing
typing_stop     - User stopped typing
read_message    - Mark message as read
```

### Server -> Client

```
receive_message - New message received
notification    - New system notification
user_online     - A user came online
user_offline    - A user went offline
typing_status   - Typing indicator update
error           - Operation error
```
