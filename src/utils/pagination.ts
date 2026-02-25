import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMetadata;
}

/**
 * Calculate pagination offset and limit
 */
export const calculatePagination = (
  params: PaginationParams,
): { offset: number; limit: number } => {
  const page = Math.max(1, params.page || 1);
  let limit = params.limit || DEFAULT_PAGE_SIZE;

  // Enforce max page size
  if (limit > MAX_PAGE_SIZE) {
    limit = MAX_PAGE_SIZE;
  }

  const offset = (page - 1) * limit;

  return { offset, limit };
};

/**
 * Generate pagination metadata
 */
export const generatePaginationMetadata = (
  totalItems: number,
  currentPage: number,
  pageSize: number,
): PaginationMetadata => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
  };
};

/**
 * Create paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  totalItems: number,
  currentPage: number,
  pageSize: number,
): PaginatedResponse<T> => {
  return {
    data,
    meta: generatePaginationMetadata(totalItems, currentPage, pageSize),
  };
};
