import * as z from 'zod';

const emailRule = z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address");

const passwordRule = z.string()
    .min(6, "Password must be at least 6 characters");

export const loginSchema = z.object({
    email: emailRule,
    password: passwordRule,
})

export const registerSchema = z.object({
    fullName: z.string()
        .min(2, "Full name must ne at least 2 characters")
        .max(50, "Name is too long"),
    email: emailRule,
    password: passwordRule
        .regex(/[0-9]/, "Password must contain at least one number")
});

export const forgotPasswordSchema = z.object({
    email: emailRule,
})

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;