import { z } from "zod";

export const addQuestionsSchema = z.object({
    body: z.object({
        sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid session ID format"),
        questions: z.array(z.object({ 
            question: z.string().trim().min(1), 
            answer: z.string().trim().min(1) 
        })).min(1, "At least one question is required"),
    })
});

export const updateQuestionStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid question ID format")
    }),
    body: z.object({
        status: z.enum(['learning', 'mastered'])
    })
});

export const updateQuestionNoteSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid question ID format")
    }),
    body: z.object({
        note: z.string().default("") // Allows empty string to clear the note
    })
});
