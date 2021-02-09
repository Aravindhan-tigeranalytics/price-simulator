import { Component, OnInit, ViewChild } from '@angular/core';
 
import * as d3 from 'd3';
import { ApiService } from '../../shared/services/api.service';
 
import * as Utils from '../../shared/utils/utils'
import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
} from 'rxjs/operators';

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.scss'],
})
export class DashHomeComponent implements OnInit {
   ele = '#my_dataviz';
  margin = { top: 20, right: 20, bottom: 30, left: 10 };
  width = 890 - this.margin.left - this.margin.right;
  height = 300 - this.margin.top - this.margin.bottom;
      
svg = d3.select(this.ele).append("svg")
.attr("width", this.width + this.margin.left + this.margin.right)
.attr("height", this.height + this.margin.top + this.margin.bottom)

g = this.svg.append("g")
.attr("transform", "translate(" + this.margin.left + "," +  this.margin.top + ")");

x0 = d3.scaleBand()
.rangeRound([0, this.width])
.paddingInner(0.1);

x1 = d3.scaleBand()
.padding(0.05);

y =  d3.scaleLinear()
.rangeRound([this.height, 0]);

z = d3.scaleOrdinal()
.range(["var(--color-blue-1)","var(--color-amber-1)"]);

xAxisGroup =  this.g.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + this.height + ")")

yAxisGroup =   this.g.append("g")
.attr("class", "axis")

text1 =   this.g.append('g')
text2 =  this.g.append('g') 

 rect = this.g.append("g")
 .selectAll("g")
 legend;

   constructor(private apiservice: ApiService) {}
   gen(){
    if (getRandomInt(0,1) == 0){
      console.log(0 , "random data1")
      this.update(this.getData1(),this.x0,this.x1,this.y,this.g,this.height,this.width,
      this.z,this.svg,this.xAxisGroup,this.yAxisGroup,this.text1,this.text2,this.rect,this.legend)
    }
    else{
      console.log(1 , "random data2")
      this.update(this.getData2(),this.x0,this.x1,this.y,this.g,this.height,this.width,this.z,
      this.svg,this.xAxisGroup,this.yAxisGroup,this.text1,this.text2,this.rect,this.legend)
    }
   }
  ngOnInit(): void {
    this.ele = '#my_dataviz';
    this.margin = { top: 20, right: 20, bottom: 30, left: 10 };
  this.width = 890 - this.margin.left - this.margin.right;
  this.height = 300 - this.margin.top - this.margin.bottom;
      
  this.svg = d3.select(this.ele).append("svg")
.attr("width", this.width + this.margin.left + this.margin.right)
.attr("height", this.height + this.margin.top + this.margin.bottom)

this.g = this.svg.append("g")
.attr("transform", "translate(" + this.margin.left + "," +  this.margin.top + ")");

this.x0 = d3.scaleBand()
.rangeRound([0, this.width])
.paddingInner(0.1);

this.x1 = d3.scaleBand()
.padding(0.05);

this.y =  d3.scaleLinear()
.rangeRound([this.height, 0]);

this.z = d3.scaleOrdinal()
.range(["var(--color-blue-1)","var(--color-amber-1)"]);

this.xAxisGroup =  this.g.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + this.height + ")")

this.yAxisGroup =   this.g.append("g")
.attr("class", "axis")

