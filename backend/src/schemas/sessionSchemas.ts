import { z } from "zod";

export const createSessionSchema = z.object({
    body: z.object({
        role: z.string().trim().min(1, "Role is required"),
        experience: z.string().trim().min(1, "Experience is required"),
        topicsToFocus: z.string().trim().min(1, "Topics to focus is required"),
        description: z.string().trim().optional().default(""),
        questions: z.array(z.object({ 
            question: z.string().trim().min(1), 
            answer: z.string().trim().min(1) 
        })).min(1, "At least one question is required"),
    })
});

export const updateSessionSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid session ID format")
    }),
    body: z.object({
        role: z.string().trim().min(1).optional(),
        experience: z.string().trim().min(1).optional(),
        topicsToFocus: z.string().trim().min(1).optional(),
        description: z.string().trim().optional(),
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field to update is required"
    })
});
