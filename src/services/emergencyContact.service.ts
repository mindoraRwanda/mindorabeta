import { db } from '../config/database';
import { emergencyContacts } from '../database/schema';
import { eq } from 'drizzle-orm';

/**
 * Add emergency contact
 */
export const addEmergencyContact = async (
  userId: string,
  name: string,
  relationship: string,
  phone: string,
  email?: string,
) => {
  const [contact] = await db
    .insert(emergencyContacts)
    .values({
      userId,
      name,
      relationship,
      phone,
      email,
    })
    .returning();

  return contact;
};

/**
 * Get user emergency contacts
 */
export const getUserEmergencyContacts = async (userId: string) => {
  const contacts = await db
    .select()
    .from(emergencyContacts)
    .where(eq(emergencyContacts.userId, userId));

  return contacts;
};

/**
 * Delete emergency contact
 */
export const deleteEmergencyContact = async (contactId: string) => {
  await db.delete(emergencyContacts).where(eq(emergencyContacts.id, contactId));
};
