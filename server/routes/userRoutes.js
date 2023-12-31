import express from 'express';
import path from 'path';
import { acceptRequest, changePassword, friendRequest, getFriendRequest, getUser, profileViews, removeFriend, removeSentRequest, requestPasswordReset, resetPassword, suggestedFriends, updateUser, verifyEmail } from '../controllers/userController.js';
import userAuth from '../middleware/authMiddleware.js';
const router = express.Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/verify/:userId/:token', verifyEmail);
//PASSWORD RESET
router.post('/request-passwordreset', requestPasswordReset);
router.get('/reset-password/:userId/:token', resetPassword);
router.post('/reset-password', changePassword);

//user routes
router.post("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

//friend requests routes
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);

//accept friend request or deny friend request
router.post("/accept-request", userAuth, acceptRequest);
router.post("/remove-friend", userAuth, removeFriend);

//remove sent friend request
router.post("/remove-sentrequest", userAuth, removeSentRequest);

//view profile
router.post("/profile-view", userAuth, profileViews);

//suggest friends
router.post("/suggested-friends", userAuth, suggestedFriends);

router.get('/verified', (req, res)=>{
    res.sendFile(path.join(__dirname, './views/build', 'index.html'));
})


export default router;