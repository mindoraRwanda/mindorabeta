import { Request, Response, NextFunction } from 'express';
import * as resourceService from '../services/resource.service';
import { catchAsync } from '../utils/catchAsync';
import { successResponse } from '../utils/apiResponse';

/**
 * Get resources
 */
export const getResources = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const resources = await resourceService.getAllResources();
    successResponse(res, resources);
});

/**
 * Get resource by ID
 */
export const getResource = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const resource = await resourceService.getResourceById(req.params.id);
    successResponse(res, resource);
});
