import mongoose, {Schema} from "mongoose";

const commentSchema = new mongoose.Schema({
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
    replies: [
        {
           rid: {
                type: Schema.Types.ObjectId,
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            from: {
                type: String,
            },
            replyAt: {
                type: String,
            },
            comment: {
                type: String,
            },
            Created_At: {
                type: Date,
                default: Date.now
            },
            updated_At: {
                type: Date,
                default: Date.now
            },
            likes: [{type: String} ],
        }
    ],
    likes: [{type: String} ],
},
{ timestamps: true }
)

export const Comment = mongoose.model('Comment',commentSchema);