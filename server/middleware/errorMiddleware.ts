import { Request, Response, NextFunction } from 'express';

//ERROR MIDDLEWARE | NEXT FUNCTION
const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const defaultError = {
        statusCode: 404,
        success: "failed",
        message: err,
    };
    if (err?.name === "ValidationError") {
        defaultError.statusCode = 404;
        defaultError.message = Object.values(err.errors).map((el: any) => el.message).join(", ");
    } 
    //duplicate error
    if (err.code && err.code === 11000) {
        defaultError.statusCode = 404;
        defaultError.message = `${Object.values(err.keyValue)} field has to be unique`;
    }  
    res.status(defaultError.statusCode).json({
        success: defaultError.success,
        message: defaultError.message,
    });
};

export default errorMiddleware;
