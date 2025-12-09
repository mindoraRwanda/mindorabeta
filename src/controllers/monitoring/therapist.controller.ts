import { Request, Response, NextFunction } from 'express';
import * as monitoringService from '../../services/monitoring.service';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';

/**
 * Create monitoring entry
 */
export const createEntry = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const entry = await monitoringService.createMonitoringEntry(
        req.params.patientId,
        req.user!.userId,
        req.body.riskLevel,
        req.body.notes,
    );
    successResponse(res, entry, 'Monitoring entry created', 201);
});

/**
 * Get monitoring report
 */
export const getReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const days = parseInt(req.query.days as string) || 30;
    const report = await monitoringService.getMonitoringReport(req.params.patientId, days);
    successResponse(res, report);
});
