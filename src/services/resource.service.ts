import { db } from '../config/database';
import { resources } from '../database/schema';
import { eq } from 'drizzle-orm';

/**
 * Create resource
 */
export const createResource = async (data: {
  title: string;
  description?: string;
  type?: string;
  url?: string;
  imageUrl?: string;
  isPremium?: boolean;
}) => {
  const [resource] = await db.insert(resources).values(data).returning();
  return resource;
};

/**
 * Get all resources
 */
export const getAllResources = async () => {
  const resourceList = await db.select().from(resources).limit(100);
  return resourceList;
};

/**
 * Get resource by ID
 */
export const getResourceById = async (resourceId: string) => {
  const [resource] = await db.select().from(resources).where(eq(resources.id, resourceId)).limit(1);
  return resource;
};

/**
 * Delete resource
 */
export const deleteResource = async (resourceId: string) => {
  await db.delete(resources).where(eq(resources.id, resourceId));
};
