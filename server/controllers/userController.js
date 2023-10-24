import mongoose from 'mongoose';
import { Verification } from '../models/emailVerification.js'
import {User} from '../models/userModel.js';
import { compareString, createJWT, hashString } from '../utils/index.js';
import { PasswordReset } from '../models/PasswordReset.js';
import { resetPasswordLink } from '../utils/sendEmail.js';
import { FriendRequest } from '../models/friendRequest.js';

export const verifyEmail = async (req, res) => {
    const {userId, token} = req.params;
    try {
        const result = await Verification.findOne({userId});
        if (result) {
            const {token: hashedToken, expiresAt} = result;
            if(expiresAt < Date.now()) {
                Verification.findOneAndDelete({userId})
                .then(() => {
                    User.findOneAndDelete({_id: userId})
                    .then(() => {
                        const message = "Verification Token has expired.";
                        res.redirect(`/users/verified?status=error&message=${message}`);
                    })
                    .catch((err) => {
                        res.redirect(`/users/verified?status=error&message=`);
                    })
                })
                .catch((error)=>{
                    console.log(error);
                    res.redirect(`/users/verified?message=`);
                })
            } 
            else{ 
                compareString(token, hashedToken)
                .then((isMatch)=>{
                    if(isMatch){
                        User.findOneAndUpdate({_id: userId}, {verified: true})
                        .then(() => {
                            Verification.findOneAndDelete({userId})
                            .then(() => {
                                const message = "Your account has been verified successfully.";
                                res.redirect(`/users/verified?status=success&message=${message}`); 
                            })
                        }) 
                        .catch((error) => {
                            console.log(error);
                            const message = "Verification failed or link expired. Please try again.";
                            res.redirect(`/users/verified?status=error&message=${message}`)
                        })
                    }else{
                        //invalid token 
                        const message = "Verification failed or link expired. Please try again.";
                        res.redirect(`/users/verified?status=error&message=${message}`)
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect(`/users/verified?message=`)
                })
            }
        }else{
            const message = "Invalid verification link. Please try again later.";
            res.redirect(`/users/verified?status=error&message=${message}`)
        }
    }catch (error) {
        console.log(error.message);
        res.redirect(`/users/verified?message=`)
    }
}

export const requestPasswordReset = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                status: "FAILED",
                message: "Email address not found."
            })
        }
        const existingRequest = await PasswordReset.findOne({email});
        if(existingRequest){
            if(existingRequest.expiresAt > Date.now()){
                return res.status(201).json({
                    status: "PENDING",
                    message: "Password reset link already sent. Please check your email."
                }) 
            } 
            await PasswordReset.findOneAndDelete({email});
        }
        await resetPasswordLink(user, res);
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
    }
};

export const resetPassword = async (req, res) => {
    const {userId, token} = req.params;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                status: "FAILED",
                message: "Invalid password reset link. Please try again."
            })
        }
        const resetPassword = await PasswordReset.findOne({userId});
        if(!resetPassword){
            return res.status(404).json({
                status: "FAILED",
                message: "Invalid password reset link. Please try again."
            })
        }
        const {expiresAt, token: resetToken} = resetPassword;

        if(expiresAt < Date.now()){
            await PasswordReset.findOneAndDelete({userId});
            return res.status(404).json({
                status: "FAILED",
                message: "Invalid password reset link. Please try again."
            })
        }
        else{
            const isMatch = await compareString(token, resetToken);
            if(!isMatch){
                return res.status(404).json({
                    status: "FAILED",
                    message: "Invalid password reset link. Please try again."
                })
            }
            else{
                res.status(201).json({
                    status: "SUCCESS",
                    message: "Password reset link verified. Please enter your new password."
                })
            }
        }
    }catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
    }
};

