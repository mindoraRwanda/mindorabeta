import { ADJECTIVES, ANIMALS } from './constants';

/**
 * Generate a random anonymous name like "Brave Lion" or "Gentle Butterfly"
 */
export const generateAnonymousName = (): string => {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return `${adjective} ${animal}`;
};

/**
 * Generate a unique anonymous name (checks for uniqueness)
 */
export const generateUniqueAnonymousName = async (
    checkUniqueness: (name: string) => Promise<boolean>,
): Promise<string> => {
    let name = generateAnonymousName();
    let attempts = 0;
    const maxAttempts = 50;

    while (!(await checkUniqueness(name)) && attempts < maxAttempts) {
        name = generateAnonymousName();
        attempts++;
    }

    // If we couldn't find a unique name, append a random number
    if (attempts >= maxAttempts) {
        name = `${name} ${Math.floor(Math.random() * 1000)}`;
    }

    return name;
};
