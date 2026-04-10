import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel.js';
import { createJWT, hashString, compareString } from '../utils/index.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// register user
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return next("Please provide all required fields");
        }

        const userExist = await User.findOne({ email });

        if (userExist && userExist.verified) {
            return next("User already exists");
        }
        else if (userExist && !userExist.verified) {
            await User.deleteOne({ email });
        }

        const hashedPassword = await hashString(password);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // send verification email to user
        sendVerificationEmail(user, res);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return next("Please provide user credentials");
        }

        const user = await User.findOne({ email }).select("+password").populate({
            path: "friends",
            select: "firstName lastName location profileUrl",
        });

        if (!user) {
            return next("Invalid credentials");
        }

        // check if user email is verified
        if (!user.verified) {
            return next("User email is not verified. Check your email for verification link");
        }

        // check if password is correct - Type guard
        if (!user.password) {
            return next("Invalid credentials");
        }

        const isMatch = await compareString(password, user.password);

        if (!isMatch) {
            return next("Invalid credentials");
        }

        user.password = undefined;

        // create token
        const token = createJWT(user._id);

        res.status(201).json({ 
            success: true,
            message: "User logged in successfully",
            user,
            token 
        });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

// register with google
export const googleDataHandler = async (req: Request, res: Response) => {
    try {
        const { googleUser } = req.body;

        // check if user exists
        const user = await User.findOne({ email: googleUser.email }).populate({
            path: "friends",
            select: "firstName lastName location profileUrl",
        });

        if (user) {
            // if user exists
            // check if user email is verified
            if (!user.verified) {
                user.verified = googleUser.verified_email;
            }
            const token = createJWT(user._id);
            return res.status(200).json({ 
                success: true,
                message: "User logged in successfully",
                user,
                token 
            });
        } else {
            // if user does not exist
            // hash password
            const hashedPassword = await hashString(googleUser.id);
            // create user
            console.log(googleUser, 'googleUser');
            const newUser = await User.create({
                firstName: googleUser.given_name,
                lastName: googleUser.family_name,
                email: googleUser.email,
                password: hashedPassword,
                profileUrl: googleUser.picture,
                verified: googleUser.verified_email,
            });

            const token = createJWT(newUser._id);
            return res.status(201).json({ 
                success: true,
                message: "User registration successful",
                user: newUser,
                token 
            });
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message, success: false });
    }
};
