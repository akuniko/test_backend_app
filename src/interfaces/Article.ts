export enum ArticleType {
    TOP_STORIES,
    MOST_READABLE
}

export interface Article {
    url: string;
    encryptedUrl: string;
    title: string;
    img?: string;
    description?: string;
    type: ArticleType;
}

export interface FullArticle extends Omit<Article, 'type'> {
    createdAt: string;
    text: string;
}
