function initChart(initialPrice) {
  let seriesOptions = [],
    seriesCounter = 0,
    names = ['FILTERED', 'UNFILTERED'];

  /**
   * Create the chart when all data is loaded
   * @return {undefined}
   */
  function createChart() {

    Highcharts.stockChart('chart', {

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

    seriesCounter += 1;

    if (seriesCounter === names.length) {
      console.log('creating chart');
      createChart();
    }
  }

  Highcharts.getJSON(
    'http://localhost:3000/filtered?startingInvestment=' + initialPrice,
    success
  );

  Highcharts.getJSON(
    'http://localhost:3000/unfiltered?startingInvestment=' + initialPrice,
    success
  );
}

initChart(100);

$('.project').click(function () {
  const amount = parseInt($('.amount').val());

  if (!Number.isInteger(amount)) {
    return alert('Please enter an integer.');
  }

  initChart(amount);
});
