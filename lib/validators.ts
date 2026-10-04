import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  headline: z.string().max(500).optional(),
  bio: z.string().optional(),
  location: z.string().max(255).optional(),
  avatarUrl: z.string().url().or(z.literal('')).optional(),
  linkedinUrl: z.string().url().or(z.literal('')).optional(),
});

export const ConnectionRequestSchema = z.object({
  receiverId: z.number().int().positive('Valid receiver ID is required'),
  relType: z.enum(['colleague', 'classmate', 'friend', 'mentor', 'other']),
  message: z.string().max(1000).optional(),
});

export const ConnectionActionSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

export const ExperienceSchema = z.object({
  companyId: z.number().int().positive(),
  title: z.string().min(2),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
});
