import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    profileImageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    _id: Types.ObjectId;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        profileImageUrl: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
