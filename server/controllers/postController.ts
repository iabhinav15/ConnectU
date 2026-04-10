import { Request, Response, NextFunction } from 'express';
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { description, image } = req.body;

        const post = await Post.create({ description, image, userId });

        res.status(200).json({
            success: true,
            message: "Post created successfully",
            data: post
        });

    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//get posts
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { search } = req.body;

        const user = await User.findById(userId);
        const friends = user?.friends?.toString().split(",") ?? [];
        friends.push(userId);
        
        const searchPostQuery = {
            $or: [
                {
                    description: { $regex: search, $options: "i" },
                },
            ],
        };
        const posts = await Post.find(search ? searchPostQuery : {})
            .populate({
                    path: "userId",
                    select: "firstName lastName location profileUrl",
            })
            .sort({ _id: -1 });

        const friendsPosts = posts?.filter((post: any) => { return friends.includes(post?.userId?._id.toString()) });

        const otherPosts = posts?.filter((post: any) => { return !friends.includes(post?.userId?._id.toString()) });

        let postsRes = null;

        if (friendsPosts?.length > 0) {
            postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
        } else {
            postsRes = posts;
        }
        
        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: postsRes
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//get post by id
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
            .populate({
                path: "userId",
                select: "firstName lastName location profileUrl",
            });

        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//get user post
export const getUserPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const post = await Post.find({ userId: id })
            .populate({
                path: "userId",
                select: "firstName lastName location profileUrl",
            })
            .sort({ _id: -1 });
        
        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//get comments
export const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.params;

        const postComments = await Comment.find({ postId })
            .populate({
                path: "userId",
                select: "firstName lastName location profileUrl",
            })
            .populate({
                path: "replies.userId",
                select: "firstName lastName location profileUrl",
            })
            .sort({ _id: -1 });
        
        res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: postComments
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//like post
export const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) throw new Error("Post not found");

        const index = post.likes.findIndex((pid) => pid === String(userId));

        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter((pid) => pid !== String(userId));
        }

        const newPost = await Post.findByIdAndUpdate(id, post, { new: true });

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            data: newPost
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//like post comment
export const likePostComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { id, rid } = req.params; 

        if (rid === undefined || rid === null || rid === "false") {
            const comment = await Comment.findById(id);
            if (!comment) throw new Error("Comment not found");

            const index = comment.likes.findIndex((el) => el === String(userId));

            if (index === -1) {
                comment.likes.push(userId);
            } else {
                comment.likes = comment.likes.filter((i) => i !== String(userId));
            }
            const updated = await Comment.findByIdAndUpdate(id, comment, { new: true });

            res.status(201).json(updated);
        } else {
            const replyComments = await Comment.findOne({ _id: id }, {
                replies: { $elemMatch: { _id: rid } }
            });
            if (!replyComments || !replyComments.replies || replyComments.replies.length === 0) throw new Error("Reply not found");

            const index = replyComments.replies[0].likes.findIndex((i) => i === String(userId));

            if (index === -1) {
                replyComments.replies[0].likes.push(userId);
            } else {
                replyComments.replies[0].likes = replyComments.replies[0].likes.filter((i) => i !== String(userId));
            }

            const query = {
                _id: id,
                "replies._id": rid,
            };
            const updated = {
                $set: {
                    "replies.$.likes": replyComments.replies[0].likes,
                },
            };
            const result = await Comment.updateOne(query, updated, { new: true });

            res.status(201).json(result);
        }
       
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//comment on post
export const commentPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.params;
        const { comment, from } = req.body;
        if (comment == null) {
            return res.status(404).json({
                message: "Comment is required."
            });
        }
        const newComment = await Comment.create({ postId: id, userId, comment, from });

        //updating the post with comment id
        const post = await Post.findById(id);
        if(!post) throw new Error("Post not found");
        
        post.comments.push(newComment._id);
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

        res.status(201).json({
            success: true,
            message: "Commented successfully",
            data: newComment
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//reply to post comment
export const replyPostComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { comment, replyAt, from } = req.body;
        const { id } = req.params;

        if (comment == null) {
            return res.status(404).json({
                message: "Comment is required."
            });
        }

        const commentInfo = await Comment.findById(id);
        if(!commentInfo) throw new Error("Comment not found");

        commentInfo.replies.push({
            comment,
            replyAt,
            from,
            userId,
            likes: [],
        });
        await commentInfo.save();
        res.status(201).json({
            success: true,
            message: "Replied successfully",
            data: commentInfo
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//delete post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (error: any) {
        console.log(error);
        res.status(404).json({
            message: error.message
        });
    }
};
