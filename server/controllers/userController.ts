import { Request, Response, NextFunction } from 'express';
import { Verification } from '../models/emailVerification.js';
import { User } from '../models/userModel.js';
import { compareString, createJWT, hashString } from '../utils/index.js';
import { PasswordReset } from '../models/PasswordReset.js';
import { resetPasswordLink } from '../utils/sendEmail.js';
import { FriendRequest } from '../models/friendRequest.js';

export const verifyEmail = async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    try {
        const result = await Verification.findOne({ userId });
        if (result) {
            const { token: hashedToken, expiresAt } = result;
            if (expiresAt && expiresAt.getTime() < Date.now()) {
                Verification.findOneAndDelete({ userId })
                .then(() => {
                    User.findOneAndDelete({ _id: userId })
                    .then(() => {
                        const message = "Verification Token has expired.";
                        res.status(401).json({
                            success: false,
                            message
                        });
                    })
                    .catch((err: any) => {
                        res.status(401).json({
                            success: false,
                            message: err.message
                        });
                    });
                })
                .catch((error: any)=>{
                    console.log(error);
                    res.status(401).json({
                        success: false,
                        message: error.message
                    });
                });
            } 
            else { 
                compareString(token as string, hashedToken as string)
                .then((isMatch)=>{
                    if (isMatch) {
                        User.findOneAndUpdate({ _id: userId }, { verified: true })
                        .then(() => {
                            Verification.findOneAndDelete({ userId })
                            .then(() => {
                                const message = "Your account has been verified successfully.";
                                res.status(200).json({
                                    success: true,
                                    message
                                });
                            });
                        }) 
                        .catch((error: any) => {
                            console.log(error);
                            const message = "Verification failed or link expired. Please try again.";
                            res.status(401).json({
                                success: false,
                                message: error.message
                            });
                        });
                    } else {
                        const message = "Verification failed or link expired. Please try again.";
                        res.status(401).json({
                            success: false,
                            message
                        });
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                    res.status(401).json({
                        success: false,
                        message: err.message
                    });
                });
            }
        } else {
            const message = "Invalid verification link. Please try again later.";
            res.status(401).json({
                success: false,
                message
            });
        }
    } catch (error: any) {
        console.log(error.message);
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
}

export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Email address not found."
            });
        }
        const existingRequest = await PasswordReset.findOne({ email });
        if (existingRequest) {
            if (existingRequest.expiresAt && existingRequest.expiresAt.getTime() > Date.now()) {
                return res.status(201).json({
                    status: "PENDING",
                    message: "Password reset link already sent. Please check your email."
                });
            } 
            await PasswordReset.findOneAndDelete({ email });
        }
        await resetPasswordLink(user, res);
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ status: false, message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "Invalid password reset link. Please try again."
            });
        }
        const resetPassword = await PasswordReset.findOne({ userId });
        if (!resetPassword) {
            return res.status(404).json({
                status: "failed",
                message: "Invalid password reset link. Please try again."
            });
        }
        const { expiresAt, token: resetToken } = resetPassword;

        if (expiresAt && expiresAt.getTime() < Date.now()) {
            await PasswordReset.findOneAndDelete({ userId });
            return res.status(404).json({
                status: "failed",
                message: "Invalid password reset link. Please try again."
            });
        }
        else {
            const isMatch = await compareString(token as string, resetToken as string);
            if (!isMatch) {
                return res.status(404).json({
                    status: "failed",
                    message: "Invalid password reset link. Please try again."
                });
            }
            else {
                res.status(201).json({
                    status: "SUCCESS",
                    message: "Password reset link verified. Please enter your new password."
                });
            }
        }
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ status: "failed", message: error.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { userId, password } = req.body;
        const hashedpassword = await hashString(password);
        const user = await User.findByIdAndUpdate({ _id: userId }, { password: hashedpassword });

        if (user) {
            await PasswordReset.findOneAndDelete({ userId });
            res.status(201).json({
                status: "SUCCESS",
                message: "Password reset successful. Login with your new password."
            });
        }
    } catch (error: any) {
        console.log(error);
        res.status(404).json({ status: "failed", message: error.message });
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.params;
        const user = await User.findById(id ?? userId).populate({
            path: "friends",
            select: "-password"
        });
        if (!user) {
            return res.status(404).send({
                message: "User Not Found.",
                success: false
            });
        }
        user.password = undefined;
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        });
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, location, profileUrl, profession } = req.body;
        if (!firstName || !lastName || !location || !profession) {
            next("Please Provide all required fields");
            return;
        }
        const { userId } = req.body.user;
        const updateUser = {
            firstName,
            lastName,
            location,
            profileUrl,
            profession,
            _id: userId
        }
        const user = await User.findByIdAndUpdate(userId, updateUser, { new: true });
        if(!user) throw new Error("User not found");

        await user.populate({ path: "friends", select: "-password" });
        const token = createJWT(user._id);

        user.password = undefined;

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user,
            token
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({  
            error: error.message
        });
    }
};

