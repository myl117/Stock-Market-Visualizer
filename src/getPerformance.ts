/**
 * This module creates a time series dataset from the Polygon data CSV file
 * The time series obj format is as follows: {date, percentageDiff}
 * When the getPerformance filtered arg is set to true, we substract the percentage of $AAPL and $META holdings before recording the performance
 * The percentage difference is simply the difference of the first opening price compared to each opening price in the Yahoo Finance dataset
*/


import { csv2arr } from './helpers';
import { AAPLMETAholdingPercentage } from './percentageOfFunds';

// store opening prices in global var
const openingPrices: { date: string, openPrice: number }[] = csv2arr(__dirname + '/data/historicalSPYData.csv');

// returns historical $SPY data as {date, percentageDiff} e.g: {date: '2022-01-14', percentageDiff: -2.5 }
const historicalSPYData = (openingPrices: { date: string, openPrice: number }[]): { date: string, percentageDiff: number }[] => {
  let arr: { date: string, percentageDiff: number }[] = [];
  // store initial opening price
  const initialOpeningPrice: number = openingPrices[0].openPrice;

  // iterate over each entry in openingPrices array and calculate the percentage difference for each open price
  for (let entry of openingPrices) {
    const openPrice: number = entry.openPrice;
    const percentageDiff: number = (((openPrice - initialOpeningPrice) / initialOpeningPrice) * 100);

    arr.push({ date: entry.date, percentageDiff, });
  }

  return arr;
}

// this is the main function we need, it accepts 2 params: the initial investment price and a boolean indicating which version (filtered/unfiltered) version of the fund
// returns time series {date, price}[] which can be easily imported into highcharts.js on the client side
const getPerformance = (startingInvestment: number, filtered: boolean): number[][] => {
  // arr used to store the performance of our initial investment over a 12 month period
  let performances: number[][] = [];

  const historicalSPYDataLocal: { date: string, percentageDiff: number }[] = historicalSPYData(openingPrices);

  // iterate over each percentage in the historical data arr and multiply by our startingInvestment
  for (let entry of historicalSPYDataLocal) {
    // convert yyyy-mm-dd string to milliseconds so it can be imported into highcharts.js
    const date: number = (new Date(entry.date)).getTime();

    // calculate the returns on the investment by multiplying percentageDiff with out startingInvestment
    let investmentReturns: number = (((entry.percentageDiff) / 100) * startingInvestment);

    // if the filtered arg is set to true, subtract percentage of $AAPL and $META holdings
    if (filtered) {
      investmentReturns = investmentReturns - ((investmentReturns / 100) * AAPLMETAholdingPercentage(entry.date));
    }

    // add our returns to our startingInvestment value
    let newPrice: number = investmentReturns + startingInvestment;

    performances.push([date, newPrice]);
  }

  //return historicalSPYData;
  return performances;
}

export { getPerformance };
