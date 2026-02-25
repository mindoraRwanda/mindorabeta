import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Mindora <onboarding@resend.dev>';
