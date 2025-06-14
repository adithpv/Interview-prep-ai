import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export type QuestionAnswersPromptParams = {
  role: string;
  experience: number;
  topicsToFocus: string;
  numberOfQuestions: number;
};

export type GeneratedQAItem = {
  question: string;
  answer: string;
};
