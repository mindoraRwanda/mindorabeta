import { seedAdminUser, seedTherapistUser, seedPatientUser } from './01-admin-user.seed';
import { seedEmergencyContacts } from './02-emergency-contacts.seed';
import { seedResources, seedExercises, seedAchievements } from './03-sample-resources.seed';

/**
 * Run all seeds in order
 */
export async function runAllSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Step 1: Create users
    console.log('📦 Seeding users...');
    await seedAdminUser();
    await seedTherapistUser();
    await seedPatientUser();
    console.log('✅ Users seeded\n');

    // Step 2: Create emergency contacts for patient
    console.log('📦 Seeding emergency contacts...');
    await seedEmergencyContacts();
    console.log('✅ Emergency contacts seeded\n');

    // Step 3: Create resources, exercises, and achievements
    console.log('📦 Seeding resources...');
    await seedResources();
    console.log('✅ Resources seeded\n');

    console.log('📦 Seeding exercises...');
    await seedExercises();
    console.log('✅ Exercises seeded\n');

    console.log('📦 Seeding achievements...');
    await seedAchievements();
    console.log('✅ Achievements seeded\n');

    console.log('🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Export individual seed functions
export { seedAdminUser, seedTherapistUser, seedPatientUser } from './01-admin-user.seed';
export { seedEmergencyContacts } from './02-emergency-contacts.seed';
export { seedResources, seedExercises, seedAchievements } from './03-sample-resources.seed';
