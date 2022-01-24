import {NextFunction, Request, Response} from 'express';
import {AnySchema, AsyncValidationOptions, ValidationErrorItem} from 'joi';
import {GeneralError} from './errorMiddleware';

function validate(prop: 'body' | 'query', validatorSchema: AnySchema, options?: AsyncValidationOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await validatorSchema
                .validateAsync(req[prop], {abortEarly: false, ...options})
                .then((val) => {
                    req[prop] = val;
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
}

export const validateQuery = (validatorSchema: AnySchema) => {
    return validate('query', validatorSchema);
};

export const validateBody = (validatorSchema: AnySchema) => {
    return validate('body', validatorSchema);
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
