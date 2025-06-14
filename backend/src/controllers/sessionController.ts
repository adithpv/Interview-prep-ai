import { Request, Response } from "express";
import { HttpStatus } from "../utils/httpStatus";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../types";
import { assertAuth, assertFieldsExist } from "../utils/appAssert";
import { Session } from "../models/sessionModel";
import { Question } from "../models/questionModel";
import { assertNotFound } from "../utils/appAssert";

export const createSession = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { role, experience, topicsToFocus, description, questions } =
      req.body;
    const userId = req.user._id;
    assertFieldsExist({ userId });

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q: any) => {
        return await Question.create({
          user: userId,
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
      })
    );

    session.questions = questionDocs.map((q) => q._id);
    await session.save();

    res.status(HttpStatus.CREATED).json({
      success: true,
      session,
    });
  }
);

export const getMySessions = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    assertFieldsExist({ userId });

    const sessions = await Session.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(HttpStatus.OK).json(sessions);
  }
);

export const getSessionById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const sessionId = req.params.id;
    assertFieldsExist({ sessionId });

    const session = await Session.findById(sessionId)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: -1 } },
      })
      .exec();

    assertNotFound(!!session, "Session");

    res.status(HttpStatus.OK).json({
      success: true,
      session,
    });
  }
);

export const deleteSession = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const sessionId = req.params.id;
    console.log("🚀 ~ sessionId:", sessionId);
    const userId = req.user._id;
    console.log("🚀 ~ userId:", userId);

    assertFieldsExist({ sessionId });

    const session = await Session.findById(sessionId);
    assertNotFound(session, "Session");

    assertAuth(
      session.user.toString() === userId.toString(),
      "Not authorized to delete this session"
    );

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    res.status(HttpStatus.OK).json({
      message: `Session deleted successfully`,
    });
  }
);
