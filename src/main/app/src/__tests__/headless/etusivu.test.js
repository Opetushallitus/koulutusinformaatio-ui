import {Koulutukset} from '../mocks/create-mock-data'
const puppeteer = require('puppeteer');

let timeout = 10000;
let browser;
let page;
let host = 'http://localhost:' + process.env.PORT + '/konfo';
let backend = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend";
//console.log(process.env)
console.log('Using host: ' + host);
console.log('Using backend: ' + backend);

function response(json) { return {
    status: 200,
    contentType: 'application/json',
    headers: {"Access-Control-Allow-Origin": "*"},
    body: JSON.stringify(json)}};

beforeAll(async () => {
    browser = await puppeteer.launch(
        {args: ['--no-sandbox']}
        /*{dumpio: true}*/ //Uncomment to see what happens
    );
    page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
        //console.log(request.url())
        if (request.url().startsWith(backend + '/search/koulutukset?keyword=&')) {
            request.respond(response(Koulutukset.createKoulutuksetSearchResult(21)));
        } else if (request.url().startsWith(backend + '/search/koulutukset?keyword=datanomi&')) {
            request.respond(response(Koulutukset.createKoulutuksetSearchResult(0)));
        } else if (request.url().startsWith(backend + '/search/oppilaitokset?keyword=&')) {
            request.respond(response({count : 0}));
        } else {
            request.continue();
        }
    });
}, timeout);

afterAll(async () => {
    await browser.close();
}, timeout);

describe('Etusivu', () => {
    beforeEach(async () => {
        await page.goto(host);
    }, timeout);

    it('localization', async () => {
        expect.assertions(3);
        await page.waitForSelector('.navbar-brand');
        expect(await page.$eval('.navbar-brand', e => e.innerHTML)).toBe('Opintopolku');
        expect(await page.$eval('.search-button', e => e.innerHTML)).toBe('Etsi');
        await page.click('#language-en');
        expect(await page.url()).toMatch(new RegExp("\\?lng=en"));
    }, timeout);

    it('keyword search', async () => {
        expect.assertions(2);
        await page.type('.oph-input', 'datanomi');
        await page.click('.search-button');
        expect(await page.$eval('h1', e => e.innerHTML)).toMatch(new RegExp('Etsintäsi tuotti 0 osumaa.*'));
        expect(await page.url()).toMatch(new RegExp(host + '/haku/datanomi?.*'));
        //await page.screenshot({ path: 'keyword.png' });
    }, timeout);

    it('rajaimet search', async () => {
        expect.assertions(2);
        await page.click('.filter-button');
        await page.type('#paikkakunta', 'kerava');
        await page.click('#rajain-search');
        expect(await page.$eval('h1', e => e.innerHTML)).toMatch(new RegExp('Etsintäsi tuotti 21 osumaa.*'));
        expect(await page.url()).toMatch(host + '/haku?toggle=koulutus&kpage=1&opage=1&pagesize=20&paikkakunta=kerava&lng=fi');
        //await page.screenshot({ path: 'rajaimet.png' });
    }, timeout);

    it('sidebar & palaute', async () => {
        expect.assertions(6);
        await page.click('.menu.is-closed');
        await page.click('.palaute a');
        expect(await page.$eval('.palaute-form-header', e => e.innerHTML)).toBe('Mitä mieltä olet uudesta Opintopolusta?');
        expect((await page.$$('.icon-outline-star_border')).length).toEqual(5);
        expect(await page.$('.palaute-form-container .btn.inactive')).toBeDefined();
        await page.click('.icon-outline-star_border');
        expect((await page.$$('.icon-outline-star_rate')).length).toEqual(1);
        expect(await page.$('.palaute-form-container .btn.inactive')).toBeNull();
        expect(await page.$eval('.search-button', e => e.innerHTML)).toBe('Etsi');
    }, timeout);
});
