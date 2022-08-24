/**
 * This is the setup file required before any code can be run
 * It downloads historical $SPY from Yahoo Finance and saves it to /data
*/


import axios from 'axios';
import fs from 'fs';

const yahooFinanceURI: string = 'https://query1.finance.yahoo.com/v7/finance/download/SPY?period1=1630454400&period2=1659312000&interval=1d&events=history&includeAdjustedClose=true';

const setup = async () => {
  const { data } = await axios.get(yahooFinanceURI);

  fs.writeFileSync(__dirname + '/data/historicalSPYData.csv', data);
}

setup();
