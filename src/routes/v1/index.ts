import { Router } from 'express';

// Import all route modules
// import authRoutes from './auth.routes';
// import userRoutes from './user.routes';
// import therapistRoutes from './therapist.routes';
// import appointmentRoutes from './appointment.routes';
// import exerciseRoutes from './exercise.routes';
// import communityRoutes from './community.routes';
// import moodRoutes from './mood.routes';
// import monitoringRoutes from './monitoring.routes';
// import adminRoutes from './admin.routes';
// import resourceRoutes from './resource.routes';
// import notificationRoutes from './notification.routes';
// import messageRoutes from './message.routes';
// import emergencyRoutes from './emergency.routes';
// import reviewRoutes from './review.routes';

const router = Router();

// Mount all v1 routes
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/therapists', therapistRoutes);
// router.use('/appointments', appointmentRoutes);
// router.use('/exercises', exerciseRoutes);
// router.use('/community', communityRoutes);
// router.use('/mood', moodRoutes);
// router.use('/monitoring', monitoringRoutes);
// router.use('/admin', adminRoutes);
// router.use('/resources', resourceRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/messages', messageRoutes);
// router.use('/emergency', emergencyRoutes);
// router.use('/reviews', reviewRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mindora API v1 is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;