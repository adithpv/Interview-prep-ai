import { z } from "zod";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export const loginSchema = z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email format"),
    password: z.string({ message: "Password is required" }).min(1, "Password is required"),
});

export const registerSchema = z.object({
    name: z
        .string({ message: "Name is required" })
        .min(2, "Name must be at least 2 characters long"),
    email: z
        .string({ message: "Email is required" })
        .email("Invalid email format"),
    password: z
        .string({ message: "Password is required" })
        .regex(
            passwordRegex,
            "Password must be at least 8 characters long and contain at least one letter and one number"
        ),
});
