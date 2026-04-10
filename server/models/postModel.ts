import mongoose, { Document, Schema, Model } from "mongoose";

export interface Post extends Document {
    userId: mongoose.Types.ObjectId;
    description?: string;
    image?: string;
    likes: string[];
    comments: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<Post>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User" 
    },  
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

export const PostModel: Model<Post> = mongoose.model<Post>('Post', postSchema);
export { PostModel as Post };
