import mongoose from 'mongoose';
import { Verification } from '../models/emailVerification.js'
import {User} from '../models/userModel.js';
import { compareString, hashString } from '../utils/index.js';
import { PasswordReset } from '../models/PasswordReset.js';
import { resetPasswordLink } from '../utils/sendEmail.js';

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
        const user = await User.findById(userId);//error may be
        if(!user){
            const message = "Invalid password reset link. Please try again.";
            return res.redirect(`/users/resetpassword?status=error&message=${message}`)
        }
        const resetPassword = await PasswordReset.findOne({userId});
        if(!resetPassword){
            const message = "Invalid password reset link. Please try again";
            return res.redirect(`/users/resetpassword?status=error&message=${message}`);
        }
        const {expiresAt, token: resetToken} = resetPassword;

        if(expiresAt < Date.now()){
            const message = "Reset password link has expired. Please try again."
            res.redirect(`/users/verified?status=error&message=${message}`);
        }
        else{
            const isMatch = await compareString(token, resetToken);
            if(!isMatch){
                const message = "Invalid reset password link. Please try again.";
                res.redirect(`/users/resetpassword?status=error&message=${message}`)
            }
            else{
                res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
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
           const message = "Password reset successful. Please login with your new password.";
           res.redirect(`/users/resetpassword?status=success&message=${message}`);
           return;
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
    }
}