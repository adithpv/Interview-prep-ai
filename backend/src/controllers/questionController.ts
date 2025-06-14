import { Request, Response } from "express";
import { Question } from "../models/questionModel";
import { Session } from "../models/sessionModel";
import { catchAsync } from "../utils/catchAsync";
import { HttpStatus } from "../utils/httpStatus";
import {
  assertFieldsExist,
  assertNotFound,
  assertAuth,
  assertArray,
} from "../utils/appAssert";
import { AuthenticatedRequest } from "../types";

export const addQuestionsToSession = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { sessionId, questions } = req.body;
    const userId = req.user._id;

    assertFieldsExist({ sessionId, questions });
    assertArray(questions, "Questions");

    const session = await Session.findById(sessionId);
    assertNotFound(session, "Session");

    assertAuth(
      session.user.toString() === userId.toString(),
      "Not authorized to add questions to this session"
    );

    const createdQuestions = await Question.insertMany(
      questions.map((q: any) => ({
        question: q.question,
        session: sessionId,
        answer: q.answer,
        user: userId,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(HttpStatus.CREATED).json({
      message: `${createdQuestions.length} questions added`,
      questions: createdQuestions,
    });
  }
);

export const togglePinQuestion = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const questionId = req.params.id;
    const userId = req.user._id;
    assertFieldsExist({ questionId });

    const question = await Question.findById(questionId);
    assertNotFound(question, "Question");

    assertAuth(
      question.user.toString() === userId.toString(),
      "Not authorized to update this question"
    );

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(HttpStatus.OK).json({
      message: `Question ${question.isPinned ? "pinned" : "unpinned"} successfully`,
      question,
    });
  }
);

export const updateQuestionNote = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const questionId = req.params.id;
    const { note } = req.body;
    const userId = req.user._id;

    assertFieldsExist({ questionId, note });

    const question = await Question.findById(questionId);
    assertNotFound(question, "Question");

    assertAuth(
      question.user.toString() === userId.toString(),
      "Not authorized to update this question"
    );

    question.note = note || "";
    await question.save();

    res.status(HttpStatus.OK).json({
      message: "Note updated successfully",
      question,
    });
  }
);
