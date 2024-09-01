import { string, z } from 'zod';

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

export const createPostSchema = z.object({
    content: requiredString,
});

export const updateUserProfileSchema = z.object({
    displayName: requiredString,
    bio: string().max(1000, "Bio must be 1000 characters or less"),
})

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;