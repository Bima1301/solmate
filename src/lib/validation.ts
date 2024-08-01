import { z } from 'zod';

const requiredString = z.string().trim().min(1, 'Required');

export const signupSchema = z.object({
    username: requiredString.regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, underscores, and hyphens are allowed"),
    email: requiredString.email("Invalid email address"),
    password: requiredString.min(8, "Password must be at least 8 characters long"),
});

export type SignUpValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    username: requiredString,
    password: requiredString.min(8, "Password must be at least 8 characters long"),
});

export type LoginValues = z.infer<typeof loginSchema>;