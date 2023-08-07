var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { load } from 'cheerio';
import puppeteer from 'puppeteer-core';
//const {executablePath} = require('puppeteer')
import { executablePath } from 'puppeteer';
//import { Pool } from 'pg';
import pkg from 'pg';
const { Pool } = pkg;
function scrapeSreality() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://www.sreality.cz/hledani/prodej/byty'; //URL
        const numberOfItems = 500;
        const itemsPerPage = 20; // Sreality displays 20 items per page
        const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);
        let inzerat_id = 1;
        const scrapedItems = [];
        for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
            try {
                const browser = yield puppeteer.launch({
                    headless: true,
                    args: ["--disable-setuid-sandbox"],
                    'ignoreHTTPSErrors': true,
                    executablePath: executablePath()
                });
                const page = yield browser.newPage();
                yield page.goto(`${url}?strana=${pageNumber}`);
                yield page.setViewport({ width: 1080, height: 1024 });
                yield page.waitForSelector('.dir-property-list');
                let element = yield page.$('.dir-property-list');
                let value = yield page.evaluate(el => el.innerHTML, element);
                yield browser.close();
                const $ = load(value);
                //class="dir-property-list"
                const propertyDiv = $('div.property');
                propertyDiv.each((index, element) => {
                    if (scrapedItems.length < numberOfItems) {
                        const title = $(element).find('.title').text().trim();
                        const location = $(element).find('.locality').text().trim();
                        const price = $(element).find('.price').text().trim();
                        let img_arr = [];
                        let imgTags = $(element).find('a[tabindex="-1"] > img');
                        imgTags.each((index, element) => {
                            const src = $(element).attr('src');
                            img_arr.push(src);
                        });
                        if (title && img_arr) {
                            scrapedItems.push({ inzerat_id, title, location, price, img_arr });
                            inzerat_id++;
                        }
                    }
                });
                if (scrapedItems.length >= numberOfItems) {
                    break;
                }
            }
            catch (error) {
                console.error('Error scraping page:', error);
            }
        }
        return scrapedItems;
    });
}
// Connection configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5438, // replace with your Docker container port
});
function insertData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            // Insert data into the 'inzerat' table
            for (const record of data) {
                yield client.query('INSERT INTO inzerat(inzerat_id, title, location, price, img_arr) VALUES($1, $2, $3, $4, $5)', [record.inzerat_id, record.title, record.location, record.price, record.img_arr]);
            }
            console.log('Data inserted successfully');
        }
        catch (error) {
            console.error('Error inserting data:', error);
        }
        finally {
            // Release the client back to the pool
            client.release();
            // Close the pool when done
            yield pool.end();
        }
    });
}
//insertData().catch(console.error);
scrapeSreality()
    .then((items) => {
    console.log(items);
    //console.log(items.length)
    insertData(items).catch(console.error);
})
    .catch((error) => {
    console.error('Scraping error:', error);
});
