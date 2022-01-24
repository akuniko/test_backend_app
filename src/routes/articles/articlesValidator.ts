import Joi from "joi";

export const articlesValidator = Joi.object({
    limit: Joi.number().integer().min(1).optional()
});
