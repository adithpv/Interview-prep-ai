import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConceptCache extends Document {
    question: string;
    questionHash: string;
    explanation: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ConceptCacheSchema: Schema<IConceptCache> = new Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        questionHash: {
            type: String,
            required: true,
            unique: true,
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

// Add a TTL index to expire cache after 7 days (604800 seconds)
ConceptCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export const ConceptCache: Model<IConceptCache> =
    mongoose.models.ConceptCache ||
    mongoose.model<IConceptCache>("ConceptCache", ConceptCacheSchema);
