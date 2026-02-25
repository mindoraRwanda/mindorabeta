# Services

The service layer contains business logic and database operations.

**Location:** `src/services/`

---

## Service Overview

| Service          | File                          | Description                    |
| ---------------- | ----------------------------- | ------------------------------ |
| Auth             | `auth.service.ts`             | Authentication & authorization |
| User             | `user.service.ts`             | User profile management        |
| Therapist        | `therapist.service.ts`        | Therapist operations           |
| Appointment      | `appointment.service.ts`      | Booking & scheduling           |
| Exercise         | `exercise.service.ts`         | Exercise management            |
| MoodLog          | `moodLog.service.ts`          | Mood tracking                  |
| Post             | `post.service.ts`             | Community posts                |
| Message          | `message.service.ts`          | Direct messaging               |
| Notification     | `notification.service.ts`     | Notifications                  |
| Review           | `review.service.ts`           | Therapist reviews              |
| Resource         | `resource.service.ts`         | Mental health resources        |
| EmergencyContact | `emergencyContact.service.ts` | Crisis contacts                |
| Monitoring       | `monitoring.service.ts`       | Patient monitoring             |
| Achievement      | `achievement.service.ts`      | Gamification                   |
| Streak           | `streak.service.ts`           | Activity streaks               |
| Email            | `email.service.ts`            | Email sending                  |
| Cloudinary       | `cloudinary.service.ts`       | Image storage                  |
| Socket           | `socket.service.ts`           | Real-time events               |

---

## Auth Service

Handles authentication flows.

```typescript
class AuthService {
  register(data: RegisterInput): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  logout(refreshToken: string): Promise<void>;
  refreshToken(token: string): Promise<TokenPair>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  changePassword(userId: string, current: string, newPass: string): Promise<void>;
}
```

---

## User Service

User profile operations.

```typescript
class UserService {
  getProfile(userId: string): Promise<User>;
  updateProfile(userId: string, data: ProfileUpdate): Promise<User>;
  uploadAvatar(userId: string, file: File): Promise<string>;
  deleteAvatar(userId: string): Promise<void>;
  getStatistics(userId: string): Promise<UserStats>;
  getDashboard(userId: string): Promise<DashboardData>;
}
```

---

## Therapist Service

Therapist-specific operations.

```typescript
class TherapistService {
  createProfile(userId: string, data: TherapistProfile): Promise<Therapist>;
  updateProfile(therapistId: string, data: Partial<TherapistProfile>): Promise<Therapist>;
  getAvailability(therapistId: string): Promise<Availability[]>;
  setAvailability(therapistId: string, slots: AvailabilitySlot[]): Promise<void>;
  getPatients(therapistId: string): Promise<Patient[]>;
  getPatientDetails(therapistId: string, patientId: string): Promise<PatientDetails>;
}
```

---

## Appointment Service

Appointment management.

```typescript
class AppointmentService {
  create(patientId: string, data: AppointmentInput): Promise<Appointment>;
  getById(appointmentId: string): Promise<Appointment>;
  getByUser(userId: string, role: Role): Promise<Appointment[]>;
  confirm(appointmentId: string): Promise<void>;
  cancel(appointmentId: string, reason: string): Promise<void>;
  complete(appointmentId: string): Promise<void>;
  reschedule(appointmentId: string, newTime: TimeSlot): Promise<void>;
}
```

---

## MoodLog Service

Mood tracking operations.

```typescript
class MoodLogService {
  create(userId: string, data: MoodInput): Promise<MoodLog>;
  getByUser(userId: string, dateRange?: DateRange): Promise<MoodLog[]>;
  getById(logId: string): Promise<MoodLog>;
  update(logId: string, data: Partial<MoodInput>): Promise<MoodLog>;
  delete(logId: string): Promise<void>;
  getAnalytics(userId: string, period: Period): Promise<MoodAnalytics>;
}
```

---

## Post Service

Community post management.

```typescript
class PostService {
  create(userId: string, data: PostInput): Promise<Post>;
  getAll(options: PaginationOptions): Promise<PaginatedPosts>;
  getById(postId: string): Promise<Post>;
  update(postId: string, data: Partial<PostInput>): Promise<Post>;
  delete(postId: string): Promise<void>;
  like(postId: string, userId: string): Promise<void>;
  unlike(postId: string, userId: string): Promise<void>;
  flag(postId: string, userId: string, reason: string): Promise<void>;
  addComment(postId: string, userId: string, content: string): Promise<Comment>;
}
```

---

## Email Service

Email sending via Resend.

```typescript
class EmailService {
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendAppointmentConfirmation(email: string, appointment: Appointment): Promise<void>;
  sendAppointmentReminder(email: string, appointment: Appointment): Promise<void>;
}
```

---

## Notification Service

User notifications.

```typescript
class NotificationService {
  create(userId: string, type: NotificationType, data: NotificationData): Promise<Notification>;
  getByUser(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
  delete(notificationId: string): Promise<void>;
}
```

---

## Socket Service

Real-time event management.

```typescript
class SocketService {
  emitToUser(userId: string, event: string, data: any): void;
  emitToRoom(room: string, event: string, data: any): void;
  notifyNewMessage(recipientId: string, message: Message): void;
  notifyNewNotification(userId: string, notification: Notification): void;
  notifyAppointmentUpdate(userId: string, appointment: Appointment): void;
}
```

---

## Service Patterns

### Error Handling

Services throw typed errors caught by error middleware:

```typescript
import { ApiError } from '../utils/apiError';

if (!user) {
  throw new ApiError(404, 'User not found');
}
```

### Database Transactions

For atomic operations:

```typescript
await db.transaction(async (tx) => {
  await tx.insert(appointments).values(appointmentData);
  await tx.update(therapistAvailability)...
});
```

### Dependency Injection

Services are exported as singletons:

```typescript
export const authService = new AuthService();
```
