var seriesOptions = [],
  seriesCounter = 0,
  names = ['FILTERED', 'UNFILTERED'];

/**
 * Create the chart when all data is loaded
 * @return {undefined}
 */
function createChart() {

  Highcharts.stockChart('container', {

    rangeSelector: {
      selected: 4
    },

    yAxis: {
      labels: {
        formatter: function () {
          return (this.value > 0 ? ' + ' : '') + this.value + '%';
        }
      },
      plotLines: [{
        value: 0,
        width: 2,
        color: 'silver'
      }]
    },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
      valueDecimals: 2,
      split: true
    },

    series: seriesOptions
  });
}

function success(data) {
  var name = this.url.match(/(filtered|unfiltered)/)[0].toUpperCase();
  var i = names.indexOf(name);
  seriesOptions[i] = {
    name: name,
    data: data
  };

  // As we're loading the data asynchronously, we don't know what order it
  // will arrive. So we keep a counter and create the chart when all the data is loaded.
  seriesCounter += 1;

  if (seriesCounter === names.length) {
    console.log('creating chart');
    createChart();
  }
}

Highcharts.getJSON(
  'http://localhost:3000/filtered?startingInvestment=100000',
  success
);
Highcharts.getJSON(
  'http://localhost:3000/unfiltered?startingInvestment=100000',
  success
);
