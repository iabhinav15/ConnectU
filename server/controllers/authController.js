import {User} from '../models/userModel.js';
import { createJWT, hashString } from '../utils/index.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';
import { compareString } from '../utils/index.js';

//register user
export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

     if(!firstName || !lastName || !email || !password) {
        return next("Please provide all required fields");
    }

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return next("User already exists");
        }

        const hashedPassword = await hashString(password);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        //send verification email to user
        sendVerificationEmail(user, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//login user
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return next("Please provide user credentials");
        }
        const user = await User.findOne({ email }).select("+password").populate({
            path: "friends",
            select: "firstName lastName location profileUrl",
        });
        if (!user) {
            return next("Invalid credentials1");
        }
        //check if user email is verified
        if (!user?.verified) {
            return next("User email is not verified. Check your email for verification link");
        }
        //check if password is correct
        const isMatch = await compareString(password, user?.password);

        if (!isMatch) {
            return next("Invalid credentials");
        }
        user.password = undefined;
        //create token
        const token = createJWT(user?._id);
        res.status(201).json({ 
            success: true,
            message: "User logged in successfully",
            user,
            token 
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
     