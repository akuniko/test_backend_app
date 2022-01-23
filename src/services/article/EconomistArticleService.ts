import {Article, FullArticle} from '../../interfaces/Article';
import puppeteer from 'puppeteer/lib/cjs/puppeteer/node-puppeteer-core';
import {ArticleService} from './ArticleService';

const BASIC_URL = 'https://www.economist.com';
const ECONOMIST_ARTICLE_URL_REGEX = '/[\\w-]*/\\d{4}/\\d{2}/\\d{2}/[\\w-]*';
const DEFAULT_LIMIT = 20;

export class EconomistArticleService implements ArticleService {
    async getArticleDetails(url: string): Promise<FullArticle> {
        const fullUrl = BASIC_URL + url;
        console.log('Fetching article: ' + fullUrl);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });

        const articleTitle = await page.$eval(
            'article.article header span.article__headline',
            (element) => element.textContent
        );
        const articleDescription = await page.$eval(
            'article.article header h2.article__description',
            (element) => element.textContent
        );
        const articleImg = await page.$eval(
            'article.article div.article__lead-image img',
            (element) => element.getAttribute('src')
        );
        const articleCreatedAt = await page.$eval(
            'article.article time.article__dateline-datetime',
            (element) => element.textContent
        );
        const articleBody = await page.$$eval(
            'article.article p.article__body-text',
            (elements) => elements.map((e) => e.textContent)
        );

        await browser.close();

        return {
            url: fullUrl,
            img: articleImg,
            description: articleDescription,
            title: articleTitle || 'unknown title',
            text: articleBody.join() || 'unknown text',
            createdAt: articleCreatedAt || 'unknown creation date'
        } as FullArticle;
    }

    async getArticles(limit: number = DEFAULT_LIMIT): Promise<Article[]> {
        console.log('Fetching articles from: ' + BASIC_URL);

        const browser = await puppeteer.launch({
            headless: true,
            devtools: false
        });

        const page = await browser.newPage();

        await page.goto(BASIC_URL, { waitUntil: 'domcontentloaded' });

        // typical economist link looks like this:
        // https://www.economist.com/middle-east-and-africa/2022/01/22/south-africa-the-worlds-coal-junkie-tries-to-quit
        const allArticle: Article[] = await page.$$eval(
            'a',
            (links, args: any) => {
                let counter = 0;
                const limit = args.limit;
                const linkRegExp = new RegExp(args.regExp);
                return links
                    .filter((link) => {
                        if (counter >= limit) {
                            return false;
                        }
                        const href = link.getAttribute('href');
                        const passed = href && linkRegExp.test(href);
                        if (passed) {
                            counter++;
                        }
                        return passed;
                    })
                    .map((link) => {
                        const href = link.getAttribute('href');
                        const title = link.textContent;
                        const parentHeader = link.parentElement;
                        const img = parentHeader?.parentElement
                            ?.querySelector('img')
                            ?.getAttribute('src');
                        const description =
                            parentHeader?.nextElementSibling?.textContent;

                        return {
                            url: href,
                            title,
                            img,
                            description
                        } as Article;
                    });
            },
            { regExp: ECONOMIST_ARTICLE_URL_REGEX, limit }
        );

        await browser.close();
        return allArticle;
    }
}
