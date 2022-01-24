import express, {Request, Response} from 'express';
import passport from 'passport';
import {createTokenForUser} from '../../auth/jwtStrategy';
import User from '../../models/User';
import {validateBody} from '../../middlewares/validatorMiddleware';
import {loginValidator, signUpValidator} from './authValidator';

export const authRouter = express.Router();

authRouter.post(
    '/login',
    validateBody(loginValidator),
    async (req: Request, res: Response) => {
        passport.authenticate('local', {session: false}, (err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: false
                });
            }
            req.login(user, {session: false}, async (err) => {
                if (err) {
                    res.send(err);
                }
                const token = await createTokenForUser(user.id);
                return res.json({ user, token });
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
                return res.status(200).send({ token: token });
            }
        );
    }
);
