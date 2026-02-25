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
```
