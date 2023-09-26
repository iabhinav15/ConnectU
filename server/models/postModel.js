import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users" 
    },  
    description: {
        type: String,
        required: [true, 'Please enter your description'],
    },
    image: {
        type: String,
    },
    likes: [{type: String} ],
    comments: [{type: Schema.Types.ObjectId, ref:"Comments"}],
    },
    { timestamps: true }
);
  
export const Post = mongoose.model('Post',postSchema);