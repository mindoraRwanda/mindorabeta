import { db } from '../../config/database';
import { emergencyContacts, users } from '../schema';

/**
 * Seed sample emergency contacts for the patient user
 */
export async function seedEmergencyContacts() {
  // Find the sample patient
  const patient = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, 'patient@mindora.rw'),
  });

  if (!patient) {
    console.log('Patient not found - run user seeds first');
    return [];
  }

  // Check if emergency contacts already exist for this user
  const existingContacts = await db.query.emergencyContacts.findMany({
    where: (contacts, { eq }) => eq(contacts.userId, patient.id),
  });

  if (existingContacts.length > 0) {
    console.log('Emergency contacts already exist for patient');
    return existingContacts;
  }

  // Create sample emergency contacts
  const contacts = await db
    .insert(emergencyContacts)
    .values([
      {
        userId: patient.id,
        name: 'John Doe',
        relationship: 'Father',
        phone: '+250788123456',
        email: 'john.doe@example.com',
      },
      {
        userId: patient.id,
        name: 'Jane Doe',
        relationship: 'Mother',
        phone: '+250788654321',
        email: 'jane.doe@example.com',
      },
      {
        userId: patient.id,
        name: 'Dr. Smith',
        relationship: 'Doctor',
        phone: '+250788111222',
        email: 'dr.smith@hospital.rw',
      },
    ])
    .returning();

  console.log('Emergency contacts created successfully');
  return contacts;
}
