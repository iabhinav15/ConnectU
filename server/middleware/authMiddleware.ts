import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req?.headers?.authorization;
    if (!authHeader || !authHeader?.startsWith('Bearer')) {
        next("Authentication == failed");
        return;
    }

    const token = authHeader?.split(" ")[1];

    try {
        const userToken: any = JWT.verify(token, process.env.JWT_SECRET_KEY as string);
        req.body.user = {
            userId: userToken.userId,
        };
        next();
    } catch (error) {
        console.log(error);
        next("Authentication failed");
    }
}

export default userAuth;
