import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {v4 as uuidv4} from 'uuid';
import { Verification } from '../models/emailVerification.js';
import { hashString } from './index.js';
import { PasswordReset } from '../models/PasswordReset.js';
import {google} from 'googleapis'

const OAuth2 = google.auth.OAuth2

dotenv.config();
const { EMAIL, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, APP_URL } = process.env;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token :(");
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL,
            accessToken,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
        },
    });
    return transporter;
}

const sendEmail = async (emailOptions) => {
    const transporter = await createTransporter();
    await transporter.sendMail(emailOptions);
}

export const sendVerificationEmail = async (user, res) => {
  
    const {_id, email, lastName} = user;
    const token = _id + uuidv4();

    const link = `${APP_URL}/users/verify/${_id}/${token}`;
    //mail options
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `<p>Hi ${user.lastName},</p>
        <p>Thanks for registering on our website.</p>
        <p>Please click on the link below to verify your email address:</p>
        <p><a href="${link}">Verify</a></p>
        <p>The link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,</p>
        <p>ConnectU</p>`
    };

    try {
        const hashedToken = await hashString(token);
        const newVerifiedEmail = await Verification.create({ 
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        if(newVerifiedEmail) {
            sendEmail(mailOptions).then(() => {
                res.status(201).send({
                    success: "Pending",
                    message: `A verification email has been sent to ${email}.`,
                });
            }).catch((error) => {
                res.status(404).json({ message: "something went wrong" });
            });
        }
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
};

export const resetPasswordLink = async (user, res) => {
    const {_id, email, lastName} = user;
    const token = _id + uuidv4();
    const link = 'http://localhost:3000' + "/reset-password/" + _id + "/" + token;

    //mail options
    const mailOptions = {
        from: SMPT_MAIL,
        to: email,
        subject: 'Paaword Reset Link',
        html: `<p style="font-family: Arial, sans-sarif; font-size: 16px; color: #333;">Hi ${lastName},</p>
        <p>Please click on the link below to reset your password:</p>
        <p><a href="${link}">Reset Password</a></p>
        <p>The link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,</p>
        <p>ConnectU</p>`
    };
    try {
        const hashedToken = await hashString(token);
        const resetEmail = await PasswordReset.create({ 
            userId: _id,
            email: email,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000,
        });
        if(resetEmail) {
            transporter.sendMail(mailOptions).then(() => {
                res.status(201).send({
                    success: "Pending",
                    message: `A password reset link has been sent to ${email}.`,
                });
            }).catch((err) => {
                console.log(err)
                res.status(404).json({ message: "something went wrong" });
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "something went wrong" });
    }
};