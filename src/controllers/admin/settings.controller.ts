import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Get platform settings - returns system configuration
 * Note: In production, these would be stored in a database settings table
 */
export const getSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Platform settings - in production, these would come from a database
  const settings = {
    platform: {
      name: 'Mindora',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      maintenanceMode: false,
    },
    features: {
      registrationEnabled: true,
      therapistRegistrationEnabled: true,
      communityEnabled: true,
      premiumFeaturesEnabled: true,
      emailVerificationRequired: true,
    },
    limits: {
      maxFileUploadSize: '10MB',
      maxAvatarSize: '5MB',
      appointmentMinDuration: 30,
      appointmentMaxDuration: 120,
      maxEmergencyContacts: 5,
    },
    notifications: {
      emailEnabled: true,
      pushEnabled: false,
      smsEnabled: false,
    },
    appointments: {
      cancellationWindowHours: 24,
      reminderHoursBefore: 1,
      autoConfirmEnabled: false,
    },
    moderation: {
      autoModerateEnabled: false,
      flagThreshold: 3,
    },
  };

  successResponse(res, settings);
});

/**
 * Update platform settings (Admin only)
 */
export const updateSettings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // In production, this would update settings in the database
    // For now, respond with the provided settings
    const updatedSettings = req.body;

    successResponse(res, updatedSettings, 'Settings updated successfully');
  },
);
