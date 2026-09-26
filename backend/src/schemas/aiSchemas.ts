import { z } from "zod";

export const generateQuestionsSchema = z.object({
    body: z.object({
        role: z.string().trim().min(1, "Role is required").max(100),
        experience: z.union([z.string().trim().min(1), z.number().min(0).max(50)]),
        topicsToFocus: z.string().trim().min(1, "Topics to focus is required").max(500),
        numberOfQuestions: z.coerce.number().int().min(1, "At least 1 question is required").max(20, "Maximum 20 questions can be generated at once")
    })
});

export const generateExplanationSchema = z.object({
    body: z.object({
        question: z.string().trim().min(3, "Question is too short").max(1000, "Question is too long")
    })
});
