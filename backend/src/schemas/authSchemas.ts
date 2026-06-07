import { z } from "zod";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
// At least 8 characters width at least 1 alphabet and 1 number.

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ message: "Email is required" }).email("Invalid email format"),
        password: z.string({ message: "Password is required" }).min(1, "Password is required"),
    }),
});

export const registerSchema = z.object({
    body: z.object({
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
        profileImageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
    }),
});
