import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export const hashString = async (userValue: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(userValue, salt);
};

export const compareString = async (userPassword: string, password?: string) => {
    if(!password) return false;
    return await bcrypt.compare(userPassword, password);
};

//json web token
export const createJWT = (id: any) => {
    return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
    });
}
