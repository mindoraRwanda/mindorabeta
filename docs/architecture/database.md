# Database Schema

PostgreSQL database using Drizzle ORM.

**Schema file:** `src/database/schema.ts`

---

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│    ┌──────────┐                                                  │
│    │  users   │◄───────────────────────────────────────────────┐ │
│    └────┬─────┘                                                │ │
│         │                                                      │ │
│    ┌────┴─────┐        ┌────────────────┐                      │ │
│    │ profiles │        │   therapists   │──► therapist_docs    │ │
│    └──────────┘        └───────┬────────┘    therapist_avail   │ │
│                                │                               │ │
└────────────────────────────────┼───────────────────────────────┘ │
                                 │                                 │
┌────────────────────────────────┼─────────────────────────────────┤
│                     APPOINTMENTS                                 │
│    ┌────────────────┐          │                                 │
│    │  appointments  │◄─────────┘                                 │
│    └───────┬────────┘                                            │
│            │                                                     │
│    ┌───────┴────────┐                                            │
│    │ session_notes  │                                            │
│    └────────────────┘                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┤
                                                                   │
┌──────────────────────────────────────────────────────────────────┤
│                      COMMUNITY                                   │
│    ┌─────────┐      ┌───────────┐      ┌─────────────┐           │
│    │  posts  │──────│ post_likes│      │  comments   │           │
│    └────┬────┘      └───────────┘      └─────────────┘           │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┤
          │                                                        │
┌─────────┼────────────────────────────────────────────────────────┤
│         │              PATIENT FEATURES                          │
│    ┌────┴─────┐   ┌────────────┐   ┌──────────────────┐          │
│    │mood_logs │   │ exercises  │   │ user_exercises   │          │
│    └──────────┘   └────────────┘   └──────────────────┘          │
│                                                                  │
│    ┌────────────────────┐   ┌───────────────┐                    │
│    │ patient_monitoring │   │ notifications │                    │
│    └────────────────────┘   └───────────────┘                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tables

### users

Core user table.

| Column        | Type         | Description               |
| ------------- | ------------ | ------------------------- |
| id            | UUID         | Primary key               |
| email         | VARCHAR(255) | Unique email              |
| password      | TEXT         | Hashed password           |
| role          | ENUM         | PATIENT, THERAPIST, ADMIN |
| isActive      | BOOLEAN      | Account status            |
| emailVerified | BOOLEAN      | Email verified            |
| createdAt     | TIMESTAMP    | Creation date             |
| updatedAt     | TIMESTAMP    | Last update               |

### profiles

User profile information.

| Column      | Type         | Description         |
| ----------- | ------------ | ------------------- |
| id          | UUID         | Primary key         |
| userId      | UUID         | FK → users          |
| fullName    | VARCHAR(100) | Full name           |
| avatarUrl   | TEXT         | Profile image       |
| phoneNumber | VARCHAR(20)  | Phone               |
| dateOfBirth | DATE         | Birth date          |
| gender      | VARCHAR(20)  | Gender              |
| bio         | TEXT         | Biography           |
| streakCount | INTEGER      | Activity streak     |
| totalPoints | INTEGER      | Gamification points |

### therapists

Therapist-specific profile.

| Column            | Type         | Description                 |
| ----------------- | ------------ | --------------------------- |
| id                | UUID         | Primary key                 |
| userId            | UUID         | FK → users                  |
| specialization    | VARCHAR(255) | Specialty                   |
| licenseNumber     | VARCHAR(100) | License #                   |
| bio               | TEXT         | Professional bio            |
| yearsOfExperience | INTEGER      | Experience                  |
| isApproved        | BOOLEAN      | Admin approved              |
| approvalStatus    | ENUM         | PENDING, APPROVED, REJECTED |

### therapist_documents

Verification documents.

| Column      | Type         | Description                    |
| ----------- | ------------ | ------------------------------ |
| id          | UUID         | Primary key                    |
| therapistId | UUID         | FK → therapists                |
| type        | VARCHAR(100) | license, certificate, id_proof |
| url         | TEXT         | Document URL                   |
| verified    | BOOLEAN      | Verified by admin              |