export const changePassword = async (req, res) => {
    try {
        const {userId, password} = req.body;
        const hashedpassword = await hashString(password);
        const user = await User.findByIdAndUpdate({_id:userId}, {password: hashedpassword});

        if(user){
           await PasswordReset.findOneAndDelete({userId});
            res.status(201).json({
                status: "SUCCESS",
                message: "Password reset successful. Please login with your new password."
            })
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
    }
}

export const getUser = async (req, res, next) => {
    try {
        const {userId} = req.body.user;
        const {id} = req.params;
        const user = await User.findById(id ?? userId).populate({
            path: "friends",
            select: "-password"
        });
        if(!user){
            return res.status(404).send({
                message: "User Not Found.",
                success: false
            })
        }
        user.password = undefined;
        res.status(200).json({
            success: true,
            user: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        })
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const {firstName, lastName, location,    profileUrl, profession} = req.body;
        if(!firstName || !lastName || !location || !profession){
            next("Please Provide all required fields");
            return;
        }
        const {userId} = req.body.user;
        const updateUser = {
            firstName,
            lastName,
            location,
            profileUrl,
            profession,
            _id: userId
        }
        const user = await User.findByIdAndUpdate(userId, updateUser, {new: true});

        await user.populate({ path: "friends", select: "-password" });
        const token = createJWT(user?._id);

        user.password = undefined;

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({  
            error: error.message
        })
    }
};

export const friendRequest = async (req, res, next) => {
    try {
        const {userId} = req.body.user;
        const { requestTo } = req.body;
        
        const requestExist = await FriendRequest.findOne({
            requestFrom: userId,
            requestTo,
        })
        if(requestExist){
            next("Friend Request already sent");
            return;
        }
        const accountExist = await FriendRequest.findOne({
            requestFrom: requestTo,
            requestTo: userId
        })
        if(accountExist){
            next("Friend Request already sent");
            return;
        }
        //new request
        const newRes = await FriendRequest.create({
            requestTo,
            requestFrom: userId,
        })
        res.status(201).json({
            success: true,
            message: "Friend Request sent successfully.",
            
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message

        })
    }
};

export const getFriendRequest = async (req, res) => {
    try {
        const {userId} = req.body.user;
        const request = await FriendRequest.find({
            requestTo: userId,
            requestStatus: "pending"
        }).populate({
            path: "requestFrom",
            select: "firstName lastName profileUrl profession"
        })
        .limit(10).sort({
            _id: -1
        })
        console.log(userId);
        console.log(request);

        res.status(200).json({
            success: true,
            data: request
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        })
    }
};

export const acceptRequest = async (req, res, next) => {
    try {
        const id = req.body.user.userId;        
        const { rid, status } = req.body;//rid = request id
        const requestExist = await FriendRequest.findById(rid);

        if(!requestExist){
            next("NO Friend Request found");
            return;
        }
        const newRes = await FriendRequest.findByIdAndUpdate({_id: rid}, {requestStatus: status}, {new: true});
        
        let user;
        if(status === "Accepted"){
            user = await User.findById(id);
            user.friends.push(newRes?.requestFrom);
            await user.save();
            const friend = await User.findById(newRes?.requestFrom);
            friend.friends.push(newRes?.requestTo)
            await friend.save();
        }
        const pendingRequests = await FriendRequest.find({
            requestTo: id,
            requestStatus: "pending"
        }).populate({
            path: "requestFrom",
            select: "firstName lastName profileUrl profession"
        })
        .limit(10).sort({
            _id: -1
        })

        res.status(201).json({
            success: true,
            message: "Friend Request " + status,
            data: pendingRequests,
            friend: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        })
    }
};

export const removeFriend = async (req, res)=>{
    try {
        const {userId} = req.body.user;
        const {id} = req.body;
        const user = await User.findById(userId);
        const friend = await User.findById(id);
        user.friends.pull(id);
        friend.friends.pull(userId);
        await user.save();
        await friend.save();
        await FriendRequest.findOneAndDelete({requestFrom:id,requestTo:userId});
        await FriendRequest.findOneAndDelete({requestFrom:userId,requestTo:id})
        res.status(201).json({
            success: true,
            message: "Friend removed successfully.",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        })
    }
}

export const profileViews = async (req, res, next) => {
    try {
        const {userId} = req.body.user;
        const {id} = req.body;
        const user = await User.findById(id);
        user.views.push(userId);
        await user.save();

        res.status(201).json({
            success: true,
            message: "successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        })
    }
};

export const suggestedFriends = async (req, res) => {
    try {
        const {userId} = req.body.user;
        let queryObject = {};
        queryObject._id = { $ne: userId };
        queryObject.friends = {$nin: userId};
        let queryResult = User.find(queryObject).limit(15).select("firstName lastName profileUrl profession");

        const suggestedFriends = await queryResult;

        res.status(200).json( {
            success: true,
            data: suggestedFriends
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message
        })
    }
};