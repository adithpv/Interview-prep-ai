import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISession extends Document {
    user: Types.ObjectId;
    role: string;
    experience: string;
    topicsToFocus: string;
    description?: string;
    questions: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const SessionSchema: Schema<ISession> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        experience: {
            type: String,
            required: true,
            trim: true,
        },
        topicsToFocus: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Session: Model<ISession> =
    mongoose.models.Session ||
    mongoose.model<ISession>("Session", SessionSchema);
