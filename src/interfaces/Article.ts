export interface Article {
    url: string;
    encodedUrl: string;
    title: string;
    img?: string;
    description?: string;
}

export interface FullArticle extends Omit<Article, 'type'> {
    createdAt: string;
    text: string;
}
