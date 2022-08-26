/**
 * This module loads constituent JSON data files into memory and exports a function to fetch the percentage of a stock in a fund
 * The loadConstituents function returns obj of last 12 months with all their holdings as percentages
 * The percentageOfFund function accepts a stock symbol and month. It returns the percentage of how much the $SPY consisted of that stock in that month.
 * The AAPLMETAholdingPercentage function returns the total holding percentage of $AAPL and $META combined
*/


import fs from 'fs';

const loadConstituents = (path: string): any => {
  let monthlyConstituents: any = {};

  const files = fs.readdirSync(path);

  // iterate over every constituent json file
  for (let file of files) {
    // parse file name (remove extension) to get month
    const month = file.substring(0, file.indexOf('.'));

    // parse the json file and destructure the holdings array
    const { holdings } = JSON.parse(fs.readFileSync(path + '/' + file, { encoding: 'utf8' }));

    let stocks: any = {};

    // iterate over each stock in holdings array
    for (let stock of holdings) {
      // set each stock symbol and percentage as key value pair in stocks obj
      stocks[stock.symbol] = stock.percent;
    }

    // set the stocks value for the current month
    monthlyConstituents[month] = stocks;
  }

  return monthlyConstituents;
}

// set constituents as global obj for performant r/w
const constituents = loadConstituents(__dirname + '/constituents');


const percentageOfFund = (symbol: string, month: string): number => {
  // for meta return either fb or meta 
  if (symbol == 'META' || symbol == 'FB') {
    return constituents[month]['FB'] || constituents[month]['META'];
  }

  return constituents[month][symbol];
}

// abstraction function which returns the percentage $META and $AAPL stocks in $SPY
const AAPLMETAholdingPercentage = (date: string): number => {
  // remove dd from date format, (yy-mm-dd > yy-mm) so we can use the percentageOfFund function
  const newDate: string = date.substring(0, date.lastIndexOf('-'));

  return (percentageOfFund('AAPL', newDate) + percentageOfFund('META', newDate));
}

export { percentageOfFund, AAPLMETAholdingPercentage };
