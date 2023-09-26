import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const hashString = async (userValue) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(userValue, salt);
};

export const compareString = async (userPassword, password) => {
    return await bcrypt.compare(userPassword, password);
};

//json web token
export const createJWT = (id) => {
    return JWT.sign({userId: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}