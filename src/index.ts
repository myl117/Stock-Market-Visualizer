/**
 * This is the root file
 * The /filtered and /unfiltered routes act as API wrappers around the getPerformance function.
 * These routes are called by the ./web/chart.js file to plot data onto the highcharts.js chart
*/


import express, { Request, Response } from 'express';
import { getPerformance } from './getPerformance';

const port = process.env.PORT || 3000;
const app = express();

app.use('/', express.static(__dirname + '/web'));

// Setup express
app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/web/index.html')
});

app.get('/filtered', (req: Request, res: Response) => {
  const startingInvestment: string = req.query.startingInvestment as string;
  res.json(getPerformance(parseInt(startingInvestment), true));
});

app.get('/unfiltered', (req: Request, res: Response) => {
  const startingInvestment: string = req.query.startingInvestment as string;
  res.json(getPerformance(parseInt(startingInvestment), false));
});

// Listen on port 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});
