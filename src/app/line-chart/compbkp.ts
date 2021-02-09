import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as xyz from '../data/XYZ.json';
// import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import { attr } from 'highcharts';
import { UnitModel, NewUnit } from '../shared/models/unit';
import {
  SimulatorInput,
  SimulatedSummary,
  SimulatedArray,
} from '../shared/models/input';
import { Observable, of, from, BehaviorSubject, combineLatest } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { PriceScenarioService } from '../shared/services/price-scenario.service';

import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
} from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
// import { debug } from 'console';
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
  simulated : SimulatedArray;
  abs = "ABS Change"
  per = "% Change"
  decimalFormat = '1.0-1';
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
  sorted = []
  sorted2 = []
  MARGIN = { top: 10, right: 5, bottom: 10, left: 5 };
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
  total_rsv = 0;
  total_rsv_new = 0;
  total_lsv = 0;
  total_lsv_new = 0;
  total_trade_expense = 0;
  total_trade_expense_new = 0;
  total_nsv = 0;
  total_nsv_new = 0;
  total_cogs = 0;
  total_cogs_new = 0;
  total_mars_mac = 0;
  total_mars_mac_new = 0;
  total_retailer_margin = 0;
  total_retailer_margin_new = 0;
  total_base_units = 0;
  total_weight_in_tons = 0;
  rsv_w_o_vat_$_chg = 0;
  trade_expense_$_chg = 0;
  nsv_$_chg = 0;
  cogs_$_chg = 0;
  mars_mac_$_chg = 0;
  retailer_margin_$_chg = 0;
  rsv_w_o_vat_$_chg_percent = 0;
  trade_expense_$_chg_percent = 0;
  nsv_$_chg_percent = 0;
  cogs_$_chg_percent = 0;
  mars_mac_$_chg_percent = 0;
  retailer_margin_$_chg_percent = 0;

  tableData$: Observable<NewUnit[]>;
  constructor(private apiservice: ApiService,private priceScenarioService : PriceScenarioService) {
    //   this.width = 960 - this.margin.left - this.margin.right;
    //   this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
    this.tableData$ =   
    this.priceScenarioService.getNewChange();
    this.priceScenarioService.getSimulatedArray().subscribe(data=>{
      console.log(data , "simulated array data");
     this.simulated =  (data as SimulatedArray[]).find(d=>d.key == "ALL")
     console.log(this.simulated , "SIMULATED VALUE")
     this.calculateGrapth(this.simulated);

    })
    // this.tableData$.subscribe((data) => {
    //   console.log(data, 'New unit LENGTH TABLE DATA');
      
    //   this.filterData(data);
    // });
    // this.filterData()
    // this.buildSvg();
    // this.addXandYAxis();
    // this.drawLineAndPath();
 
    // this.horGr();
  }
  calculateGrapth(sim : SimulatedArray){
    // console.log(totalweightintons, 'totalweightintons');

    // console.log("calculate grapth");
    
    this.total_lsv = Math.ceil(sim.current.lsv / 1000000);
    this.total_rsv = Math.ceil(sim.current.rsv / 1000000);
    this.total_nsv = Math.ceil(sim.current.nsv / 1000000);
    this.total_trade_expense = Math.ceil(sim.current.te / 1000000);
    this.total_cogs = Math.ceil(sim.current.cogs / 1000000);
    this.total_mars_mac = Math.ceil(sim.current.mac / 1000000);
    this.total_retailer_margin = Math.ceil(sim.current.rp / 1000000);
    // this.total_base_units = Math.ceil(totalbase / 1000000);
    // this.total_weight_in_tons = Math.ceil(totalweightintons);
    this.total_lsv_new = Math.ceil(sim.simulated.lsv / 1000000)
    this.total_rsv_new = Math.ceil(sim.simulated.rsv / 1000000);
    this.total_trade_expense_new = Math.ceil(sim.simulated.te / 1000000);
    this.total_cogs_new = Math.ceil(sim.simulated.cogs / 1000000);
    this.total_nsv_new = Math.ceil(sim.simulated.nsv / 1000000);
    this.total_mars_mac_new = Math.ceil(sim.simulated.mac / 1000000);
    this.total_retailer_margin_new = Math.ceil(
      sim.simulated.rp / 1000000
    );
    let data_bkp = [
        
      {
        year: 'Total RSV',
        value: this.total_rsv,
      },
      {
        year: 'Total Trade Expense',
        value: this.total_trade_expense,
      },
      {
        year: 'Net Sales Value',
        value: this.total_nsv,
      },
      {
        year: 'COGS',
        value: this.total_cogs,
      },
      {
        year: 'MARS MAC',
        value: this.total_mars_mac,
      },
      {
        year: 'Customer Margin',
        value: this.total_retailer_margin,
      },
    ]

    let data2 = [
      
        {
          'Total LSV': this.total_lsv
        },
        {
          'Total Trade Expense' :this.total_trade_expense
        },
        {
          'Net Sales Value': this.total_nsv
        },
        {
          'COGS': this.total_cogs
        },
        {
         'MARS MAC': this.total_mars_mac
        },
        {
          'Customer Margin': this.total_retailer_margin
        },
      ]
       
      
    let data_new2 = 
      [
        {
         'Total LSV': this.total_lsv_new 
        },
        {
          'Total Trade Expense': this.total_trade_expense_new 
        },
        {
         'Net Sales Value': this.total_nsv_new 
        },
        {
         'COGS': this.total_cogs_new 
        },
        {
         'MARS MAC': this.total_mars_mac_new 
        },
        {
         'Customer Margin': this.total_retailer_margin_new,
        },
      ]
    // ];


   
    
             let data = 
      [
        {
          'Total RSV': this.total_rsv 
        },
        {
          'Total Trade Expense' :this.total_trade_expense
        },
        {
          'Net Sales Value': this.total_nsv
        },
        {
          'COGS': this.total_cogs
        },
        {
         'MARS MAC': this.total_mars_mac
        },
        {
          'Customer Margin': this.total_retailer_margin
        },
      ]
    
      
      let data_new = 
      [
        {
          'Total RSV': this.total_rsv_new 
        },
        {
          'Total Trade Expense' :this.total_trade_expense_new
        },
        {
          'Net Sales Value': this.total_nsv_new
        },
        {
          'COGS': this.total_cogs_new
        },
        {
         'MARS MAC': this.total_mars_mac_new
        },
        {
          'Customer Margin': this.total_retailer_margin_new
        },
      ]
      // console.log(data , "DATAAAA")
      
      data.map(d=>Object.keys(d)[0])
      
      this.sorted =  data2.map(d=>Object.keys(d)[0])
      console.log(this.sorted , "SORTED PARAMETER")
      this.sorted2 = data.map(d=>Object.keys(d)[0])
      console.log(this.sorted2 , "SORTED 2")
      //  data_bkp
      // .map(d=>d.year)
      // console.log(this.sorted , "SORTED PARAMETER")
     
      this.addG2('#my_dataviz', this.getGraphData(data2 , data_new2 , true)) //base
      // this.addG2('#my_dataviz' , data2 , data_new2);
      this.addG('#my_dataviz2' ,  this.getGraphData(data2 , data_new2,false) ); //new
      this.addG('#my_dataviz22' ,  this.getGraphData(data , data_new,false)); //new
      // this.addG('#my_dataviz2' , data_new2,data2 );
      // this.addG('#my_dataviz22' , data_new,data);
      this.addG2('#my_dataviz11' ,  this.getGraphData(data , data_new , true)); //base
      // this.addG2('#my_dataviz11' , data , data_new);

  }
  private addG(ele , data?,new_d?) {
    // console.log(data , "DATATATATT")
   
    var margin = this.MARGIN,
      width = this.WIDTH - margin.left - margin.right,
      height = this.HEIGHT - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ele)
      .append('svg')

      var g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  

      const dataset = data
   
      var colors = ['var(--color-amber-1)', 'var(--color-blue-1)']
      var colorss = d3.scaleOrdinal(colors)

      
      var stack = d3.stack()
      .keys([ "value", "change" ])

      var series = stack(dataset)
  
      var xScale =  d3
      .scaleLinear()
          .domain([ 0, d3.max(dataset, d => d.value +((d.change))  )])
          .range([0, width]);


          var yScale = d3
          .scaleBand()
          .range([ 0,height])
          .domain(d3.range(dataset.length))
          .paddingInner(0.1);
 
          var bars = g.append('g')
          .attr('class', 'bars')
      
          var groups = bars.selectAll("g")
          .data(series)
          .enter()
          .append("g")
          .style("fill",function(d,i){
            return colorss(i)
          })
        
          var rects = groups.selectAll("rect")
          .data(d => d)
          .enter()
          .append("rect")
          .attr("x", function(d,i){
            // console.log(d,i , "DFILL X addg")
            // console.log(xScale(d[1]), "DFILL Xscale addg")
            let xs = xScale(d[0])
            return xs
          })
          .attr("y", function(d,i){
            let ys = yScale(i)
            return ys
          })
            
          .attr("height",  function(d){
            let ysc = yScale.bandwidth()
            return ysc
          })
          .attr("width", function(d,i){
            // console.log(d, i , "WIDTH D I addg")
            // console.log((xScale(d[0])) , "WIDTH D I addg xscale d0")
            // console.log((xScale(d[1])) , "WIDTH D I addg xscale d1")
            let wid = (xScale(d[1])  - xScale(d[0]));
            // console.log(wid , "WIDTH D I addg xscale wid")
            return wid
          }) 
          .style("fill",function(d,i){
            let v = d.data.change
            if(d[0]!=0 && v > 0){
              return "green"
            }
          })
          g.selectAll("text")
      .data(dataset)
      .enter()
      .append('text')
      .text(d=>d.value + "₽" )
      .attr('x', function(d,i){
       
        return 0
      } )
      .attr('y', function(d,i){
        
        return yScale(i) + 20
      })
      .style('fill' , function(data){
             return '#fff'
      })
      .style('font-size' , '10px') 
        
          // .style("fill",function(d,i){
          //   console.log(d, i , " DIFILL")
          //  let v = d.data.change - d.data.value
          //  console.log(v , "DIFILL CALCULATD VALUE")
          //  if(d[0]!=0 && v > 0){
          //    return "green"
          //  }
          //  else if(d[0]!=0 &&  v < 0){
          //    return 'red'
          //  }
          //  else{
      
          //  }
          // })
   
  }
  private addG2(ele , data? , new_d?) {
    
    var margin = this.MARGIN,
      width = this.WIDTH - margin.left - margin.right,
      height = this.HEIGHT - margin.top - margin.bottom;
    const svg = d3
      .select(ele)
      .append('svg')
     var g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      const dataset =[].concat(data).reverse();
      var colors = ['var(--color-amber-1)', 'var(--color-blue-1)']
      var colorss = d3.scaleOrdinal(colors)
      // datas.map(function (data) {
      // console.log(data , "DATAAAAA")
      // data =  [].concat(data).reverse();

      var stack = d3.stack()
      .keys([ "value", "change" ])
      // console.log(stack , "STACK")

      var series = stack(dataset)


      var xScale =  d3
    .scaleLinear()
        .domain([ 0, d3.max(dataset, d => d.value +(Math.abs(d.change))  )])
        .range([width, 0]);

        var yScale = d3
        .scaleBand()
        .range([height, 0])
        .domain(d3.range(dataset.length))
        .paddingInner(0.1);

        var bars = g.append('g')
    .attr('class', 'bars')

    var groups = bars.selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .style("fill",function(d,i){
    
      return colorss(i)
    
      // if(d.key == "change"){
      //   let v = d[0].data.change
      //   console.log(v , "COLORS D I change Value ")
      //   if(v > 0){
      //     return 'green'
      //   }
      //   else if (v == 0 ){
      //     return colorss(i)
      //   }
      //   else{
      //     return 'red'

      //   }
      //   // console.log(d.data , "DATA")
       

      // }
      // else{
      //   return colorss(i)

      // }
     
    })
    // console.log(groups , "GROUP")
      
    var rects = groups.selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", function(d,i){
     
      let xs = xScale(d[1])
      return xs
    })
    .attr("y", function(d,i){
      let ys = yScale(i)
      // console.log(d, "D YYYY")
      // console.log(ys , "Y SCALE ")
      return ys
    })
    // .attr("height", d => yScale(d[0]) - yScale(d[1]))
    // .attr("width", xScale.bandwidth())
    .attr("height",  function(d){
      let ysc = yScale.bandwidth()
      // console.log(ysc , "Y SCALE")
      return ysc
    })
    .attr("width", function(d,i){
      
      let wid = (xScale(d[0])  - xScale(d[1]));
      // console.log(d , i ,"D I WIDTH ")
      // console.log( xScale(d[0]) , "WIDTH d[0]")
      // console.log( xScale(d[1]) , "WIDTH d[1]")
      
      // console.log(wid , "WIDTH ")
      return wid
    }) 
    .style("fill",function(d,i){
      // console.log(d, i , " DIFILL")
     let v = d.data.change 
         //  console.log(v , "DIFILL CALCULATD VALUE")
     if(d[0]!=0 && v > 0){
       return "red"
     }
    //  else if(d[0]!=0 &&  v < 0){
    //    return 'red'
    //  }
    //  else{

    //  }
    })

      g.selectAll("text")
      .data(dataset)
      .enter()
      .append('text')
      .text(d=>d.value + "₽" )
      .attr('x', function(d,i){
       
        return 150
      } )
      .attr('y', function(d,i){
        
        return yScale(i) + 20
      })
      .style('fill' , function(data){
             return '#fff'
      })
      .style('font-size' , '10px') 
    // });
  }


    filterData(units: NewUnit[]) {
    let totalrsv$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat, 0)
    );

    let trade_expense$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense, 0)
    );
    let total_nsv$ = of(...units).pipe(reduce((a, b) => a + b.total_nsv, 0));
    let total_cogs$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs, 0));
    let mars_mac$ = of(...units).pipe(reduce((a, b) => a + b.mars_mac, 0));
    let retailer_margin$ = of(...units).pipe(
      reduce((a, b) => a + b.retailer_margin, 0)
    );
    let total_base$ = of(...units).pipe(reduce((a, b) => a + b.base_units, 0));
    let total_weight_in_tons$ = of(...units).pipe(
      reduce((a, b) => a + b.total_weight_in_tons, 0)
    );
    let rsv_vat_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat_new, 0)
    );
    let trade_expense_new$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense_new, 0)
    );
    let total_nsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_nsv_new, 0)
    );
    let total_cogs_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_cogs_new, 0)
    );
    let mars_mac_new$ = of(...units).pipe(
      reduce((a, b) => a + b.mars_mac_new, 0)
    );
    let retailer_margin_new$ = of(...units).pipe(
      reduce((a, b) => a + b.retailer_margin_new, 0)
    );
    combineLatest([
      totalrsv$,
      trade_expense$,
      total_nsv$,
      total_cogs$,
      mars_mac$,
      retailer_margin$,
      total_base$,
      total_weight_in_tons$,
      rsv_vat_new$,
      trade_expense_new$,
      total_nsv_new$,
      total_cogs_new$,
      mars_mac_new$,
      retailer_margin_new$,
    ]).subscribe(
      ([
        totalrsv,
        tradeexpense,
        totalnsv,
        totalcogs,
        marsmc,
        retailermargin,
        totalbase,
        totalweightintons,
        rsv_vat_new,
        trade_expense_new,
        total_nsv_new,
        total_cogs_new,
        mars_mac_new,
        retailer_margin_new,
      ]) => {
        // console.log(totalweightintons, 'totalweightintons');

        // console.log(rsv_vat_new , "RSV NEW");
        this.total_rsv = Math.ceil(totalrsv / 1000000);
        this.total_nsv = Math.ceil(totalnsv / 1000000);
        this.total_trade_expense = Math.ceil(tradeexpense / 1000000);
        this.total_cogs = Math.ceil(totalcogs / 1000000);
        this.total_mars_mac = Math.ceil(marsmc / 1000000);
        this.total_retailer_margin = Math.ceil(retailermargin / 1000000);
        this.total_base_units = Math.ceil(totalbase / 1000000);
        this.total_weight_in_tons = Math.ceil(totalweightintons);
        this.total_rsv_new = Math.ceil(rsv_vat_new / 1000000);
        this.total_trade_expense_new = Math.ceil(trade_expense_new / 1000000);
        this.total_cogs_new = Math.ceil(total_cogs_new / 1000000);
        this.total_nsv_new = Math.ceil(total_nsv_new / 1000000);
        this.total_mars_mac_new = Math.ceil(mars_mac_new / 1000000);
        this.total_retailer_margin_new = Math.ceil(
          retailer_margin_new / 1000000
        );
        this.rsv_w_o_vat_$_chg = -(this.total_rsv_new - this.total_rsv);
        this.trade_expense_$_chg = -(
          this.total_trade_expense_new - this.total_trade_expense
        );
        this.nsv_$_chg = -(this.total_nsv_new - this.total_nsv);
        this.cogs_$_chg = -(this.total_cogs_new - this.total_cogs);
        this.mars_mac_$_chg = -(this.total_mars_mac_new - this.total_mars_mac);
        this.retailer_margin_$_chg = -(
          this.total_retailer_margin_new - this.total_retailer_margin
        );

        this.rsv_w_o_vat_$_chg_percent =
          (this.rsv_w_o_vat_$_chg / this.total_rsv) * 100;
        this.trade_expense_$_chg_percent =
          (this.trade_expense_$_chg / this.total_trade_expense) * 100;
        this.nsv_$_chg_percent = (this.nsv_$_chg / this.total_nsv) * 100;
        this.cogs_$_chg_percent = (this.cogs_$_chg / this.total_cogs) * 100;
        this.mars_mac_$_chg_percent =
          (this.mars_mac_$_chg / this.total_mars_mac) * 100;
        this.retailer_margin_$_chg_percent =
          (this.retailer_margin_$_chg / this.total_retailer_margin) * 100;

          // let data = {

          // }
          let data2 = [
            [
              {
                year: 'Total LSV',
                value: this.total_nsv,
              },
              {
                year: 'Total Trade Expense',
                value: this.total_trade_expense,
              },
              {
                year: 'Net Sales Value',
                value: this.total_nsv,
              },
              {
                year: 'COGS',
                value: this.total_cogs,
              },
              {
                year: 'MARS MAC',
                value: this.total_mars_mac,
              },
              {
                year: 'Customer Margin',
                value: this.total_retailer_margin,
              },
            ],
          ];
          let data_new2 = [
            [
              {
                year: 'Total LSV',
                value: this.total_nsv_new,
              },
              {
                year: 'Total Trade Expense',
                value: this.total_trade_expense_new,
              },
              {
                year: 'Net Sales Value',
                value: this.total_nsv_new,
              },
              {
                year: 'COGS',
                value: this.total_cogs_new,
              },
              {
                year: 'MARS MAC',
                value: this.total_mars_mac_new,
              },
              {
                year: 'Customer Margin',
                value: this.total_retailer_margin_new,
              },
            ],
          ];

        
          let data = [
            [
              {
                year: 'Total RSV',
                value: this.total_rsv,
              },
              {
                year: 'Total Trade Expense',
                value: this.total_trade_expense,
              },
              {
                year: 'Net Sales Value',
                value: this.total_nsv,
              },
              {
                year: 'COGS',
                value: this.total_cogs,
              },
              {
                year: 'MARS MAC',
                value: this.total_mars_mac,
              },
              {
                year: 'Customer Margin',
                value: this.total_retailer_margin,
              },
            ],
          ];
          let data_new = [
            [
              {
                year: 'Total RSV',
                value: this.total_rsv_new,
              },
              {
                year: 'Total Trade Expense',
                value: this.total_trade_expense_new,
              },
              {
                year: 'Net Sales Value',
                value: this.total_nsv_new,
              },
              {
                year: 'COGS',
                value: this.total_cogs_new,
              },
              {
                year: 'MARS MAC',
                value: this.total_mars_mac_new,
              },
              {
                year: 'Customer Margin',
                value: this.total_retailer_margin_new,
              },
            ],
          ];
          // console.log(data , "DATAAAA")
          this.sorted =  data[0]
          
          .map(d=>d.year)
          // console.log(this.sorted , "SORTED PARAMETER")
          this.sorted2 =  data2[0]
          
          .map(d=>d.year)
          // console.log(this.sorted , "SORTED PARAMETER")
          this.addG('#my_dataviz' , data);
          this.addG2('#my_dataviz2' , data_new , data);
          this.addG('#my_dataviz11' , data2);
          this.addG2('#my_dataviz22' , data_new2 , data2);

        // console.log(trade_expense_new, 'trade_expense_new NEW');
        // console.log(total_cogs_new, 'total_cogs_new NEW');
        // console.log(total_nsv_new, 'total_nsv_new NEW');
        // console.log(mars_mac_new, 'mars_mac_new NEW');
        // console.log(retailer_margin_new, 'retailer_margin_new NEW');
        // this.reRender();
      }
    );
  }
  private getGraphData(base : Array<Object>,simulated:Array<Object> , is_base=false ){
    // console.log(base ,is_base, "BASE VALUE")
    // console.log(simulated ,is_base ,  "SIMULATED")
    let val = []
    base.forEach((d,i)=>{
      let obj = d
     let key =   Object.keys(obj)[0]
     let value = obj[key]
     let simulatedValue = simulated[i][key]
     let generated;
     if(is_base){
       if(simulatedValue<value ){
        generated = {
          value : value -  Math.abs(value - simulatedValue) ,
          change : Math.abs(value - simulatedValue)
        }

       }
       else{
        generated = {
          value : value  ,
          change : 0
        }

       }

      
     }
     else{
      if(simulatedValue>value ){
        generated = {
          value : value -  Math.abs(value - simulatedValue) ,
          change : Math.abs(value - simulatedValue)
        }

       }
       else{
        generated = {
          value : value  ,
          change : 0
        }

       }


     }
    
val.push(generated)
    })
    // console.log(val , " GENERATED VALUE ")
    // debugger
return val
  }
  private addG_bkp(ele , data?,new_d?) {
    console.log(data , "DATATATATT")
    var datas = data;
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
 
    // datas.map(function (data) {
      // data.sort(function(a, b) { return  b.value - a.value ; });
      // let t = d3
      // debugger
      // console.log(Object.values(d3.max(data))[0])
      var x = d3
        .scaleLinear()
        // .domain([0, d3.max(data, (d) => d.value)])
        .domain([0,
          //  d3.max(data, (d) => d.value)
           Object.values(d3.max(data))[0]
          ])
        .range([0, width]);
        // debugger
// console.log(Object.keys(data) , "KEYS")
      var y = d3
        .scaleBand()
        .range([0, height])
        .domain(
          // Object.keys(data)
        data.map(d=>Object.keys(d)[0])
          // data.map((d) => d.year)
          )
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
          // console.log(d , "DDDD")
          // debugger;
          let e = Object.keys(d)[0]
          // console.log(e , "eee")
          // console.log(y(e) , "ye")
          // debugger

          return y(e);
        })
        .attr(
          'width',

          function (d) {
            // console.log(x(Object.values(d)[0]) , "x(Object.values(d)[0])")
          
            return x(Object.values(d)[0]);
          }
        )
        .attr('height', y.bandwidth())
        .attr('fill'
        , function(data){
          let color =  'var(--color-blue-1)'
        
        //  let newv = new_d[0].find(d=>d.year == data.year).value

        
        // if(data.value < newv){
        //   color = 'red'
        // }
        // else if(data.value > newv){
        //   color = 'green'
        // }
         
         return color
       });
        // g.selectAll("text")
        // .data(data)
        // .enter()
        // .append('text')
        // .text(d=>(d.value + " M₽"))
        // .attr('y', d=>y(d.year) +20 )
        // .style('fill' , '#fff') 
        // .style('font-size' , '10px') 
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
    // });
  }
  private addG2_bkp(ele , data? , new_d?) {
    var datas = data;
    var margin = this.MARGIN,
      width = this.WIDTH - margin.left - margin.right,
      height = this.HEIGHT - margin.top - margin.bottom;
    const svg = d3
      .select(ele)
      .append('svg')
     
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    const g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
      // datas.map(function (data) {
      // console.log(data , "DATAAAAA")
      data =  [].concat(data).reverse();

      var stack = d3.stack()
      .keys([ "apples", "oranges" ])
      // console.log(stack , "STACK")

      var series = stack(data)


      var x = d3
        .scaleLinear()
        .domain([ 0,d3.max(data, (d) => d.value)])
        .range([width, 0]);

      var y = d3
        .scaleBand()
        .range([height, 0])
        .domain(data.map((d) => d.year))
        .paddingInner(0.1);

      
      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x',function(d){
          return x(d.value) })
        .attr('y', function (d) {
          return y(d.year);
        })
        .attr(
          'width',
          function (d) {
            // console.log(x , "XXXXXXX")
            return x(0) - x(d.value);
          }
        )
        .attr('height', y.bandwidth())
        .attr('fill'
        , function(data){
           let color = 'var(--color-amber-1)'
          return color
        });
     
      g.selectAll("text")
      .data(data)
      .enter()
      .append('text')
      .text(d=>(d.value+ " M₽"))
      .attr('x', '120' )
      .attr('y', d=>y(d.year) +20 )
      .style('fill' , function(data){
             return '#fff'
      })
      .style('font-size' , '10px') 
    // });
  }

  
}
//   private addG2(ele , data? , new_d?) {
//     var datas = data;
//     var margin = this.MARGIN,
//       width = this.WIDTH - margin.left - margin.right,
//       height = this.HEIGHT - margin.top - margin.bottom;

     
//     const svg = d3
//       .select(ele)
//       .append('svg')
//       // .attr('width', width + margin.left + margin.right)
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height + margin.top + margin.bottom)
//       // .attr('transform', 'rotate(180)');
//     const g = svg
//       .append('g')
//       // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

     
//     datas.map(function (data) {
//       console.log(data , "DATAAAAA")
//       // data.sort(function(a, b) { return a.value - b.value; });
//       data =  [].concat(data).reverse();
      