### therapist_availability

Therapist schedule.

| Column      | Type    | Description      |
| ----------- | ------- | ---------------- |
| id          | UUID    | Primary key      |
| therapistId | UUID    | FK → therapists  |
| dayOfWeek   | INTEGER | 0-6 (Sun-Sat)    |
| startTime   | TIME    | Start time       |
| endTime     | TIME    | End time         |
| isRecurring | BOOLEAN | Weekly recurring |

### appointments

Therapy appointments.

| Column      | Type      | Description                              |
| ----------- | --------- | ---------------------------------------- |
| id          | UUID      | Primary key                              |
| patientId   | UUID      | FK → users                               |
| therapistId | UUID      | FK → therapists                          |
| startTime   | TIMESTAMP | Start                                    |
| endTime     | TIMESTAMP | End                                      |
| status      | ENUM      | PENDING, CONFIRMED, COMPLETED, CANCELLED |
| notes       | TEXT      | Appointment notes                        |
| meetingLink | TEXT      | Video call link                          |

### session_notes

Therapist notes for sessions.

| Column        | Type    | Description          |
| ------------- | ------- | -------------------- |
| id            | UUID    | Primary key          |
| appointmentId | UUID    | FK → appointments    |
| content       | TEXT    | Note content         |
| treatmentPlan | TEXT    | Treatment plan       |
| isPrivate     | BOOLEAN | Private to therapist |

### exercises

Mental health exercises.

| Column     | Type         | Description                      |
| ---------- | ------------ | -------------------------------- |
| id         | UUID         | Primary key                      |
| title      | VARCHAR(255) | Exercise title                   |
| content    | TEXT         | Instructions                     |
| category   | VARCHAR(100) | Category                         |
| difficulty | VARCHAR(50)  | beginner, intermediate, advanced |
| duration   | INTEGER      | Minutes                          |
| isApproved | BOOLEAN      | Admin approved                   |
| createdBy  | UUID         | FK → users (null = official)     |

### user_exercises

User exercise progress.

| Column      | Type      | Description                         |
| ----------- | --------- | ----------------------------------- |
| id          | UUID      | Primary key                         |
| userId      | UUID      | FK → users                          |
| exerciseId  | UUID      | FK → exercises                      |
| progress    | INTEGER   | 0-100%                              |
| status      | ENUM      | NOT_STARTED, IN_PROGRESS, COMPLETED |
| startedAt   | TIMESTAMP | Started                             |
| completedAt | TIMESTAMP | Completed                           |

### posts

Community posts.

| Column        | Type    | Description                |
| ------------- | ------- | -------------------------- |
| id            | UUID    | Primary key                |
| userId        | UUID    | FK → users                 |
| content       | TEXT    | Post content               |
| visibility    | ENUM    | PUBLIC, ANONYMOUS, PRIVATE |
| likesCount    | INTEGER | Like count                 |
| commentsCount | INTEGER | Comment count              |
| isModerated   | BOOLEAN | Admin approved             |

### post_likes

Post likes (many-to-many).

| Column    | Type      | Description     |
| --------- | --------- | --------------- |
| postId    | UUID      | FK → posts (PK) |
| userId    | UUID      | FK → users (PK) |
| createdAt | TIMESTAMP | When liked      |

### comments

Post comments.

| Column   | Type | Description             |
| -------- | ---- | ----------------------- |
| id       | UUID | Primary key             |
| postId   | UUID | FK → posts              |
| userId   | UUID | FK → users              |
| content  | TEXT | Comment text            |
| parentId | UUID | FK → comments (replies) |

### mood_logs

Mood tracking entries.

| Column       | Type      | Description                             |
| ------------ | --------- | --------------------------------------- |
| id           | UUID      | Primary key                             |
| userId       | UUID      | FK → users                              |
| mood         | ENUM      | VERY_BAD, BAD, NEUTRAL, GOOD, VERY_GOOD |
| anxietyLevel | ENUM      | NONE, MILD, MODERATE, SEVERE, EXTREME   |
| note         | TEXT      | User notes                              |
| loggedAt     | TIMESTAMP | When logged                             |

