const puppeteer = require('puppeteer');

describe('Etusivu', () => {
    let timeout = 10000;
    let browser;
    let page;
    let host = 'http://localhost:' + process.env.npm_package_config_testport + '/konfo';
    console.log("USING host " + host + " for tests!!!");

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    }, timeout);

    beforeEach(async () => {
        await page.goto(host);
    }, timeout);

    it('localization', async () => {
        await page.waitForSelector('.navbar-brand');
        expect(await page.$eval('.navbar-brand', e => e.innerHTML)).toBe('Opintopolku');
        expect(await page.$eval('.search-button', e => e.innerHTML)).toBe('Etsi');
    }, timeout);

    it('keyword search', async () => {
        await page.type('.oph-input', 'datanomi');
        await page.click('.search-button');
        expect(await page.$eval('h1', e => e.innerHTML)).toMatch(new RegExp('Etsintäsi tuotti 0 osumaa.*'));
        expect(await page.url()).toMatch(host + '/haku/datanomi?paikkakunta=&koulutustyyppi=&kieli=&lng=fi');
    }, timeout);

    it('rajaimet search', async () => {
        await page.click('.filter-button');
        await page.type('#paikkakunta', 'kerava');
        await page.click('#rajain-search');
        expect(await page.$eval('h1', e => e.innerHTML)).toMatch(new RegExp('Etsintäsi tuotti 0 osumaa.*'));
        expect(await page.url()).toMatch(host + '/haku/?paikkakunta=kerava&koulutustyyppi=&kieli=&lng=fi');
    }, timeout);

    afterAll(async () => {
        await browser.close();
    }, timeout)
});