import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as xyz from '../data/XYZ.json';
// import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import { attr } from 'highcharts';
// import { debug } from 'console';
// import * as d3Shape from 'd3-shape';
// import * as d3Array from 'd3-array';
// import * as d3Axis from 'd3-axis';
// import * as d3AxisLeft from 'd3-axis';
// import * as csv from ''

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  title = 'Line Chart';
  data: any[] = [
    { date: new Date('2010-01-01'), value: 80 },
    { date: new Date('2010-01-04'), value: 90 },
    { date: new Date('2010-01-05'), value: 95 },
    { date: new Date('2010-01-06'), value: 100 },
    { date: new Date('2010-01-07'), value: 110 },
    { date: new Date('2010-01-08'), value: 120 },
    { date: new Date('2010-01-09'), value: 130 },
    { date: new Date('2010-01-10'), value: 140 },
    { date: new Date('2010-01-11'), value: 150 },
  ];

  // private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  // private width: number;
  // private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3.Line<[number, number]>; // this is line defination
  MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };
  WIDTH = 200 - this.MARGIN.left - this.MARGIN.right;
  HEIGHT = 300 - this.MARGIN.top - this.MARGIN.bottom;
  DATA = [
    [
      {
        year: '2011w',
        value: 6940,
      },
      {
        year: '201w2',
        value: 1636,
      },
      {
        year: '20w13',
        value: 4157,
      },
      {
        year: '2w014',
        value: 1869,
      },
      {
        year: 'w2015',
        value: 2288,
      },
      {
        year: '2016w',
        value: 2783,
      },
    ],
  ];

  constructor() {
    //   this.width = 960 - this.margin.left - this.margin.right;
    //   this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
    // this.buildSvg();
    // this.addXandYAxis();
    // this.drawLineAndPath();
    this.addG('#my_dataviz');
    this.addG2('#my_dataviz2');
    this.addG('#my_dataviz11');
    this.addG2('#my_dataviz22');
    // this.horGr();
  }
  private addG(ele) {
    var datas = this.DATA;
    var margin = this.MARGIN,
      width = this.WIDTH - margin.left - margin.right,
      height = this.HEIGHT - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ele)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    const g = svg
      .append('g')
      // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // g.append('text')
    //   .attr('class', 'x-axis-label')
    //   .attr('x', width / 2)
    //   .attr('y', height + 110)
    //   .attr('font-size', '20px')
    //   .attr('text-anchor', 'middle')
    //   .text('The world tallest');

    // const x1 = d3
    //   .scaleLinear()
    //   .domain(datas[0].map((d) => d.value))
    //   .range([0, width]);

    // console.log(
    //   d3.max(datas[0], (d) => d.year),
    //   '&))))'
    // );

    // const y1 = d3
    //   .scaleBand()
    //   .domain([

    //     d3.min(datas[0], (d) => d.year),
    //     d3.max(datas[0], (d) => d.year),
    //   ])
    //   .range([0, height])
    //   .paddingInner(0.3)
    //   .paddingOuter(0.2);
    // const xAxisCall = d3.axisBottom(x1);
    // g.append('g')
    //   .attr('class', 'x axis')
    //   .attr('transform', `translate(0,${height})`)
    //   .call(xAxisCall)
    //   .selectAll('text')
    //   .attr('y', '10')
    //   .attr('x', '-5')
    //   .attr('text-anchor', 'end')
    //   .attr('transform', 'rotate(-40)');
    // const yAxisCall = d3.axisLeft(y1);
    // g.append('g').attr('class', 'y axis').call(yAxisCall);

    // const rects = g.selectAll('rect').data(datas[0]);
    // rects
    //   .enter()
    //   .append('rect')
    //   .attr('y', (d) => y1(d.year))
    //   .attr('x', x1(0))
    //   .attr('width', (d) => y1(d.value))
    //   .attr('height', y1.bandwidth());

    //     .append('rect')
    //     .attr('x', x(0))
    //     .attr('y', function (d) {

    //       return y(d.year);
    //     })
    //     .attr(
    //       'width',

    //       function (d) {
    //         return x(d.value);
    //       }
    //     )
    //     .attr('height', y.bandwidth())
    //     .attr('fill', '#69b3a2');

    // .attr('fill', 'grey');

    // var svg2 = d3
    //   .select('#my_dataviz2')
    //   .append('svg')
    //   .attr('width', width + margin.left + margin.right)
    //   .attr('height', height + margin.top + margin.bottom)
    //   .append('g')
    //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Parse the Data
    // d3.csv(
    //   'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv',

    datas.map(function (data) {
      data.sort(function(a, b) { return  b.value - a.value ; });
      var x = d3
        .scaleLinear()
        // .domain([0, d3.max(data, (d) => d.value)])
        .domain([0, d3.max(data, (d) => d.value)])
        .range([0, width]);

      var y = d3
        .scaleBand()
        .range([0, height])
        .domain(data.map((d) => d.year))
        // .paddingOuter(0.5)
        .paddingInner(0.1);

      // g.append('g')

      //   .attr('transform', 'translate(0,' + height + ')')
      //   // .call(d3.axisBottom(x))
      //   .selectAll('text')
      //   .attr('transform', 'translate(-10,0) rotate(-45)')
      //   .style('text-anchor', 'end');

      // g.append('g').attr('transform', 'translate(0 , 0 )');
      // .call(d3.axisLeft(y));

      g.selectAll('rect')
        .data(data)
        .enter()

        .append('rect')
        .attr('x', 0)
        .attr('y', function (d) {
          return y(d.year);
        })
        .attr(
          'width',

          function (d) {
            console.log(d.value, 'VALUE OF D WIDTH');
            console.log(x(d.value), 'VALUE OF X WIDTH');
            return x(d.value);
          }
        )
        .attr('height', y.bandwidth())
        .attr('fill', 'var(--color-blue-1)');
        g.selectAll("text")
        .data(data)
        .enter()
        .append('text')
        .text(d=>d.value)
        .attr('y', d=>y(d.year) +20 )
        .style('fill' , '#fff') 
      // .append('text')
      // .attr('class', 'below')
      // .attr('x', 12)
      // .attr('dy', '1.2em')
      // .attr('text-anchor', 'left')
      // .text(function (d) {
      //   return x(d.value);
      // })
      // .style('fill', '#fff');

      // g.append('text')
      //   .data(data)
      //   .attr('class', 'below')
      //   .attr('x', 12)
      //   .attr('dy', '1.2em')
      //   .attr('text-anchor', 'left')
      //   .text(function (d) {
      //     return d.value;
      //   })
      //   .style('fill', '#fff');

      // g.selectAll('.text')
      //   .data(data)
      //   .enter()
      //   .append('text')
      //   .attr('dy', '.75em')
      //   .attr('y', function (d) {
      //     return y(d.year) - 16;
      //   })
      //   .attr('x', function (d) {
      //     return x(d.value) + x.bandwidth() / 2;
      //   })
      //   .attr('text-anchor', 'middle')
      //   .text(function (d) {
      //     return d.year;
      //   });
      // .append('text')
      // .text(function (d) {
      //   return 'ee';
      // })
      // .attr('text-anchor', 'middle');
    });
  }

  private addG2(ele) {
    var datas = this.DATA;
    var margin = this.MARGIN,
      width = this.WIDTH - margin.left - margin.right,
      height = this.HEIGHT - margin.top - margin.bottom;

     
    const svg = d3
      .select(ele)
      .append('svg')
      // .attr('width', width + margin.left + margin.right)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      // .attr('transform', 'rotate(180)');
    const g = svg
      .append('g')
      // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

     
    datas.map(function (data) {
      data.sort(function(a, b) { return a.value - b.value; });
      var x = d3
        .scaleLinear()
        // .domain([100, 0])
        .domain([ 0,d3.max(data, (d) => d.value)])
        .range([width, 0]);

      var y = d3
        .scaleBand()

        .range([height, 0])
        .domain(data.map((d) => d.year))

        // .paddingOuter(0.5)
        .paddingInner(0.1);

      
      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x',function(d){return x(d.value) })
        .attr('y', function (d) {
          return y(d.year);
        })
        .attr(
          'width',

          function (d) {
            return x(0) - x(d.value);
          }
        )
        .attr('height', y.bandwidth())
        .attr('fill', 'var(--color-amber-1)');
      // .attr('transform', 'translate(0,0)');

      g.selectAll("text")
      .data(data)
      .enter()
      .append('text')
      .text(d=>d.value)
      .attr('x', '125' )
      .attr('y', d=>y(d.year) +20 )
      .style('fill' , '#fff') 
      // .attr()
    });
  }
  private addXandYAxis() {
    // range of data configuring
    // this.x = d3.scaleTime().range([0, this.width]);
    // this.y = d3.scaleLinear().range([this.height, 0]);
    // this.x.domain(d3.extent(this.data, (d) => d.date));
    // this.y.domain(d3.extent(this.data, (d) => d.value));
    // // Configure the Y Axis
    // this.svg
    //   .append('g')
    //   .attr('transform', 'translate(0,' + this.height + ')')
    //   .call(d3.axisBottom(this.x));
    // // Configure the Y Axis
    // this.svg
    //   .append('g')
    //   .attr('class', 'axis axis--y')
    //   .call(d3.axisLeft(this.y));
  }

  private drawLineAndPath() {
    this.line = d3
      .line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value));
    // Configuring line path
    this.svg
      .append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', this.line);
  }
  horGr() {
    var datas = [
      [
        {
          year: 2011,
          value: 45,
        },
        {
          year: 2012,
          value: 47,
        },
        {
          year: 2013,
          value: 52,
        },
        {
          year: 2014,
          value: 70,
        },
        {
          year: 2015,
          value: 75,
        },
        {
          year: 2016,
          value: 78,
        },
      ],
    ];

    var svg = d3.select('svg'),
      margin = 200,
      width = svg.attr('width') - margin,
      height = svg.attr('height') - margin;

    svg
      .append('text')
      .attr('transform', 'translate(100,0)')
      .attr('x', 50)
      .attr('y', 50)
      .attr('font-size', '24px')
      .text('XYZ Foods Stock Price');

    var x = d3.scaleBand().range([0, width]).padding(0.4),
      y = d3.scaleLinear().range([height, 0]);

    var g = svg
      .append('g')
      .attr('transform', 'translate(' + 100 + ',' + 100 + ')');
    // console.log((xyz as any).default);
    // debugger;

    // d3.json('../assets/data/XYZ.json',
    datas.map(function (data) {
      console.log(data, 'DATA');

      x.domain(
        data.map(function (d) {
          return d.year;
        })
      );
      y.domain([
        0,
        d3.max(data, function (d) {
          return d.value;
        }),
      ]);

      g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .append('text')
        .attr('y', height - 250)
        .attr('x', width - 100)
        .attr('text-anchor', 'end')
        .attr('stroke', 'black')
        .text('Year');

      g.append('g')
        .call(
          d3
            .axisLeft(y)
            .tickFormat(function (d) {
              return '$' + d;
            })
            .ticks(10)
        )
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '-5.1em')
        .attr('text-anchor', 'end')
        .attr('stroke', 'black')
        .text('Stock Price');

      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        // .on('mouseover', onMouseOver) //Add listener for the mouseover event
        // .on('mouseout', onMouseOut) //Add listener for the mouseout event
        .attr('x', function (d) {
          return x(d.year);
        })
        .attr('y', function (d) {
          return y(d.value);
        })
        .attr('width', x.bandwidth())
        .transition()
        .ease(d3.easeLinear)
        .duration(400)
        .delay(function (d, i) {
          return i * 50;
        })
        .attr('height', function (d) {
          return height - y(d.value);
        });
    });
    // function onMouseOver(d, i) {
    //   d3.select(this).attr('class', 'highlight');
    //   d3.select(this)
    //     .transition() // adds animation
    //     .duration(400)
    //     .attr('width', x.bandwidth() + 5)
    //     .attr('y', function (d) {
    //       return y(d.value) - 10;
    //     })
    //     .attr('height', function (d) {
    //       return height - y(d.value) + 10;
    //     });

    //   g.append('text')
    //     .attr('class', 'val')
    //     .attr('x', function () {
    //       return x(d.year);
    //     })
    //     .attr('y', function () {
    //       return y(d.value) - 15;
    //     })
    //     .text(function () {
    //       return ['$' + d.value]; // Value of the text
    //     });
    // }

    // //mouseout event handler function
    // function onMouseOut(d, i) {
    //   // use the text label class to remove label on mouseout
    //   d3.select(this).attr('class', 'bar');
    //   d3.select(this)
    //     .transition() // adds animation
    //     .duration(400)
    //     .attr('width', x.bandwidth())
    //     .attr('y', function (d) {
    //       return y(d.value);
    //     })
    //     .attr('height', function (d) {
    //       return height - y(d.value);
    //     });

    //   d3.selectAll('.val').remove();
    // }
  }
  private buildSvg() {
    // this.svg = d3
    //   .select('svg')
    //   .append('g')
    //   .attr(
    //     'transform',
    //     'translate(' + this.margin.left + ',' + this.margin.top + ')'
    //   );
  }


  // private addG2(ele) {
  //   var datas = this.DATA;
  //   var margin = this.MARGIN,
  //     width = this.WIDTH - margin.left - margin.right,
  //     height = this.HEIGHT - margin.top - margin.bottom;

     
  //   const svg = d3
  //     .select(ele)
  //     .append('svg')
  //     // .attr('width', width + margin.left + margin.right)
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .attr('transform', 'rotate(180)');
  //   const g = svg
  //     .append('g')
  //     // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  //     .attr('transform', 'translate(' + margin.top + ',' + 110 + ')');

     
  //   datas.map(function (data) {
  //     var x = d3
  //       .scaleLinear()
  //       // .domain([100, 0])
  //       .domain([d3.max(data, (d) => d.value), 0])
  //       .range([width, 0]);

  //     var y = d3
  //       .scaleBand()

  //       .range([height, 0])
  //       .domain(data.map((d) => d.year))

  //       // .paddingOuter(0.5)
  //       .paddingInner(0.1);

      
  //     g.selectAll('myRect')
  //       .data(data)
  //       .enter()
  //       .append('rect')
  //       .attr('x', x(0))
  //       .attr('y', function (d) {
  //         return y(d.year);
  //       })
  //       .attr(
  //         'width',

  //         function (d) {
  //           return x(d.value);
  //         }
  //       )
  //       .attr('height', y.bandwidth)
  //       .attr('fill', 'var(--color-amber-1)');
  //     // .attr('transform', 'translate(0,0)');
  //   });
  // }
}
