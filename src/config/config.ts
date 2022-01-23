import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    throw new Error('Env file required');
}

export default {
    isDev: ['development', 'dev'].includes(process.env.NODE_ENV),
    env: process.env.NODE_ENV,
    port: process.env.PORT || 9000,
    databaseURL: process.env.MONGODB_URL as string,

    credentials: {
        token: {
            secret: process.env.TOKEN_SECRET,
            issuer: process.env.TOKEN_ISSUER,
            audience: process.env.TOKEN_AUDIENCE,
            queryParameterName: process.env.TOKEN_PARAM || 'token'
        }
    }
};
