import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { successResponse } from '../../utils/apiResponse';
import { db } from '../../config/database';
import { users, profiles } from '../../database/schema';
import { eq, desc, like, or } from 'drizzle-orm';

/**
 * Get all users with optional filters
 */
export const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { role, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = db
        .select({
            id: users.id,
            email: users.email,
            role: users.role,
            isActive: users.isActive,
            isEmailVerified: users.isEmailVerified,
            lastLoginAt: users.lastLoginAt,
            createdAt: users.createdAt,
            fullName: profiles.fullName,
            avatarUrl: profiles.avatarUrl,
        })
        .from(users)
        .leftJoin(profiles, eq(users.id, profiles.userId))
        .orderBy(desc(users.createdAt))
        .limit(limitNum)
        .offset(offset);

    // Apply role filter if provided
    const conditions: any[] = [];
    if (role && ['PATIENT', 'THERAPIST', 'ADMIN'].includes(role as string)) {
        conditions.push(eq(users.role, role as 'PATIENT' | 'THERAPIST' | 'ADMIN'));
    }

    // Apply search filter if provided
    if (search) {
        const searchTerm = `%${search}%`;
        conditions.push(or(
            like(users.email, searchTerm),
            like(profiles.fullName, searchTerm)
        ));
    }

    // Execute query with conditions
    let result;
    if (conditions.length > 0) {
        // Build dynamic where clause
        const usersList = await db
            .select({
                id: users.id,
                email: users.email,
                role: users.role,
                isActive: users.isActive,
                isEmailVerified: users.isEmailVerified,
                lastLoginAt: users.lastLoginAt,
                createdAt: users.createdAt,
                fullName: profiles.fullName,
                avatarUrl: profiles.avatarUrl,
            })
            .from(users)
            .leftJoin(profiles, eq(users.id, profiles.userId))
            .where(role ? eq(users.role, role as 'PATIENT' | 'THERAPIST' | 'ADMIN') : undefined)
            .orderBy(desc(users.createdAt))
            .limit(limitNum)
            .offset(offset);
        result = usersList;
    } else {
        result = await query;
    }

    successResponse(res, {
        users: result,
        pagination: {
            page: pageNum,
            limit: limitNum,
            hasMore: result.length === limitNum,
        },
    });
});