export const friendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { requestTo } = req.body;
        
        const requestExist = await FriendRequest.findOne({
            requestFrom: userId,
            requestTo: requestTo,
        });
        if (requestExist) {
            next("Friend Request already sent");
            return;
        }
        const accountExist = await FriendRequest.findOne({
            requestFrom: requestTo,
            requestTo: userId
        });
        if (accountExist) {
            next("Friend Request already sent");
            return;
        }
        //new request
        const newRes = await FriendRequest.create({
            requestTo: requestTo,
            requestFrom: userId,
        });
        res.status(201).json({
            success: true,
            message: "Friend Request sent successfully.",
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        });
    }
};

export const getFriendRequest = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body.user;
        const requestRec = await FriendRequest.find({
            requestTo: userId,
            requestStatus: "pending"
        }).populate({
            path: "requestFrom",
            select: "firstName lastName profileUrl profession"
        })
        .limit(10).sort({ _id: -1 });

        const requestSent = await FriendRequest.find({
            requestFrom: userId,
            requestStatus: "pending"
        }).populate({
            path: "requestTo",
            select: "firstName lastName profileUrl profession"
        })
        .limit(10).sort({ _id: -1 });

        res.status(200).json({
            success: true,
            dataRec: requestRec,
            dataSent: requestSent
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        });
    }
};

export const removeSentRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { rid } = req.body;
        await FriendRequest.findByIdAndDelete(rid);
        const pendingRequests = await FriendRequest.find({
            requestFrom: userId,
            requestStatus: "pending"
        }).populate({
            path: "requestTo",
            select: "firstName lastName profileUrl profession"
        });
        res.status(201).json({
            success: true,
            message: "Friend Request removed successfully.",
            data: pendingRequests
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        });
    }
};

export const acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.body.user.userId;        
        const { rid, status } = req.body; //rid = request id
        const requestExist = await FriendRequest.findById(rid);

        if (!requestExist) {
            next("NO Friend Request found");
            return;
        }
        const newRes = await FriendRequest.findByIdAndUpdate({ _id: rid }, { requestStatus: status }, { new: true });
        if(!newRes) throw new Error("Friend request update failed");

        let user, friend;
        if (status === "Accepted") {
            user = await User.findById(id);
            if(user && newRes.requestFrom) {
                user.friends.push(newRes.requestFrom);
                await user.save();
            }
            friend = await User.findById(newRes.requestFrom);
            if(friend && newRes.requestTo) {
                friend.friends.push(newRes.requestTo);
                await friend.save();
            }
        }
        else {
            await FriendRequest.findByIdAndDelete(rid);
        }
        const pendingRequests = await FriendRequest.find({
            requestTo: id,
            requestStatus: "pending"
        }).populate({
            path: "requestFrom",
            select: "firstName lastName profileUrl profession"
        })
        .limit(10).sort({ _id: -1 });

        res.status(201).json({
            success: true,
            message: "Friend Request " + status,
            data: pendingRequests,
            friend: friend
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        });
    }
};

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.body;
        const user = await User.findById(userId);
        const friend = await User.findById(id);
        
        if(user) {
            user.friends = user.friends.filter(f => f.toString() !== id);
            await user.save();
        }
        if(friend) {
            friend.friends = friend.friends.filter(f => f.toString() !== userId);
            await friend.save();
        }
        await FriendRequest.findOneAndDelete({ requestFrom: id, requestTo: userId });
        await FriendRequest.findOneAndDelete({ requestFrom: userId, requestTo: id });
        res.status(201).json({
            success: true,
            message: "Friend removed successfully.",
            removedFriend: friend
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        });
    }
}

export const profileViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.body;
        const user = await User.findById(id);
        if(user) {
            if (!(user.views.includes(userId))) {
                user.views.push(userId);
                await user.save();

                return res.status(201).json({
                    success: true,
                    message: "successfully",
                });
            }
        }
        return res.status(401).json({
            success: false,
            message: "failed",
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message
        });
    }
};

export const suggestedFriends = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body.user;
        let queryObject: any = {};
        queryObject._id = { $ne: userId };
        queryObject.friends = { $nin: userId };
        let queryResult = await User.find(queryObject).limit(15).select("firstName lastName profileUrl profession");

        const queryResult1 = await FriendRequest.find({ requestFrom: userId, requestStatus: "pending" });
        const queryResult2 = await FriendRequest.find({ requestTo: userId, requestStatus: "pending" });
        
        const suggestedFriends = queryResult.filter((item: any) => {
            return !queryResult1.some((item1: any) => item1.requestTo.toString() === item._id.toString()) && 
                   !queryResult2.some((item2: any) => item2.requestFrom.toString() === item._id.toString());
        });

        res.status(200).json({
            success: true,
            data: suggestedFriends
        });

    } catch (error: any) {
        console.log(error);
        res.status(404).json({
            message: error.message
        });
    }
};