this.text1 =   this.g.append('g')
this.text2 =  this.g.append('g') 

 this.rect = this.g.append("g")
 .selectAll("g")
 this.legend = this.g.append("g")
 .attr("class", "legend")
 .attr("font-family", "sans-serif")
 .attr("font-size", 10)
 .attr("text-anchor", "end")
 
   this.update(this.getData1(),this.x0,this.x1,this.y,this.g,this.height,this.width,this.z,
   this.svg,this.xAxisGroup,this.yAxisGroup,this.text1,this.text2,this.rect,this.legend)
     
     }
     update(data,x0,x1,y,g,height,width,z,svg , xAxisGroup,yAxisGroup,text1,text2,rects ,legend){
       const trans = d3.transition().duration(750)
      var keys = Object.keys(data[0]).slice(1);
      legend

              .selectAll("g")
              .data(keys.slice().reverse())
              .remove()
              .exit()

       
      x0.domain(data.map(function (d) { return d.State; }));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      console.log(legend , "legend data")
      console.log(keys , "KEYS ")
      // const rects
      g.selectAll("rect")
      .remove()
     
      .exit()
     
      .data(data)	
      .transition(trans)
 
      text1.selectAll("text")
      .remove()
      .exit()
      .data(data)	
      text2.selectAll("text")
      .remove()
      .exit()
      .data(data)	
      
  
    
      
      y.domain([0, d3.max(data,
         function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();
  
        
  
  
    
     
    rects.data(data).enter().append("g")
    .attr("transform", function (d) { return "translate(" + x0(d.State) + ",0)"; })
    .selectAll("rect")
    .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
    .enter().append("rect")
    .transition(trans)
    .attr("x", function (d) { return x1(d.key); })
    
    .attr("width", x1.bandwidth())
    .attr("y", y(0))
    .attr("height",0)
    
    .transition(trans)
    .attr("y", function (d) { return y(d.value); })
    .attr("height", function (d) { return height - y(d.value); })
    .attr("fill", function (d) { return z(d.key); })
    .attr("fill-opacity" , 1)
    // .transition(d3.transition().duration(500))
    
    
  
  
    xAxisGroup.transition(trans).call(d3.axisBottom(x0));
   
 var t =  legend

              .selectAll("g")
              .data(keys.slice().reverse())
 
              
              .enter().append("g")
              .attr("transform", function (d, i) { 
                console.log(d,i , "DDIIDDDII")
                return "translate(0," + i * 20 + ")"; 
              })
  
          t.append("rect")
              .attr("x", width - 19)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", z)
             
              t.append("text")
              .attr("x", width - 24)
              .attr("y", 9.5)
              .attr("dy", "0.32em")
              .attr("fill", z)
              .text(function (d) { 
                console.log(d,"DDDDDDDDDDDDDDDD")
                return d; 
              });
  
  console.log(legend , "Legend text")
            text1.selectAll("text")
            
              .data(data)
              .enter()
              .append('text')
              .text(function(d){
                console.log(d , "TEXT1")
                return Utils.convertCurrency(d.Base)
              } )
              .attr('x', function(d,i){
                // debugger
                
                return x0(d.State) + 10
              } )
              .attr('y', function(d,i){
                console.log(d,i , "TEXYT")
                
                return y(d.Base) - 10
              })
              .style('fill' , function(data){
                     return 'black'
              })
              .style('font-size' , '12px') 
             
             text2
             .selectAll("text")
              .data(data)
              .enter()
              .append('text')
              .text(function(d){
                console.log(d , "TEXT2")
                // debugger
                 return Utils.convertCurrency(d.Simulated)
              }  )
              .attr('x', function(d,i){
               
                return x0(d.State) + x1.bandwidth() + 10
              } )
              .attr('y', function(d,i){
                console.log(d,i , "TEXYT")
                
                return y(d.Simulated) -10
              })
              .style('fill' , function(data){
                     return 'black'
              })
              .style('font-size' , '12px') 
             
  
    }
     getData1(){
      let num = 0;
      let num2 = 0;
     
      let d = [
        
              {
        "State": "Customer Margin",
       
        "Base":  10+ num,
        "Simulated":  15+ num2,
     
     },
          {
             "State": "LSV",
             
             "Base": 56 + num,
             "Simulated": 23 + num2,
            
          },
        
          {
             "State": "Trade Expense",
            
             "Base": 90 + num,
             "Simulated":  87 + num2,
            
          },
          {
             "State": "Net Sales Value",
           
             "Base":  87 + num,
             "Simulated": 34 + num2,
            
          },
          {
            "State": "MARS MAC",
           
            "Base": 77 + num,
            "Simulated":  90 + num2,
          
         },
          {
             "State": "COGS",
             
             "Base": 44 + num ,
             "Simulated": 55 + num2,
            
          },
       
         
       ]
                return d
    
    }
  
     getData2(){
      let num = 100;
      let num2 = 100;
     
      let d = [
        
              {
        "State": "Customer Margin",
       
        "Base":  10+ num,
        "Simulated":  15+ num2,
     
     },
        //   {
        //      "State": "LSV",
             
        //      "Base": 56 + num,
        //      "Simulated": 23 + num2,
            
        //   },
        
        //   {
        //      "State": "Trade Expense",
            
        //      "Base": 90 + num,
        //      "Simulated":  87 + num2,
            
        //   },
        //   {
        //      "State": "Net Sales Value",
           
        //      "Base":  87 + num,
        //      "Simulated": 34 + num2,
            
        //   },
        //   {
        //     "State": "MARS MAC",
           
        //     "Base": 77 + num,
        //     "Simulated":  90 + num2,
          
        //  },
        //   {
        //      "State": "COGS",
             
        //      "Base": 44 + num ,
        //      "Simulated": 55 + num2,
            
        //   },
       
         
       ]
                return d
    
    }
  
  
     draw3(){
      var margin = {top: 50, right: 50, bottom: 50, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
 
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const dataset = [
      { 'apples': 6940, 'oranges': 131 },
      { 'apples': 1636, 'oranges': 7 },
      { 'apples': 4157, 'oranges': 11 },
      { 'apples': 1870, 'oranges': 31 },
      { 'apples': 2288, 'oranges': 19 },
      { 'apples': 2783, 'oranges': 119 },
    ];
    var colors = ['var(--color-amber-1)', 'var(--color-blue-1)']

    var colorss = d3.scaleOrdinal(colors)
     
    var stack = d3.stack()
    .keys([ "apples", "oranges" ])
    console.log(stack , "STACK")

    var series = stack(dataset)
    console.log(dataset , "DATA SET TTTT")
    console.log(series , "SERIES")

  
    var xScale =  d3
    .scaleLinear()
        .domain([ 0, d3.max(dataset, d => d.apples + (d.oranges)  )])
        .range([0,width]);
    
    var yScale = d3
    .scaleBand()
    .range([0,height])
    .domain(d3.range(dataset.length))
    .paddingInner(0.1);
   
    var axis = svg.append('g')
    .attr('class', 'axis')

var bars = svg.append('g')
    .attr('class', 'bars')

    var rangeData= d3.range(10, 100, 10)
    console.log(rangeData , "RANGE DATA ")

    // var grid = axis.append('g').attr('class', 'grid')

    // grid.selectAll('line.grid-line')
    // .data(rangeData)
    // .enter()
    // .append('line')
    // .attr('x1', '0%')
    // .attr('x2', width)
    // .attr('y1', d => yScale(d))
    // .attr('y2', d => yScale(d))
    // .attr('stroke-width', 1)
    // .attr('stroke', 'rgb(207, 207, 207)')

    svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale)
    .tickPadding(12)
    .tickSizeInner(0)
    .tickSizeOuter(0))

    svg.append('g')
    .call(d3.axisLeft(yScale)
    .ticks(10)
    .tickPadding(12)
    .tickSizeInner(0)
    .tickSizeOuter(0))
  

    var groups = bars.selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .style("fill", (d, i) => colorss(i))
    console.log(groups , "GROUP")
  
    var rects = groups.selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", function(d,i){
      console.log( xScale(d[1]) , "XSCALE XX")
      console.log(d, i , "D I XXXX")
     
      let xs = xScale(d[0])
     
      return xs
    })
    .attr("y", function(d,i){
      let ys = yScale(i)
      console.log(d, "D YYYY")
      console.log(ys , "Y SCALE ")
      return ys
    })
    
    .attr("height",  function(d){
      let ysc = yScale.bandwidth()
      console.log(ysc , "Y SCALE")
      return ysc
    })
    .attr("width", function(d,i){
      
      let wid = (xScale(d[1]) - xScale(d[0]));
      console.log(d , i ,"D I WIDTH ")
      console.log( xScale(d[0]) , "WIDTH d[0]")
      console.log( xScale(d[1]) , "WIDTH d[1]")
      
      console.log(wid , "WIDTH ")
      return wid
    })
   
   
    
  

     }

     draw2(){
      var margin = {top: 50, right: 50, bottom: 50, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
 
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const dataset = [
      { 'apples': 6940, 'oranges': 131 },
      { 'apples': 1636, 'oranges': 7 },
      { 'apples': 4157, 'oranges': 11 },
      { 'apples': 1870, 'oranges': 31 },
      { 'apples': 2288, 'oranges': 19 },
      { 'apples': 2783, 'oranges': 119 },
    ];
    var colors = ['var(--color-amber-1)', 'var(--color-blue-1)']

    var colorss = d3.scaleOrdinal(colors)
     
    var stack = d3.stack()
    .keys([ "apples", "oranges" ])
    console.log(stack , "STACK")

    var series = stack(dataset)
    console.log(dataset , "DATA SET TTTT")
    console.log(series , "SERIES")

  
    var xScale =  d3
    .scaleLinear()
        .domain([ 0, d3.max(dataset, d => d.apples + (d.oranges)  )])
        .range([width, 0]);
    
    var yScale = d3
    .scaleBand()
    .range([height, 0])
    .domain(d3.range(dataset.length))
    .paddingInner(0.1);
   
    var axis = svg.append('g')
    .attr('class', 'axis')

var bars = svg.append('g')
    .attr('class', 'bars')

    var rangeData= d3.range(10, 100, 10)
    console.log(rangeData , "RANGE DATA ")

    // var grid = axis.append('g').attr('class', 'grid')

    // grid.selectAll('line.grid-line')
    // .data(rangeData)
    // .enter()
    // .append('line')
    // .attr('x1', '0%')
    // .attr('x2', width)
    // .attr('y1', d => yScale(d))
    // .attr('y2', d => yScale(d))
    // .attr('stroke-width', 1)
    // .attr('stroke', 'rgb(207, 207, 207)')

    svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale)
    .tickPadding(12)
    .tickSizeInner(0)
    .tickSizeOuter(0))

    svg.append('g')
    .call(d3.axisLeft(yScale)
    .ticks(10)
    .tickPadding(12)
    .tickSizeInner(0)
    .tickSizeOuter(0))
  

    var groups = bars.selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .style("fill", (d, i) => colorss(i))
    console.log(groups , "GROUP")
  
    var rects = groups.selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", function(d,i){
     
      let xs = xScale(d[1])
      console.log(xs , "XSCALE XX")
      console.log(d, i , "D I XXXX")
      return xs
    })
    .attr("y", function(d,i){
      let ys = yScale(i)
      console.log(d, "D YYYY")
      console.log(ys , "Y SCALE ")
      return ys
    })
    
    .attr("height",  function(d){
      let ysc = yScale.bandwidth()
      console.log(ysc , "Y SCALE")
      return ysc
    })
    .attr("width", function(d,i){
      
      let wid = (xScale(d[0]) - xScale(d[1]));
      console.log(d , i ,"D I WIDTH ")
      console.log( xScale(d[0]) , "WIDTH d[0]")
      console.log( xScale(d[1]) , "WIDTH d[1]")
      
      console.log(wid , "WIDTH ")
      return wid
    })
   
   
    
  

     }
     draw(){
      var margin = {top: 50, right: 50, bottom: 50, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  // Parse the Data
  
    // group,Nitrogen,normal,stress
    // banana,12,1,13
    // poacee,6,6,33
    // sorgho,11,28,12
    // triticum,19,6,1
    // const dataset = [
    //   { apples: 5, oranges: 10, grapes: 4, pears: 10, bananas: 6 },
    //   { apples: 4, oranges: 12, grapes: 7, pears: 13, bananas: 32 },
    //   { apples: 21, oranges: 19, grapes: 2, pears: 2, bananas: 7 },
    //   { apples: 7, oranges: 23, grapes: 8, pears: 4, bananas: 3 },
    //   { apples: 5, oranges: 10, grapes: 12, pears: 5, bananas: 9 },
    //   { apples: 4, oranges: 12, grapes: 8, pears: 7, bananas: 3 },
    //   { apples: 15, oranges: 10, grapes: 14, pears: 8, bananas: 0 },
    //   { apples: 4, oranges: 12, grapes: 44, pears: 21, bananas: 11 },
    //   { apples: 21, oranges: 19, grapes: 11, pears: 10, bananas: 11 },
    //   { apples: 7, oranges: 23, grapes: 43, pears: 2, bananas: 7 },
    //   { apples: 23, oranges: 19, grapes: 22, pears: 11, bananas: 6 },
    //   { apples: 7, oranges: 23, grapes: 5, pears: 8, bananas: 3 },
    //   { apples: 5, oranges: 10, grapes: 12, pears: 5, bananas: 9 },
    //   { apples: 4, oranges: 12, grapes: 8, pears: 7, bananas: 3 },
    //   { apples: 15, oranges: 10, grapes: 14, pears: 8, bananas: 0 },
    //   { apples: 23, oranges: 17, grapes: 17, pears: 17, bananas: 1 }
    // ];

    const dataset = [
      { 'apples': 10, 'oranges': 5 },
      { 'apples': 10, 'oranges': 5 },
      { 'apples': 10, 'oranges': 5 },
      { 'apples': 10, 'oranges': 5 },
      { 'apples': 10, 'oranges': 5 },
      // { apples: 4, oranges: 12, grapes: 8, pears: 7, bananas: 3 },
      // { apples: 15, oranges: 10, grapes: 14, pears: 8, bananas: 0 },
      // { apples: 4, oranges: 12, grapes: 44, pears: 21, bananas: 11 },
      // { apples: 21, oranges: 19, grapes: 11, pears: 10, bananas: 11 },
      // { apples: 7, oranges: 23, grapes: 43, pears: 2, bananas: 7 },
      // { apples: 23, oranges: 19, grapes: 22, pears: 11, bananas: 6 },
      // { apples: 7, oranges: 23, grapes: 5, pears: 8, bananas: 3 },
      // { apples: 5, oranges: 10, grapes: 12, pears: 5, bananas: 9 },
      // { apples: 4, oranges: 12, grapes: 8, pears: 7, bananas: 3 },
      // { apples: 15, oranges: 10, grapes: 14, pears: 8, bananas: 0 },
      // { apples: 23, oranges: 17, grapes: 17, pears: 17, bananas: 1 }
    ];
    var colors = ['var(--color-amber-1)', 'var(--color-blue-1)']

    var colorss = d3.scaleOrdinal(colors)
     
    var stack = d3.stack()
    .keys([ "apples", "oranges" ])
    console.log(stack , "STACK")

    var series = stack(dataset)
    console.log(dataset , "DATASET ")
  console.log(series , "SERIES ")
    var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .paddingInner(0.25)
    .paddingOuter(0.35)
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.apples + d.oranges  )])
    .range([height, 0])
  
    // Add X axis
    var axis = svg.append('g')
    .attr('class', 'axis')

