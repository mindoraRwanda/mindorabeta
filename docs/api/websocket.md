# WebSocket API

Real-time communication using Socket.IO.

## Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-access-token',
  },
});
```

---

## Authentication

Include JWT token in connection auth:

```javascript
const socket = io(SERVER_URL, {
  auth: {
    token: accessToken,
  },
});
```

The server validates the token and associates the socket with the user.

---

## Events

### Connection Events

#### `connect`

Fired when connection is established.

```javascript
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});
```

#### `disconnect`

Fired when disconnected.

```javascript
socket.on('disconnect', reason => {
  console.log('Disconnected:', reason);
});
```

#### `connect_error`

Fired on connection error.

```javascript
socket.on('connect_error', error => {
  console.log('Connection error:', error.message);
});
```

---

### Messaging Events

#### `message:send` (Client → Server)

Send a message.

```javascript
socket.emit('message:send', {
  recipientId: 'user-uuid',
  content: 'Hello!',
  messageType: 'TEXT',
});
```

#### `message:received` (Server → Client)

Receive a new message.

```javascript
socket.on('message:received', message => {
  console.log('New message:', message);
  // { id, senderId, content, createdAt, messageType }
});
```

#### `message:read` (Client → Server)

Mark message as read.

```javascript
socket.emit('message:read', {
  messageId: 'message-uuid',
});
```

#### `message:typing` (Client → Server)

Indicate typing status.

```javascript
socket.emit('message:typing', {
  recipientId: 'user-uuid',
  isTyping: true,
});
```

#### `user:typing` (Server → Client)

Someone is typing to you.

```javascript
socket.on('user:typing', ({ userId, isTyping }) => {
  // Show/hide typing indicator
});
```

---

### Notification Events

#### `notification:new` (Server → Client)

Receive new notification.

```javascript
socket.on('notification:new', notification => {
  console.log('Notification:', notification);
  // { id, type, title, message, createdAt }
});
```

#### `notification:read` (Client → Server)

Mark notification as read.

```javascript
socket.emit('notification:read', {
  notificationId: 'notification-uuid',
});
```

---

### Presence Events

#### `user:online` (Server → Client)

User came online.

```javascript
socket.on('user:online', ({ userId }) => {
  // Update UI to show user online
});
```

#### `user:offline` (Server → Client)

User went offline.

```javascript
socket.on('user:offline', ({ userId }) => {
  // Update UI to show user offline
});
```

---

### Appointment Events

#### `appointment:reminder` (Server → Client)

Appointment reminder.

```javascript
socket.on('appointment:reminder', appointment => {
  // { id, therapistName, startTime, minutesUntil }
});
```

#### `appointment:updated` (Server → Client)

Appointment status changed.

```javascript
socket.on('appointment:updated', update => {
  // { appointmentId, status, message }
});
```

---

## Rooms

Users are automatically joined to their personal room on connection:

- `user:{userId}` - Personal notifications

Therapists are also joined to:

- `therapist:{therapistId}` - Therapist-specific updates

---

## Error Handling

```javascript
socket.on('error', error => {
  console.error('Socket error:', error);
});
```

Common errors:

- `AUTHENTICATION_FAILED` - Invalid token
- `UNAUTHORIZED` - Action not permitted
- `INVALID_PAYLOAD` - Missing/invalid data

---

## Reconnection

Socket.IO handles reconnection automatically:

```javascript
socket.on('reconnect', attemptNumber => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', error => {
  console.log('Reconnection failed');
});
```

---

## Complete Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: accessToken },
});

// Connection
socket.on('connect', () => {
  console.log('Connected');
});

// Messages
socket.on('message:received', message => {
  displayMessage(message);
});

// Notifications
socket.on('notification:new', notification => {
  showNotification(notification);
});

// Send message
function sendMessage(recipientId, content) {
  socket.emit('message:send', { recipientId, content });
}

// Cleanup on logout
function disconnect() {
  socket.disconnect();
}
```
