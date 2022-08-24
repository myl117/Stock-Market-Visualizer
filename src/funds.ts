/**
 * This module creates a time series dataset from the raw Yahoo Finance data
 * The time series obj format is as follows: {date, percentageDiff}
 * For the filtered fund, we substract the percentage of $AAPL and $META holdings before calculating the percentageDifference
 * The percentage difference is simply the difference of the first opening price compared to each opening price in the Yahoo Finance dataset
*/


import { csv2arr } from './helpers';
import { fundPriceMinusAPPLMETA } from './percentageOfFund';

// store opening prices in global var
const openingPrices: { date: string, openPrice: number }[] = csv2arr(__dirname + '/data/historicalSPYData.csv');

// returns unfiltered $SPY data as {date, percentageDiff} e.g: {date: '2022-01-14', percentageDiff: -2.5 }
const unfilteredSPYData = (openingPrices: { date: string, openPrice: number }[]): { date: string, percentageDiff: number }[] => {
  let arr: { date: string, percentageDiff: number }[] = [];
  // store initial opening price
  const initialOpeningPrice = openingPrices[0].openPrice;

  // iterate over each entry in openingPrices array and calculate the percentage difference for each open price
  for (let entry of openingPrices) {
    const openPrice = entry.openPrice;
    const percentageDiff = (((openPrice - initialOpeningPrice) / initialOpeningPrice) * 100);

    arr.push({ date: entry.date, percentageDiff, });
  }

  return arr;
}

console.log(unfilteredSPYData(openingPrices));


// returns filtered $SPY data as {date, percentageDiff} e.g: {date: '2022-01-14', percentageDiff: 4.5 }
const filteredSPYData = (openingPrices: { date: string, openPrice: number }[]): { date: string, percentageDiff: number }[] => {
  let arr: { date: string, percentageDiff: number }[] = [];
  // store initial opening price minus the AAPL and META stock prices
  const initialOpeningPrice = fundPriceMinusAPPLMETA(openingPrices[0].openPrice, openingPrices[0].date);

  // iterate over each entry in openingPrices array and calculate the percentage difference for each open price
  for (let entry of openingPrices) {
    const openPrice = fundPriceMinusAPPLMETA(entry.openPrice, entry.date);
    const percentageDiff = (((openPrice - initialOpeningPrice) / initialOpeningPrice) * 100);

    arr.push({ date: entry.date, percentageDiff, });
  }

  return arr;
}

console.log(filteredSPYData(openingPrices));

export { unfilteredSPYData, filteredSPYData };
