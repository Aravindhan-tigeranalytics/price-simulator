import { Component, OnInit ,ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts'
import addMore from "highcharts/highcharts-more"
import {MatAccordion} from '@angular/material/expansion';
addMore(Highcharts)
@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.scss']
})
export class DashHomeComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  
highcharts = Highcharts;
categories  = ["Retail Sales Value,RSV(w/o VAT)", "Trade Expense", "Net Sales Value, NSV", "COGS", "Mars MAC", "Retailer Margin"]
categories_perton  = ["RSV(w/o VAT)/Ton", "Trade Expense / Ton", "NSV/Ton", "COGS/Ton", "Mars MAC/Ton", "Retailer Margin/Ton"]
data = [ [0,6940],
        [4157, 4157 + 1636],
        [0,4157],
        [0,1869],
        [1869,1869 + 2288],
        [4157 , 4157+2783],
        ]
        data_perton = [ [0,0.679],
        [0.407, 0.407 + 0.160],
        [0,0.407],
        [0,0.183],
        [0.183,0.183 + 0.224],
        [0.407 , 0.407+0.272],
        ]
        
categories_2 = ['Mars MAC,% of NSV' , 'Retailer Margin,% of RSP']
categories_3 = ['Base Units' , 'New Units']
category_change= ['RSV w/o VAT $ chg','Trade expense $ chg','NSV $ chg','COGS $ chg','Mars MAC $ chg','Retailer Margin $ chg']
data_2 = [55.03 , 40.10];
data_3 = [266.15 , 266.15];
data_change = [[0.00,0.00,0.00,0.00,0.00,0.00],[0.00,0.00,0.00,0.00,0.00,0.00]]; 
chartOptions = this.getChartOption("Base scenario" , this.categories , this.data,"columnrange");
chartOptions_1 = this.getChartOption("New scenario" , this.categories, this.data , "columnrange");
chartOptions_2 = this.getChartOptionColumn("Base scenario" , this.categories_2,this.data_2 , "column")
chartOptions_3 = this.getChartOptionColumn("New scenario" , this.categories_2,this.data_2 , "column")
chartOptions_4 = this.getChartOptionColumn("Change in Units" , this.categories_3,this.data_3 , "column")
chartOptions_change = this.getChartOptionColumnYaxis("change" , this.category_change,this.data_change , "column")
chartOptionPerTonBase = this.getChartOption("Base scenario" , this.categories_perton , this.data_perton,"columnrange");
chartOptionPerTonNew = this.getChartOption("New scenario" , this.categories_perton , this.data_perton,"columnrange");

  
  constructor() { }

  ngOnInit(): void {
  }
  getChartOptionColumn(title , categories , data_array , type){
    return {   
      chart: {
        type: type,
    },
    
    title: {
     text:title
    },
    xAxis: {
      categories:categories
    },
    yAxis: {
      title: {
        text: 'Percentage'
    }
  },
 
    
    tooltip: {
      formatter: function() {
       
        return this.y + '%'
           ;
      }
    },
     
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function() {
           
              return  this.y + "%"
    
                
          }
        }
      }
    },
    
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
       data : data_array,
        
    }]
    }

  }

  getChartOptionColumnYaxis(title , categories , data_array , type){
    return {   
      chart: {
        type: type,
    },
    
    title: {
     text:title
    },
    yAxis: [{
      title: {
        text: 'Value Change(Millions) '
    }
  },
  {
    title: {
      text: '% Change'
  },
  opposite : true
}
],
 
    xAxis: {
      categories:categories
    },
    
    tooltip: {
      formatter: function() {
       
        return this.y + '%'
           ;
      }
    },
     
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function() {
           
              return  this.y + "%"
    
                
          }
        }
      }
    },
    
    legend: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name:"Value change",
      data : data_array[0],
       zones: [{
         value: 1,
         color: '#47475C',
     } , {
         
     }]
   },
 {
  name : '% Change',
   data: data_array[1],
   yAxis: 1,
  
 }
]
    }

  }

  getChartOption(title , categories , data_array , type){
    console.log(data_array , "DATAARRAY")
   return {   
      chart: {
        type: type,
    },
    
    title: {
     text:title
    },
    xAxis: {
      categories:categories
    },
    yAxis: {
      title: {
        text: 'Millions'
    }
  },
 
      
     
 
    
    // yAxis: {
      
    // },
    tooltip: {
      formatter: function() {
        // console.log(this.point , "POINT")
        return '<b>' + (this.point.high - this.point.low).toFixed(3) + ' ₽</b>'
           ;
      }
    },
     
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function() {
            // console.log("FORMATTER " , this)
            if(this.y != this.point.low){
              let value = (this.point.high - this.point.low)
              if(value % 1 !=0){
                return value.toFixed(3) + "₽"

              }
              else{
                return value + "₽"

              }
             
    
            }       
          }
        }
      }
    },
    
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
       data : data_array,
        zones: [{
          value: 0.1,
          color: '#47475C',
      } , {
        // value: 0.1,
        // color: '#47475C',
          
      }]
    },
  // {
  //   data: data_array,
  //   yAxis: 1,
  //   name : 'Millions'
  // }
]
    }
  }

}
