import {NextFunction, Request, Response} from 'express';
import {AnySchema, ValidationErrorItem} from 'joi';
import {GeneralError} from './errorMiddleware';

export const validate = (validatorSchema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await validatorSchema
                .validateAsync(req.body, { abortEarly: false })
                .then((val) => {
                    req.body = val;
                    next();
                })
                .catch((err) => {
                    const details: ValidationErrorItem[] = err.details;
                    throw new ValidationError(details);
                });
        } catch (err) {
            next(err);
        }
    };
};

class ValidationError extends GeneralError {
    constructor(validationErrors: ValidationErrorItem[]) {
        super(
            null,
            'Validation error',
            400,
            'VALIDATION_ERROR',
            validationErrors
        );
    }
}
