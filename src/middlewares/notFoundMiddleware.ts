import {NextFunction, Request, Response} from 'express';
import {GeneralError} from "./errorMiddleware";

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    throw new GeneralError(
        null,
        `Endpoint '${req.method} ${req.url}' doesn't exists, please check documentation`,
        404,
        "NOT_FOUND"
    );
};

