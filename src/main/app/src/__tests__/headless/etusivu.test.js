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
        /*{dumpio: true}*/ //Uncomment to see what happens
    );
    page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
        //console.log(request.url())
        if (request.url().startsWith(backend + '/search/koulutukset?keyword=&')) {
            request.respond(response(Koulutukset.createKoulutuksetSearchResult(21)));
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
        await page.waitForSelector('.navbar-brand');
        expect(await page.$eval('.navbar-brand', e => e.innerHTML)).toBe('Opintopolku');
        expect(await page.$eval('.search-button', e => e.innerHTML)).toBe('Etsi');
    }, timeout);

    it('keyword search', async () => {
        await page.type('.oph-input', 'datanomi');
        await page.click('.search-button');
        expect(await page.$eval('h1', e => e.innerHTML)).toMatch(new RegExp('Etsintäsi tuotti 0 osumaa.*'));
        expect(await page.url()).toMatch(host + '/haku/datanomi?paikkakunta=&koulutustyyppi=&kieli=&lng=fi');
        //await page.screenshot({ path: 'keyword.png' });
    }, timeout);

    it('rajaimet search', async () => {
        await page.click('.filter-button');
        await page.type('#paikkakunta', 'kerava');
        await page.click('#rajain-search');
        expect(await page.$eval('h1', e => e.innerHTML)).toMatch(new RegExp('Etsintäsi tuotti 21 osumaa.*'));
        expect(await page.url()).toMatch(host + '/haku?toggle=koulutus&kpage=1&opage=1&pagesize=20&paikkakunta=kerava&lng=fi');
        //await page.screenshot({ path: 'rajaimet.png' });
    }, timeout);
});