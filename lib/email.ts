import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
})
const generateVerficationLink = async (email: string) => {
  const timestamp = Date.now();
  const dataToHash = `${email}${process.env.UNIVERSAL_SECRET}${timestamp}`;
  const secret = await bcrypt.hash(dataToHash, 10);
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/email-verification/verify-link?email=${email}&secret=${secret}&timestamp=${timestamp}`
}

const generatePasswordResetLink = async (email: string) => {
  const timestamp = Date.now();
  const dataToHash = `${email}${process.env.UNIVERSAL_SECRET}${timestamp}`;
  const secret = await bcrypt.hash(dataToHash, 10);
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/forgot-password/reset?email=${email}&secret=${secret}&timestamp=${timestamp}`
}

export async function sendVerificationEmail(email: string, name: string, otp: string) {
  const verificationLink = await generateVerficationLink(email);
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: email,
    subject: `Verify Your AmsaFintech Account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${name ?? 'User'},</h2>
        <p>Your verification code for AmsaFintech account is:</p>
        <div style="background-color: #60A5FA; color: #ffffff; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otp}</strong>
        </div>
        <p>Click the button below to verify your account:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" style="background-color: #60A5FA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Account
          </a>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This code will expire in 1 minute</li>
          <li>Your account will be deleted if not verified within 24 hours</li>
        </ul>
        <p>If you didn't request this verification, please ignore this email.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated message, please do not reply to this email.</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, name: string) {
  const resetLink = await generatePasswordResetLink(email);
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: email,
    subject: `Reset Your AmsaFintech Password`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${name ?? 'User'},</h2>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #60A5FA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Set New Password
          </a>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This link will expire in 5 minutes</li>
          <li>If you didn't request this password reset, please ignore this email</li>
        </ul>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated message, please do not reply to this email.</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Password reset email sending error:', error)
    return { success: false, error }
  }
}