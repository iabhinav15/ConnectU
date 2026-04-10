import mongoose, { Document, Schema, Model } from "mongoose";

export interface Reply {
    rid?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    from?: string;
    replyAt?: string;
    comment?: string;
    Created_At?: Date;
    updated_At?: Date;
    likes: string[];
}

export interface Comment extends Document {
    userId?: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId;
    comment: string;
    from: string;
    replies: Reply[];
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<Comment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    comment: {
        type: String,
        required: [true, 'Please enter your comment'],
    },
    from: {
        type: String,
        required: true
    },
    replies: [{
        rid: { type: Schema.Types.ObjectId },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        from: { type: String },
        replyAt: { type: String },
        comment: { type: String },
        Created_At: { type: Date, default: Date.now },
        updated_At: { type: Date, default: Date.now },
        likes: [{ type: String }],
    }],
    likes: [{ type: String }],
}, { timestamps: true });

export const CommentModel: Model<Comment> = mongoose.model<Comment>('Comment', commentSchema);
export { CommentModel as Comment };
