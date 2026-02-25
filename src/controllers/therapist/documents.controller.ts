import { Request, Response, NextFunction } from 'express';
import * as therapistService from '../../services/therapist.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Upload document
 */
export const uploadDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const document = await therapistService.uploadDocument(
      req.params.therapistId || req.user!.userId,
      req.body.type || 'license',
      req.file.buffer,
    );
    successResponse(res, document, 'Document uploaded successfully', 201);
  },
);
