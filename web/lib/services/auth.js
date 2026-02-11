import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { connectDB } from './mongodb.js';
import { encrypt } from '../utils/encryption.js';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp, name) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Decision Fatigue Reducer',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Decision Fatigue Reducer!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #6b46c1; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Decision Fatigue Reducer Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function registerUser(name, email, password, apiKeys = {}, preferredProvider = 'openrouter') {
  // Ensure DB connection
  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Generate OTP
  const otpCode = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Encrypt API keys
  const encryptedKeys = new Map();
  for (const [provider, key] of Object.entries(apiKeys)) {
    if (key) {
      encryptedKeys.set(provider, encrypt(key));
    }
  }

  // Create user document
  const user = new User({
    name,
    email,
    passwordHash,
    encryptedApiKeys: Object.fromEntries(encryptedKeys),
    preferences: {
      meal: {},
      task: {}
    },
    isEmailVerified: false,
    otpCode,
    otpExpiresAt,
    preferredProvider,
    onboarded: false
  });

  await user.save();

  // Send OTP email
  try {
    await sendOTPEmail(email, otpCode, name);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    // Don't throw here - user is created, they can request resend
  }

  return {
    userId: user._id.toString(),
    email,
    message: 'Registration successful. Please check your email for OTP.'
  };
}

export async function verifyOTP(email, otp) {
  // Ensure DB connection
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.isEmailVerified) {
    throw new Error('Email already verified');
  }

  if (user.otpCode !== otp) {
    throw new Error('Invalid OTP');
  }

  if (new Date() > user.otpExpiresAt) {
    throw new Error('OTP has expired. Please request a new one.');
  }

  // Update user as verified
  user.isEmailVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  // Generate JWT for auto-login
  const token = generateToken(user._id.toString());

  return {
    userId: user._id.toString(),
    token,
    email: user.email,
    name: user.name,
    onboarded: user.onboarded,
    preferredProvider: user.preferredProvider,
    profilePhoto: user.profilePhoto,
    message: 'Email verified successfully'
  };
}

export async function resendOTP(email) {
  // Ensure DB connection
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.isEmailVerified) {
    throw new Error('Email already verified');
  }

  // Generate new OTP
  const otpCode = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  user.otpCode = otpCode;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  // Send OTP email
  await sendOTPEmail(email, otpCode, user.name);

  return {
    message: 'New OTP sent successfully'
  };
}

export async function loginUser(email, password) {
  // Ensure DB connection
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isEmailVerified) {
    throw new Error('Please verify your email first. Check your inbox for OTP.');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id.toString());

  return {
    userId: user._id.toString(),
    token,
    email: user.email,
    name: user.name,
    onboarded: user.onboarded,
    preferredProvider: user.preferredProvider,
    profilePhoto: user.profilePhoto
  };
}

export async function completeOnboarding(userId, { provider, apiKey, profilePhoto, skip, name, onboarding }) {
  await connectDB();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const providerToUse = provider || user.preferredProvider || 'openrouter';
  if (provider) {
    user.preferredProvider = provider;
  }

  const existingKey = user.encryptedApiKeys?.get(providerToUse);
  const encryptedKeys = new Map();

  if (apiKey) {
    encryptedKeys.set(providerToUse, encrypt(apiKey));
  } else if (existingKey) {
    encryptedKeys.set(providerToUse, existingKey);
  }

  user.encryptedApiKeys = encryptedKeys;
  user.markModified('encryptedApiKeys');

  if (profilePhoto) {
    user.profilePhoto = profilePhoto;
  }

  if (name) {
    user.name = name;
  }

  if (onboarding) {
    const {
      profile,
      health,
      work,
      foodPreferences,
      clothingPreferences,
      taskStyle,
      decisionStyle
    } = onboarding;

    if (profile) user.profile = profile;
    if (health) user.health = health;
    if (work) user.work = work;
    if (foodPreferences) user.foodPreferences = foodPreferences;
    if (clothingPreferences) user.clothingPreferences = clothingPreferences;
    if (taskStyle) user.taskStyle = taskStyle;
    if (decisionStyle) user.decisionStyle = decisionStyle;
  }

  user.onboarded = true;
  user.updatedAt = new Date();

  await user.save();

  return {
    userId: user._id.toString(),
    profilePhoto: user.profilePhoto,
    preferredProvider: user.preferredProvider,
    onboarded: user.onboarded,
    name: user.name
  };
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function getUserById(userId) {
  // Ensure DB connection
  await connectDB();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function getDecryptedApiKey(userId, provider) {
  const { decrypt } = await import('../utils/encryption.js');
  const user = await getUserById(userId);

  const encryptedKey = user.encryptedApiKeys.get(provider);
  if (!encryptedKey) {
    return null;
  }

  return decrypt(encryptedKey);
}
