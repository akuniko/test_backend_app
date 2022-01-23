import {Request, Response} from 'express';
import config from '../config/config';

export const errorHandler = (
    err: TypeError,
    req: Request,
    res: Response,
) => {
    let customError = err;

    if (!(err instanceof GeneralError)) {
        console.error('Not handled error appeared', err);
        customError = new GeneralError(
            err,
            'Can not handle your request, unknown error happen',
            500
        );
    }

    const generalError = customError as GeneralError;
    const responseBody: any = {
        message: generalError.message,
        errorCode: generalError.errorCode,
        errors: generalError.errors
    };
    if (config.isDev && generalError.causeError) {
        responseBody.causeError = {
            name: generalError.causeError.name,
            message: generalError.causeError.message,
            stack: generalError.causeError.stack
        };
    }
    if (generalError.causeError) {
        console.error(generalError.causeError);
    }
    console.error(err);
    res.status(generalError.status).json(responseBody);
};

export class GeneralError extends TypeError {
    status: number;
    errorCode: string;
    errors: any[];
    causeError: Error | null;

    constructor(
        err: Error | null,
        message: string,
        status: number = 500,
        errorCode: string = 'GENERAL_ERROR',
        errors: any[] = []
    ) {
        super(message);
        this.causeError = err;
        this.status = status;
        this.errors = errors;
        this.errorCode = errorCode;
    }
}
