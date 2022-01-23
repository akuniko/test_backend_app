import Joi from 'joi';

const username = Joi.string().alphanum().min(3).max(30).required();

const password = Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required();

export const signUpValidator = Joi.object({
    username: username,
    password: password
});

export const loginValidator = signUpValidator;
