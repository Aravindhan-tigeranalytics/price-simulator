export function stringToParseConversion(str: string): number {
  let s = str.replace(/,-/g, '').trim();
  if (s == '-') {
    return 0;
  } else {
    return parseFloat(s);
  }
}

export function NanCheck(dividend, divisor) {
  if (isNaN(dividend / divisor)) {
    return 0;
  }
  return dividend / divisor;
}

export function PercentAverageCalcuate(val1, val2) {
  if (val1 == 0) {
    return val2;
  } else if (val2 == 0) {
    return val1;
  } else {
    return (val1 + val2) / 2;
  }
}

export function getChartOptionColumn(title, categories, data_array, type) {
  return {
    chart: {
      backgroundColor: {
        linearGradient: [0, 0, 500, 500],
        stops: [
          [0, 'rgb(255, 255, 255)'],
          [1, 'rgb(200, 200, 255)'],
        ],
      },
      type: type,
    },

    title: {
      text: title,
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      title: {
        text: 'Percentage',
      },
    },

    tooltip: {
      formatter: function () {
        return this.y.toFixed(2) + '%';
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y.toFixed(2) + '%';
          },
        },
      },
    },

    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        data: data_array,
      },
    ],
  };
}

export function getChartOption(title, categories, data_array, type) {
  console.log(data_array, 'DATAARRAY');
  return {
    chart: {
      backgroundColor: {
        linearGradient: [0, 0, 500, 500],
        stops: [
          [0, 'rgb(255, 255, 255)'],
          [1, 'rgb(200, 200, 255)'],
        ],
      },
      // type: type,
      type: 'columnrange',
    },

    title: {
      text: title,
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      title: {
        text: 'Millions',
      },
    },

    // yAxis: {

    // },
    tooltip: {
      formatter: function () {
        // console.log(this.point , "POINT")
        return '<b>' + (this.point.high - this.point.low).toFixed(3) + ' ₽</b>';
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            // console.log("FORMATTER " , this)
            if (this.y != this.point.low) {
              let value = this.point.high - this.point.low;
              if (value % 1 != 0) {
                return value.toFixed(3) + '₽';
              } else {
                return String(value) + '₽';
              }
            }
          },
        },
      },
    },

    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        data: data_array,
        zones: [
          {
            value: 0.1,
            color: '#ffbf00',
          },
          {
            // value: 0.1,
            // color: '#47475C',
          },
        ],
      },
      // {
      //   data: data_array,
      //   yAxis: 1,
      //   name : 'Millions'
      // }
    ],
  };
}

export function yearPair(arr) {
  var rr = [];
  for (var i = 0; i < arr.length - 1; i = i + 1) {
    rr.push(arr[i] + '-' + arr[i + 1]);
  }
  return rr;
}
export function getArray(str) {
  if (str) {
    return str.split('-');
  }
  return [];
}
export function getChartOptionColumnYaxis(title, categories, data_array, type) {
  return {
    chart: {
      backgroundColor: {
        linearGradient: [0, 0, 500, 500],
        stops: [
          [0, 'rgb(255, 255, 255)'],
          [1, 'rgb(200, 200, 255)'],
        ],
      },
      zoomType: 'xy',
    },

    title: {
      text: title,
    },
    // subtitle: {
    //   text: 'change'
    // },
    xAxis: {
      categories: categories,
      crosshair: true,
    },

    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: '{value}$',
        },
        title: {
          text: 'Value Changes(Millions)',
          // style: {
          //   color: Highcharts.getOptions().colors[1],
          // },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: '% Change',
          // style: {
          //   color: Highcharts.getOptions().colors[0],
          // },
        },
        labels: {
          format: '{value} %',
          // style: {
          //   color: Highcharts.getOptions().colors[0],
          // },
        },
        opposite: true,
      },
    ],

    tooltip: {
      //   formatter: function () {
      //     return this.y + '%';
      //   },
    },

    // plotOptions: {
    //     series: {
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function () {
    //           return this.y.toFixed(2) + '%';
    //         },
    //       },
    //     },
    //   },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y.toFixed(2);
          },
        },
      },
    },

    // legend: {
    //   enabled: true
    // },
    legend: {
      layout: 'vertical',
      // align: 'left',
      // x: 120,
      verticalAlign: 'top',
      // y: 100,
      // floating: true,
      // backgroundColor:
      //   Highcharts.defaultOptions.legend.backgroundColor || // theme
      //   'rgba(255,255,255,0.25)'
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: 'Value Changes',
        type: 'column',
        yAxis: 1,
        data: data_array[0],
        // tooltip: {
        //   valueSuffix: '$',
        // },
      },
      {
        name: '% change',
        type: 'spline',
        data: data_array[1],
        // tooltip: {
        //   valueSuffix: '%',
        // },
      },
    ],
    //     series: [{
    //       name:"Value change",
    //       data : data_array[0],
    //        zones: [{
    //          value: 1,
    //          color: '#47475C',
    //      } , {

    //      }]
    //    },
    //  {
    //   name : '% Change',
    //    data: data_array[1],
    //    yAxis: 1,

    //  }
    // ]
  };
}

export function getPercentChange(arr) {
  let per = [100];
  for (var i = 1; i < arr.length; i = i + 1) {
    per.push(((arr[i] - arr[i - 1]) / arr[i - 1]) * 100);
  }
  return per;
}
