import express from 'express';
import userAuth from '../middleware/authMiddleware.js';
import { commentPost, createPost, deletePost, getComments, getPost, getPosts, getUserPost, likePost, likePostComment, replyPostComment } from '../controllers/postController.js';
const router = express.Router();

//create post
router.post('/create-post', userAuth, createPost);
//get all posts
router.post('/', userAuth, getPosts);
//get post by id
router.post('/:id', userAuth, getPost);

router.post("/get-user-post/:id", userAuth, getUserPost);

//get comments
router.get("/comments/:postId", userAuth, getComments);

//like and comments on posts
router.post("/like/:id", userAuth, likePost);
router.post("/like-comment/:id/:rid?", userAuth, likePostComment);//like comment or comment reply

//comment on post
router.post("/comment/:id", userAuth, commentPost);
router.post("/reply-comment/:id", userAuth, replyPostComment);

//delete post 
router.delete("/:id", deletePost);
export default router;