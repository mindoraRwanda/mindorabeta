import { Request, Response, NextFunction } from 'express';
import * as emergencyContactService from '../services/emergencyContact.service';
import { catchAsync } from '../utils/catchAsync';
import { successResponse } from '../utils/apiResponse';

/**
 * Add emergency contact
 */
export const addContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const contact = await emergencyContactService.addEmergencyContact(
    req.user!.userId,
    req.body.name,
    req.body.relationship,
    req.body.phone,
    req.body.email,
  );
  successResponse(res, contact, 'Emergency contact added', 201);
});

/**
 * Get contacts
 */
export const getContacts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const contacts = await emergencyContactService.getUserEmergencyContacts(req.user!.userId);
  successResponse(res, contacts);
});

/**
 * Delete contact
 */
export const deleteContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await emergencyContactService.deleteEmergencyContact(req.params.id);
  successResponse(res, null, 'Emergency contact deleted');
});
