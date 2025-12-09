import { z } from 'zod';

// Create monitoring entry schema
export const createMonitoringSchema = z.object({
    params: z.object({
        patientId: z.string().uuid('Invalid patient ID'),
    }),
    body: z.object({
        riskLevel: z.number().int().min(0).max(3, 'Risk level must be 0-3'),
        notes: z.string().max(2000).optional(),
    }),
});

// Update monitoring schema
export const updateMonitoringSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid monitoring ID'),
    }),
    body: z.object({
        riskLevel: z.number().int().min(0).max(3).optional(),
        notes: z.string().max(2000).optional(),
    }),
});

// Get monitoring report schema
export const getMonitoringReportSchema = z.object({
    params: z.object({
        patientId: z.string().uuid('Invalid patient ID'),
    }),
    query: z.object({
        days: z.string().optional(), // Number of days for report
    }),
});
