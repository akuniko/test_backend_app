import {Article, FullArticle} from '../../interfaces/Article';

export interface ArticleService {
    getArticles(limit: number): Promise<Article[]>;

    getArticleDetails(url: string): Promise<FullArticle>;
}
