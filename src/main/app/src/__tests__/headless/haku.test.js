import {Koulutukset, Oppilaitokset} from '../mocks/create-mock-data'
const puppeteer = require('puppeteer');

let timeout = 10000;
let browser;
let page;
let host = 'http://localhost:' + process.env.PORT + '/konfo';
let backend = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend";
//console.log(process.env)

function response(json) {
    return {
        status: 200,
        contentType: 'application/json',
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify(json)
    }
}

beforeAll(async () => {
    browser = await puppeteer.launch(
        {args: ['--no-sandbox']}

        /*{dumpio: true}*/ //Uncomment to see what happens
    );
    page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
        // console.log(request.url())
        if (request.url().startsWith(backend + '/search/koulutukset?')) {
            request.respond(response(Koulutukset.createKoulutuksetSearchResult(21)));
        } else if (request.url().startsWith(backend + '/koulutus/')) {
            request.respond(response(Koulutukset.createKoulutusSearchResult("1.2.246.562.17.00000000")));
        } else if (request.url().startsWith(backend + '/search/oppilaitokset?')) {
            request.respond(response(Oppilaitokset.createOppilaitoksetSearchResult(15)));
        } else if (request.url().startsWith(backend + '/oppilaitos/')) {
            request.respond(response(Oppilaitokset.createOppilaitosSearchResult("3.2.246.562.17.00000000")));
        } else {
            request.continue();
        }
    });
}, timeout);

afterAll(async () => {
    await browser.close();
}, timeout);

describe('Haku', () => {
    beforeEach(async () => {
        await page.goto(host + '/haku?toggle=koulutus&paikkakunta=kerava');
    }, timeout);

    it('koulutus', async () => {
        expect.assertions(2);
        //await page.screenshot({ path: 'hakutulos.png' });
        await Promise.all([
            page.click('.hakutulosbox-link'),
            page.waitForSelector('#koulutus-title')
        ], timeout);
        //await page.screenshot({ path: 'koulutus.png' });
        expect(await page.$eval('#koulutus-title', e => e.innerHTML)).toMatch(new RegExp('Koulutus fi'));
        expect(await page.url()).toMatch(new RegExp(host + '/koulutus/1.2.246.562.17.00000000\?.*'));
    }, timeout);

    it('oppilaitos', async () => {
        expect.assertions(2);
        await page.click('#oppilaitos-toggle');
        await Promise.all([
            page.click('.hakutulosbox-link'),
            page.waitForSelector('h1')
        ]);
        expect(await page.$eval('h1', e => e.innerHTML)).toMatch(new RegExp('Oppilaitos fi'));
        expect(await page.url()).toMatch(new RegExp(host + '/oppilaitos/3.2.246.562.17.00000000\?.*'));
    }, timeout);

    it('vertailu', async () => {
        expect.assertions(2);
        const vertailuButtons = await page.$$('.compare-button');
        await Promise.all([
            vertailuButtons[3].click(),
            vertailuButtons[1].click(),
            vertailuButtons[2].click()
        ]);
        await Promise.all ([
            page.waitForNavigation(),
            page.click("#vertaile")
        ]);
        expect(await page.url()).toMatch(new RegExp(host + '/vertailu?.*'));
        expect(await page.$eval(".compare-list.green .title strong", (e) => e.innerHTML)).toMatch(new RegExp('Koulutus fi'));
    }, timeout);

});