//       var x = d3
//         .scaleLinear()
//         // .domain([100, 0])
//         .domain([ 0,d3.max(data, (d) => d.value)])
//         .range([width, 0]);

//       var y = d3
//         .scaleBand()

//         .range([height, 0])
//         .domain(data.map((d) => d.year))

//         // .paddingOuter(0.5)
//         .paddingInner(0.1);

      
//       g.selectAll('rect')
//         .data(data)
//         .enter()
//         .append('rect')
//         .attr('x',function(d){
           


//           return x(d.value) })
//         .attr('y', function (d) {
//           return y(d.year);
//         })
//         .attr(
//           'width',

//           function (d) {
//             console.log(x , "XXXXXXX")
//             return x(0) - x(d.value);
//           }
//         )
//         .attr('height', y.bandwidth())
//         .attr('fill'
//         , function(data){
//            let color = 'var(--color-amber-1)'
         
//         //   let newv = new_d[0].find(d=>d.year == data.year).value

         
//         //  if(data.value < newv){
//         //    color = 'red'
//         //  }
//         //  else if(data.value > newv){
//         //    color = 'green'
//         //  }
          
//           return color
//         });
//       // .attr('transform', 'translate(0,0)');

// //       <svg id="right_arrow" class="direction__right direction__item" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="80px" height="80px" viewBox="0 0 80 80" xml:space="preserve">
// //   <polygon class="ring offset-colour" points="32.5,52 47.5,40 32.5,28" />
// //   <circle cx="40" cy="40" r="36" fill="transparent" stroke="black" stroke-width="2" />
// //   <circle class="circle" cx="40" cy="40" r="36" fill="transparent" stroke="black" stroke-width="4" />
// // </svg>
// // g.selectAll("circle")
// // .data(data)
// // .enter()
// // .append('circle')
// // .text(d=>d.value)
// // .attr('cx', '125' )
// // .attr('cy', d=>y(d.year) +20 )
// // .attr('r', '20' )
// // .style('fill' , 'black') 
//       g.selectAll("text")
//       .data(data)
//       .enter()
//       .append('text')
//       .text(d=>(d.value+ " M₽"))
//       .attr('x', '120' )
//       .attr('y', d=>y(d.year) +20 )
//       .style('fill' , function(data){
//         // console.log(datas , "DATAS")
//         // console.log(new_d , "DATAS new")
//         // console.log(data , "fill parameter")
//         return '#fff'
//       })
//       .style('font-size' , '10px') 
//       // .attr()
//     });
//   }
