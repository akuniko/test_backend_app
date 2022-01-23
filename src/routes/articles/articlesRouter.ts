import express from 'express';
import {Article} from '../../interfaces/Article';
import {EconomistArticleService} from '../../services/article/EconomistArticleService';
import passport from 'passport';
import {GeneralError} from '../../middlewares/errorMiddleware';
import {decode} from 'js-base64';

export const articlesRouter = express.Router();

const articleService = new EconomistArticleService();

articlesRouter.get('/', async (req, res, next) => {
    try {
        const articles: Article[] = await articleService.getArticles();
        res.status(200).send(articles);
    } catch (e: any) {
        next(new GeneralError(e, 'Can not fetch articles'));
    }
});
articlesRouter.get(
    '/:articleUrl',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const { articleUrl } = req.params;
        const decodedUrl = decode(articleUrl);
        try {
            console.log('Getting article: ' + decodedUrl);
            const article = await articleService.getArticleDetails(decodedUrl);
            res.status(200).send(article);
        } catch (e: any) {
            next(
                new GeneralError(
                    e,
                    `Can not fetch article details (url: ${decodedUrl})`
                )
            );
        }
    }
);