var bars = svg.append('g')
    .attr('class', 'bars')

    var rangeData= d3.range(10, 100, 10)
    console.log(rangeData , "RANGE DATA ")

    var grid = axis.append('g').attr('class', 'grid')

    grid.selectAll('line.grid-line')
    .data(rangeData)
    .enter()
    .append('line')
    .attr('x1', '0%')
    .attr('x2', width)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke-width', 1)
    .attr('stroke', 'rgb(207, 207, 207)')

    svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale)
    .tickPadding(12)
    .tickSizeInner(0)
    .tickSizeOuter(0))

    svg.append('g')
    .call(d3.axisLeft(yScale)
    .ticks(10)
    .tickPadding(12)
    .tickSizeInner(0)
    .tickSizeOuter(0))
  
    svg.append('text')
    .attr('class', 'label')
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top) + ")")
    .style('text-anchor', 'middle')
    .text('Label')
  
    svg.append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('y', 4 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Label')
  

    var groups = bars.selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .style("fill", (d, i) => colorss(i))
    console.log(groups, "GROups")
  
    var rects = groups.selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", function(d,i){
      let x =  xScale(i)
      console.log(x, " XXXX")
      console.log(d ,i , "D I XXXX")
      return x
    })
    .attr("y", function(d , i){
      let y = yScale(d[1])
      console.log(y , "YYYYY")
      console.log(d, i , "D I YYY ")
      return y
    })
    .attr("height",function(d){
     let t =   yScale(d[0]) - yScale(d[1])
  
     console.log(t , "HEIht T")
      console.log(d , "HEIGHT D ")
      return t
    })
    .attr("width",function(){
     let xs =  xScale.bandwidth()
     console.log(xs, "XSCALE")
     return xs
    })
   
 
  

     }
    }
  