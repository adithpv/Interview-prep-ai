import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserSession extends Document {
    user: Types.ObjectId;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSessionSchema: Schema<IUserSession> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        refreshTokenHash: {
            type: String,
            required: true,
        },
        userAgent: String,
        ipAddress: String,
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

UserSessionSchema.index({ user: 1 });
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const UserSession: Model<IUserSession> =
    mongoose.models.UserSession || mongoose.model<IUserSession>("UserSession", UserSessionSchema);
