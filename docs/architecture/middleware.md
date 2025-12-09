# Middleware

Express middleware for request processing.

**Location:** `src/middleware/`

---

## Middleware Stack

Request processing order:

```
Request
   │
   ▼
┌──────────────────┐
│  Helmet (Security)│
└────────┬─────────┘
         ▼
┌──────────────────┐
│  CORS            │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Morgan (Logging)│
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Rate Limiting   │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Body Parser     │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Authentication  │  ◄── Optional per route
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Role Check      │  ◄── Optional per route
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Validation      │  ◄── Optional per route
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Controller      │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Error Handler   │
└────────┬─────────┘
         ▼
Response
```

---

## Authentication Middleware

**File:** `auth.ts`

Validates JWT access token.

```typescript
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }
  
  const payload = verifyToken(token);
  req.user = payload;
  next();
};
```

**Usage:**
```typescript
router.get('/profile', authenticate, getProfile);
```

---

## Role Middleware

**File:** `role.ts`

Checks user role permissions.

```typescript
export const requireRole = (...roles: Role[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Insufficient permissions');
    }
    next();
  };
};
```

**Usage:**
```typescript
router.get('/admin/users', 
  authenticate, 
  requireRole('ADMIN'), 
  getUsers
);

router.get('/therapist/patients',
  authenticate,
  requireRole('THERAPIST', 'ADMIN'),
  getPatients
);
```

---

## Validation Middleware

**File:** `validate.ts`

Validates request body/params using Zod.

```typescript
export const validate = (schema: ZodSchema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    
    if (!result.success) {
      throw new ApiError(400, 'Validation error', result.error.errors);
    }
    
    req.validated = result.data;
    next();
  };
};
```

**Usage:**
```typescript
router.post('/register', 
  validate(registerSchema), 
  register
);
```

---

## Rate Limiting

**File:** `rateLimit.ts`

Prevents abuse and DDoS.

```typescript
// General API limit
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100
});

// Auth endpoints limit
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10
});

// Password reset limit
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3
});
```

---

## Error Handler

**File:** `error.ts`

Catches and formats errors.

```typescript
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error
  logger.error({
    message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
```

---

## Logger Middleware

**File:** `logger.ts`

HTTP request logging using Morgan.

```typescript
export const requestLogger = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
});
```

---

## Upload Middleware

**Location:** `middleware/upload/`

File upload handling with Multer.

```typescript
export const uploadImage = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});
```

**Usage:**
```typescript
router.post('/avatar', 
  authenticate, 
  uploadImage.single('avatar'), 
  uploadAvatar
);
```

---

## Compression Middleware

**File:** `compression.middleware.ts`

Response compression for performance.

```typescript
import compression from 'compression';

export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
});
```

---

## Not Found Handler

**File:** `notFound.middleware.ts`

Handles 404 for undefined routes.

```typescript
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
};
```

---

## Middleware Order in App

Applied in `src/app.ts`:

```typescript
// Security
app.use(helmet());
app.use(cors(corsOptions));

// Logging
app.use(requestLogger);

// Rate limiting
app.use('/api', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compressionMiddleware);

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);
```
