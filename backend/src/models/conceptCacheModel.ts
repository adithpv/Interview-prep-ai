import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConceptCache extends Document {
    question: string;
    explanation: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ConceptCacheSchema: Schema<IConceptCache> = new Schema(
    {
        question: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        explanation: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index question for fast exact matches
ConceptCacheSchema.index({ question: 1 });

export const ConceptCache: Model<IConceptCache> =
    mongoose.models.ConceptCache ||
    mongoose.model<IConceptCache>("ConceptCache", ConceptCacheSchema);
