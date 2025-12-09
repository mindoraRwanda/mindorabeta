import { format, parseISO, startOfDay, endOfDay, subDays, addDays, differenceInDays } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string, pattern = 'PPP'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern);
};

/**
 * Format date to time string
 */
export const formatTime = (date: Date | string): string => {
    return formatDate(date, 'p');
};

/**
 * Format date to datetime string
 */
export const formatDateTime = (date: Date | string): string => {
    return formatDate(date, 'PPpp');
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
    return startOfDay(date);
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
    return endOfDay(date);
};

/**
 * Get date range for the last N days
 */
export const getLastNDays = (days: number): { start: Date; end: Date } => {
    const end = new Date();
    const start = subDays(end, days);
    return { start, end };
};

/**
 * Get date N days from now
 */
export const getDaysFromNow = (days: number): Date => {
    return addDays(new Date(), days);
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1: Date | string, date2: Date | string): number => {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return differenceInDays(d2, d1);
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj < new Date();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj > new Date();
};
