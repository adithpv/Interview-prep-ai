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
}

export interface DeleteSessionParams {
    sessionId: string;
    userId: string;
}
