import { db } from '../../config/database';
import { resources, exercises, achievements } from '../schema';

/**
 * Seed sample resources
 */
export async function seedResources() {
    // Check if resources already exist
    const existingResources = await db.query.resources.findMany();

    if (existingResources.length > 0) {
        console.log('Resources already exist');
        return existingResources;
    }

    const resourceData = await db.insert(resources).values([
        {
            title: 'Understanding Anxiety',
            description: 'A comprehensive guide to understanding and managing anxiety disorders.',
            type: 'article',
            url: 'https://mindora.rw/resources/anxiety-guide',
            imageUrl: '/images/resources/anxiety.jpg',
            isPremium: false,
        },
        {
            title: 'Guided Meditation for Beginners',
            description: 'A 10-minute guided meditation to help you relax and find inner peace.',
            type: 'video',
            url: 'https://mindora.rw/resources/meditation-video',
            imageUrl: '/images/resources/meditation.jpg',
            isPremium: false,
        },
        {
            title: 'Crisis Hotline Rwanda',
            description: '24/7 mental health crisis support line for immediate assistance.',
            type: 'helpline',
            url: 'tel:+250788000000',
            imageUrl: '/images/resources/helpline.jpg',
            isPremium: false,
        },
        {
            title: 'Depression Recovery Guide',
            description: 'Step-by-step guide for recovering from depression with professional support.',
            type: 'article',
            url: 'https://mindora.rw/resources/depression-guide',
            imageUrl: '/images/resources/depression.jpg',
            isPremium: true,
        },
        {
            title: 'Sleep Hygiene Tips',
            description: 'Essential tips for improving your sleep quality and mental health.',
            type: 'article',
            url: 'https://mindora.rw/resources/sleep-tips',
            imageUrl: '/images/resources/sleep.jpg',
            isPremium: false,
        },
    ]).returning();

    console.log('Resources created successfully');
    return resourceData;
}

/**
 * Seed sample exercises
 */
export async function seedExercises() {
    // Check if exercises already exist
    const existingExercises = await db.query.exercises.findMany();

    if (existingExercises.length > 0) {
        console.log('Exercises already exist');
        return existingExercises;
    }

    const exerciseData = await db.insert(exercises).values([
        {
            title: 'Deep Breathing Exercise',
            description: 'A simple but effective breathing technique to reduce stress and anxiety. Inhale for 4 counts, hold for 7, exhale for 8.',
            category: 'breathing',
            durationMinutes: 5,
            difficulty: 1,
            imageUrl: '/images/exercises/breathing.jpg',
            isPremium: false,
        },
        {
            title: 'Body Scan Meditation',
            description: 'A mindfulness practice where you focus attention on different parts of your body to release tension.',
            category: 'mindfulness',
            durationMinutes: 15,
            difficulty: 2,
            imageUrl: '/images/exercises/body-scan.jpg',
            isPremium: false,
        },
        {
            title: 'Gratitude Journaling',
            description: 'Write down three things you are grateful for. This practice helps shift focus to positive aspects of life.',
            category: 'CBT',
            durationMinutes: 10,
            difficulty: 1,
            imageUrl: '/images/exercises/gratitude.jpg',
            isPremium: false,
        },
        {
            title: 'Progressive Muscle Relaxation',
            description: 'Systematically tense and relax muscle groups to reduce physical tension and promote relaxation.',
            category: 'relaxation',
            durationMinutes: 20,
            difficulty: 2,
            imageUrl: '/images/exercises/muscle-relaxation.jpg',
            isPremium: false,
        },
        {
            title: 'Cognitive Restructuring',
            description: 'Identify and challenge negative thought patterns, replacing them with more balanced thoughts.',
            category: 'CBT',
            durationMinutes: 15,
            difficulty: 3,
            imageUrl: '/images/exercises/cognitive.jpg',
            isPremium: true,
        },
        {
            title: 'Loving-Kindness Meditation',
            description: 'A meditation practice focused on developing feelings of goodwill, kindness, and warmth towards yourself and others.',
            category: 'mindfulness',
            durationMinutes: 15,
            difficulty: 2,
            imageUrl: '/images/exercises/loving-kindness.jpg',
            isPremium: false,
        },
    ]).returning();

    console.log('Exercises created successfully');
    return exerciseData;
}

/**
 * Seed sample achievements
 */
export async function seedAchievements() {
    // Check if achievements already exist
    const existingAchievements = await db.query.achievements.findMany();

    if (existingAchievements.length > 0) {
        console.log('Achievements already exist');
        return existingAchievements;
    }

    const achievementData = await db.insert(achievements).values([
        {
            title: 'First Steps',
            description: 'Complete your first exercise',
            icon: '🎯',
            points: 10,
        },
        {
            title: 'Consistent',
            description: 'Log your mood for 7 consecutive days',
            icon: '📅',
            points: 50,
        },
        {
            title: 'Meditation Master',
            description: 'Complete 10 meditation exercises',
            icon: '🧘',
            points: 100,
        },
        {
            title: 'Community Member',
            description: 'Make your first community post',
            icon: '👥',
            points: 20,
        },
        {
            title: 'Helping Hand',
            description: 'Leave 5 supportive comments on community posts',
            icon: '🤝',
            points: 30,
        },
        {
            title: 'Month Strong',
            description: 'Maintain a 30-day streak',
            icon: '🏆',
            points: 200,
        },
        {
            title: 'Self-Aware',
            description: 'Log 50 mood entries',
            icon: '🎭',
            points: 75,
        },
        {
            title: 'Breathing Pro',
            description: 'Complete all breathing exercises',
            icon: '💨',
            points: 60,
        },
    ]).returning();

    console.log('Achievements created successfully');
    return achievementData;
}
