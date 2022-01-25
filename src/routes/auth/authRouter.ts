import express, {NextFunction, Request, Response} from 'express';
import passport from 'passport';
import {createTokenForUser} from '../../auth/jwtStrategy';
import User from '../../models/User';
import {validateBody} from '../../middlewares/validatorMiddleware';
import {loginValidator, signUpValidator} from './authValidator';
import {GeneralError} from "../../middlewares/errorMiddleware";

export const authRouter = express.Router();

authRouter.post(
    '/login',
    validateBody(loginValidator),
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', {session: false}, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                throw new AuthenticationError('Wrong username or password');
            }
            req.login(user, {session: false}, async (err) => {
                if (err) {
                    return next(err)
                }
                const token = await createTokenForUser(user.id);
                return res.json({username: user.username, token});
            });
        })(req, res);
    }
);

authRouter.post(
    '/signup',
    validateBody(signUpValidator),
    async (req: Request, res: Response) => {
        const {username, password} = req.body;
        // @ts-ignore
        User.register(
            new User({username: username}),
            password,
            async (err: TypeError, user: Express.User) => {
                if (err) {
                    return res.status(500).send({error: err});
                }
                // @ts-ignore
                const token = await createTokenForUser(user.id);
                return res.status(200).send({token: token});
            }
        );
    }
);

class AuthenticationError extends GeneralError {
    constructor(msg: string) {
        super(null, msg, 400, "AUTHENTICATION_ERROR");
    }
}
