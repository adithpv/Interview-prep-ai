import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuestion extends Document {
    session: Types.ObjectId;
    user: Types.ObjectId;
    question: string;
    answer: string;
    note?: string;
    isPinned: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const QuestionSchema: Schema<IQuestion> = new Schema(
    {
        session: {
            type: Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            default: "",
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Question: Model<IQuestion> =
    mongoose.models.Question ||
    mongoose.model<IQuestion>("Question", QuestionSchema);
