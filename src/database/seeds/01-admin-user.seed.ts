import { db } from '../../config/database';
import { users, profiles } from '../schema';
import bcrypt from 'bcryptjs';

/**
 * Seed admin user for initial setup
 */
export async function seedAdminUser() {
  const adminEmail = 'admin@mindora.rw';

  // Check if admin already exists
  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, adminEmail),
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return existingAdmin;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123!', 12);

  const [adminUser] = await db
    .insert(users)
    .values({
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true,
    })
    .returning();

  // Create admin profile
  await db.insert(profiles).values({
    userId: adminUser.id,
    fullName: 'System Administrator',
    bio: 'Mindora System Administrator',
  });

  console.log('Admin user created successfully');
  return adminUser;
}

/**
 * Seed sample therapist user
 */
export async function seedTherapistUser() {
  const therapistEmail = 'therapist@mindora.rw';

  const existingTherapist = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, therapistEmail),
  });

  if (existingTherapist) {
    console.log('Sample therapist already exists');
    return existingTherapist;
  }

  const hashedPassword = await bcrypt.hash('Therapist@123!', 12);

  const [therapistUser] = await db
    .insert(users)
    .values({
      email: therapistEmail,
      password: hashedPassword,
      role: 'THERAPIST',
      isActive: true,
      isEmailVerified: true,
    })
    .returning();

  await db.insert(profiles).values({
    userId: therapistUser.id,
    fullName: 'Dr. Sample Therapist',
    bio: 'Experienced mental health professional',
  });

  console.log('Sample therapist created successfully');
  return therapistUser;
}

/**
 * Seed sample patient user
 */
export async function seedPatientUser() {
  const patientEmail = 'patient@mindora.rw';

  const existingPatient = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, patientEmail),
  });

  if (existingPatient) {
    console.log('Sample patient already exists');
    return existingPatient;
  }

  const hashedPassword = await bcrypt.hash('Patient@123!', 12);

  const [patientUser] = await db
    .insert(users)
    .values({
      email: patientEmail,
      password: hashedPassword,
      role: 'PATIENT',
      isActive: true,
      isEmailVerified: true,
    })
    .returning();

  await db.insert(profiles).values({
    userId: patientUser.id,
    fullName: 'Sample Patient',
    bio: 'Looking to improve mental wellness',
  });

  console.log('Sample patient created successfully');
  return patientUser;
}
