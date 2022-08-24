import fs from 'fs';

// converts csv to array (removes headers)
// accepts path to csv file
const csv2arr = (path: string): { date: string, openPrice: number }[] => {
  let arr: { date: string, openPrice: number }[] = [];
  let splitLines: string[] = (fs.readFileSync(path, { encoding: 'utf8' })).split('\n');
  splitLines.shift();

  // iterate over lines and push object {date, open} to arr var
  for (let entry of splitLines) {
    let splitCommas: string[] = entry.split(',');

    arr.push({ date: splitCommas[0], openPrice: parseFloat(splitCommas[1]) });
  }

  return arr;
}

export { csv2arr };
