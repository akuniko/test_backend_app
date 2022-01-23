import passport from 'passport';
import User from '../models/User';
import {Router} from 'express';
import {jwtStrategy} from '../auth/jwtStrategy';
import {Strategy as LocalStrategy} from 'passport-local';

export default async (app: Router) => {
    app.use(passport.initialize());

    passport.use(jwtStrategy);
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password',
                session: false
            },
            // @ts-ignore
            User.authenticate()
        )
    );
};
