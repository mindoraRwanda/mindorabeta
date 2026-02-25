import { Request, Response, NextFunction } from 'express';
import * as monitoringService from '../../services/monitoring.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Get patient monitoring data
 */
export const getMonitoring = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await monitoringService.getPatientMonitoring(req.user!.userId);
  successResponse(res, data);
});
