import { load } from 'cheerio';
import puppeteer from 'puppeteer-core';
//const {executablePath} = require('puppeteer')
import {executablePath} from 'puppeteer'
//import { Pool } from 'pg';
import pkg from 'pg';
const { Pool } = pkg;


type dataArr = {
  inzerat_id: number;
  title: string,
  location: string,
  price: string,
  img_arr: string[]
}

async function scrapeSreality() {
  const url = 'https://www.sreality.cz/hledani/prodej/byty'; //URL
  const numberOfItems = 500;
  const itemsPerPage = 20; // Sreality displays 20 items per page
  const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);
  
  let inzerat_id = 1;

  const scrapedItems:dataArr[] = [] 

  for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
    try {
      const browser = await puppeteer.launch({
          headless: true,
          args: ["--disable-setuid-sandbox"],
          'ignoreHTTPSErrors': true,
          executablePath: executablePath()
      });

      const page = await browser.newPage();
      
      await page.goto(`${url}?strana=${pageNumber}`);
      
      await page.setViewport({width: 1080, height: 1024});
      
      await page.waitForSelector('.dir-property-list')
      let element = await page.$('.dir-property-list')
      let value = await page.evaluate(el => el!.innerHTML, element)
      
      await browser.close();

      const $ = load(value);
      
      //class="dir-property-list"
      const propertyDiv = $('div.property')
      
      propertyDiv.each((index, element) => {

        if (scrapedItems.length < numberOfItems) {

          const title = $(element).find('.title').text().trim();
          const location = $(element).find('.locality').text().trim();
          const price = $(element).find('.price').text().trim();
          let img_arr:string[] = [];

          let imgTags = $(element).find('a[tabindex="-1"] > img');

          imgTags.each((index, element) => {
            const src = $(element).attr('src');
            img_arr.push(src!);
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
    } catch (error) {
        console.error('Error scraping page:', error);
    }
  }
  return scrapedItems;
}

// Connection configuration
const pool = new Pool({
  user: 'postgres', // replace with your PostgreSQL username
  host: 'localhost', // replace with your Docker container IP or hostname
  database: 'postgres', // replace with your database name
  password: 'postgres', // replace with your PostgreSQL password
  port: 5438, // replace with your Docker container port
});
  
async function insertData(data:dataArr[]) {
    const client = await pool.connect();
  
    try {
      // Insert data into the 'inzerat' table
      for (const record of data) {
        await client.query(
          'INSERT INTO inzerat(inzerat_id, title, location, price, img_arr) VALUES($1, $2, $3, $4, $5)',
          [record.inzerat_id, record.title, record.location, record.price, record.img_arr]
        );
      }
  
      console.log('Data inserted successfully');
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      // Release the client back to the pool
      client.release();
      // Close the pool when done
      await pool.end();
    }
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