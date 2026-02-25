import { resend, EMAIL_FROM } from '../config/email';
import { EMAIL_SUBJECTS } from '../utils/constants';
import { logger } from '../utils/logger';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email
 */
export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      logger.error('Failed to send email:', error);
      return false;
    }

    logger.info(`Email sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    logger.error('Failed to send email:', error);
    return false;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (to: string, name: string): Promise<boolean> => {
  const html = `
    <h1>Welcome to Mindora, ${name}!</h1>
    <p>We're excited to have you on your mental health journey.</p>
    <p>Explore our platform to:</p>
    <ul>
      <li>Connect with qualified therapists</li>
      <li>Practice mindfulness exercises</li>
      <li>Track your mood and progress</li>
      <li>Join our supportive community</li>
    </ul>
    <p>Best regards,<br>The Mindora Team</p>
  `;

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.WELCOME,
    html,
    text: `Welcome to Mindora, ${name}! We're excited to have you on your mental health journey.`,
  });
};

/**
 * Send email verification
 */
export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string,
): Promise<boolean> => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const html = `
    <h1>Verify Your Email</h1>
    <p>Hi ${name},</p>
    <p>Please verify your email address by clicking the link below:</p>
    <p><a href="${verificationUrl}">Verify Email</a></p>
    <p>Or copy and paste this URL: ${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account with Mindora, please ignore this email.</p>
  `;

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
    html,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  token: string,
): Promise<boolean> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <h1>Reset Your Password</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the link below to proceed:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>Or copy and paste this URL: ${resetUrl}</p>
    <p>This link will expire in 2 hours.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>
  `;

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.PASSWORD_RESET,
    html,
  });
};

/**
 * Send appointment confirmation email
 */
export const sendAppointmentConfirmationEmail = async (
  to: string,
  name: string,
  appointmentDetails: {
    therapistName: string;
    date: string;
    time: string;
    type: string;
  },
): Promise<boolean> => {
  const html = `
    <h1>Appointment Confirmed</h1>
    <p>Hi ${name},</p>
    <p>Your appointment has been confirmed!</p>
    <p><strong>Therapist:</strong> ${appointmentDetails.therapistName}</p>
    <p><strong>Date:</strong> ${appointmentDetails.date}</p>
    <p><strong>Time:</strong> ${appointmentDetails.time}</p>
    <p><strong>Type:</strong> ${appointmentDetails.type}</p>
    <p>We'll send you a reminder 24 hours before your appointment.</p>
    <p>Take care,<br>The Mindora Team</p>
  `;

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.APPOINTMENT_CONFIRMATION,
    html,
  });
};

/**
 * Send therapist approval email
 */
export const sendTherapistApprovedEmail = async (to: string, name: string): Promise<boolean> => {
  const html = `
    <h1>Congratulations!</h1>
    <p>Hi ${name},</p>
    <p>Your therapist application has been approved!</p>
    <p>You can now:</p>
    <ul>
      <li>Set your availability</li>
      <li>Accept appointments</li>
      <li>Connect with patients</li>
    </ul>
    <p>Welcome to the Mindora therapist community!</p>
    <p>Best regards,<br>The Mindora Team</p>
  `;

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.THERAPIST_APPROVED,
    html,
  });
};
