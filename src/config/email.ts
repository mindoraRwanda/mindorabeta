import { Resend } from 'resend';

// TODO: Move this API key to environment variables (RESEND_API_KEY)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Mindora <onboarding@resend.dev>';

