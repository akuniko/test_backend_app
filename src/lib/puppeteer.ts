import puppeteer from "puppeteer/lib/cjs/puppeteer/node-puppeteer-core";
import {BrowserLaunchArgumentOptions, LaunchOptions} from "puppeteer/lib/cjs/puppeteer/node/LaunchOptions";
import {BrowserConnectOptions} from "puppeteer/lib/cjs/puppeteer/common/BrowserConnector";

export const puppeteerDefault = async (options?: LaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions) => {
    return await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true,
        devtools: false,
        ...options
    });
}
