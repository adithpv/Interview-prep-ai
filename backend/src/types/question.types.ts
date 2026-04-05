export interface QuestionData {
    question: string;
    answer: string;
}

export interface AddQuestionsToSessionParams {
    sessionId: string;
    questions: QuestionData[];
    userId: string;
}

export interface TogglePinQuestionParams {
    questionId: string;
    userId: string;
}

export interface UpdateQuestionNoteParams {
    questionId: string;
    note: string;
    userId: string;
}
