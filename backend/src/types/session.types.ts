export interface CreateSessionParams {
    role: string;
    experience: string;
    topicsToFocus: string;
    description: string;
    questions: { question: string; answer: string }[];
    userId: string;
}

export interface GetSessionByIdParams {
    sessionId: string;
    userId: string;
}

export interface UpdateSessionParams {
    sessionId: string;
    userId: string;
    role?: string;
    experience?: string;
    topicsToFocus?: string;
    description?: string;
}

export interface DeleteSessionParams {
    sessionId: string;
    userId: string;
}
