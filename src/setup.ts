/**
 * This setup file should be run to initialize the environment before any 'npm run start' can be executed
 * It downloads historical $SPY from Polygon.io and saves it to /data as a CSV
*/


import axios from 'axios';
import fs from 'fs';

const POLYGON_API_KEY = 'lyABCEyJn0f1W8gwmdKczDpw29Y5pdiQ';
const polygonRequestURI: string = 'https://api.polygon.io/v2/aggs/ticker/SPY/range/1/day/2021-09-01/2022-08-25?adjusted=true&sort=asc&limit=50000&apiKey=' + POLYGON_API_KEY;

const setup = async () => {
  let dat: string = 'Date,Open';
  const { data } = await axios.get(polygonRequestURI);

  for (let entry of data.results) {
    // convert millis into yyyy-mm-dd format
    const date = new Date(entry.t);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);


    dat += `\n${year}-${month}-${day},${entry.o}`;
  }

  // write csv data to file
  fs.writeFileSync(__dirname + '/data/historicalSPYData.csv', dat);

  console.log('setup complete.');
}

setup();
