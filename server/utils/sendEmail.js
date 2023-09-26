import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {v4 as uuidv4} from 'uuid';
import { Verification } from '../models/emailVerification.js';
import { hashString } from './index.js';

dotenv.config();
const { SMPT_HOST, SMPT_PORT, SMPT_MAIL, SMPT_PASSWORD,  APP_URL} = process.env;

var transporter = nodemailer.createTransport({
    host: SMPT_HOST,
    port: SMPT_PORT,
    auth: {
        user: SMPT_MAIL,//sender email
        pass: SMPT_PASSWORD,//sender password
    }
});

export const sendVerificationEmail = async (user, res) => {
  
    const {_id, email, lastName} = user;
    const token = _id + uuidv4();

    const link = `${APP_URL}/users/verify/${token}`;
    //mail options
    const mailOptions = {
        from: SMPT_MAIL,
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
            transporter.sendMail(mailOptions).then(() => {
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