### patient_monitoring

Therapist monitoring of patients.

| Column      | Type        | Description       |
| ----------- | ----------- | ----------------- |
| id          | UUID        | Primary key       |
| patientId   | UUID        | FK → users        |
| therapistId | UUID        | FK → users        |
| note        | TEXT        | Monitoring note   |
| riskLevel   | VARCHAR(20) | LOW, MEDIUM, HIGH |

### notifications

User notifications.

| Column  | Type         | Description                                     |
| ------- | ------------ | ----------------------------------------------- |
| id      | UUID         | Primary key                                     |
| userId  | UUID         | FK → users                                      |
| type    | ENUM         | APPOINTMENT, MESSAGE, POST, SYSTEM, ACHIEVEMENT |
| title   | VARCHAR(255) | Title                                           |
| message | TEXT         | Content                                         |
| isRead  | BOOLEAN      | Read status                                     |

### messages

Direct messages.

| Column      | Type    | Description                    |
| ----------- | ------- | ------------------------------ |
| id          | UUID    | Primary key                    |
| senderId    | UUID    | FK → users                     |
| recipientId | UUID    | FK → users                     |
| content     | TEXT    | Message text                   |
| messageType | ENUM    | TEXT, IMAGE, VOICE, VIDEO_CALL |
| isRead      | BOOLEAN | Read status                    |

### emergency_contacts

Crisis hotlines and contacts.

| Column      | Type         | Description   |
| ----------- | ------------ | ------------- |
| id          | UUID         | Primary key   |
| name        | VARCHAR(255) | Contact name  |
| phoneNumber | VARCHAR(50)  | Phone         |
| description | TEXT         | Description   |
| isActive    | BOOLEAN      | Active status |

### resources

Mental health resources.

| Column      | Type         | Description              |
| ----------- | ------------ | ------------------------ |
| id          | UUID         | Primary key              |
| title       | VARCHAR(255) | Title                    |
| description | TEXT         | Description              |
| type        | VARCHAR(50)  | article, video, helpline |
| category    | VARCHAR(100) | Category                 |
| url         | TEXT         | Resource URL             |
| imageUrl    | TEXT         | Preview image            |
| isPremium   | BOOLEAN      | Premium only             |

### reviews

Therapist reviews.

| Column      | Type    | Description     |
| ----------- | ------- | --------------- |
| id          | UUID    | Primary key     |
| therapistId | UUID    | FK → therapists |
| patientId   | UUID    | FK → users      |
| rating      | INTEGER | 1-5 stars       |
| comment     | TEXT    | Review text     |

### achievements

Gamification achievements.

| Column      | Type         | Description      |
| ----------- | ------------ | ---------------- |
| id          | UUID         | Primary key      |
| title       | VARCHAR(100) | Achievement name |
| description | TEXT         | Description      |
| icon        | VARCHAR(100) | Icon identifier  |
| points      | INTEGER      | Points awarded   |

### user_achievements

User earned achievements.

| Column        | Type      | Description            |
| ------------- | --------- | ---------------------- |
| userId        | UUID      | FK → users (PK)        |
| achievementId | UUID      | FK → achievements (PK) |
| earnedAt      | TIMESTAMP | When earned            |

---

## Enums

```typescript
// User roles
type UserRole = 'PATIENT' | 'THERAPIST' | 'ADMIN';

// Appointment status
type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// Mood levels
type Mood = 'VERY_BAD' | 'BAD' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD';

// Anxiety levels
type AnxietyLevel = 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE' | 'EXTREME';

// Post visibility
type PostVisibility = 'PUBLIC' | 'ANONYMOUS' | 'PRIVATE';

// Notification types
type NotificationType = 'APPOINTMENT' | 'MESSAGE' | 'POST' | 'SYSTEM' | 'ACHIEVEMENT';

// Message types
type MessageType = 'TEXT' | 'IMAGE' | 'VOICE' | 'VIDEO_CALL';
```

---

## Indexes

Key indexes for performance:

- `users_email_idx` - Unique index on email
- Foreign key indexes on all relation columns
- Timestamp indexes for queries with date filters
