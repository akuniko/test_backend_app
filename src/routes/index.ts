import {articlesRouter} from './articles/articlesRouter';
import {Router} from 'express';
import {authRouter} from './auth/authRouter';

export default (app: Router) => {
    app.use('/api/auth', authRouter);
    app.use('/api/articles', articlesRouter);
};
