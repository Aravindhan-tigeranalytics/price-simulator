import { Component, OnInit,ViewEncapsulation,Input,OnChanges } from '@angular/core';
import { SimulatedArray, SimulatedSummary } from '../shared/models/input';

@Component({
  selector: 'app-simulate-scenario-modal',
  templateUrl: './simulate-scenario-modal.component.html',
  styleUrls: ['./simulate-scenario-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimulateScenarioModalComponent implements OnInit, OnChanges {
  // headers = ['ORBIT OTC','ORBIT XXL','BIG BARS','BIG BARS SNICKERSCRISPER','BIG BARS SNICKERSCRISPER DUO','STD BARS','STD BARS MILKYWAY']
  headers = []
  isCHG=false
  variables = ['Volume (Tonnes)','RSV w/o VAT' , 'Customer Margin' , 'NSV' , 'MAC']
  year = []
  @Input() simulatedData : {value:SimulatedArray,year:number}[];
  constructor() { }

  ngOnInit(): void {
    console.log(this.simulatedData , "simulated DATA from app-simulate-scenario-modal")
    this.getDistinctData(this.simulatedData)
  }
  toggleChange(event){
    this.isCHG = event.checked
    console.log(event.checked , "chencked")
  }
  getValue(year,key,variable){
   let val =  this.simulatedData.filter(d=>d.year == year).find(d=>d.value.key == key)
   
    return this.getVariableObj(variable , this.isCHG?val.value.percent_change: val.value.absolute_change )
  }
  getVariableObj(metric , obj:SimulatedSummary){
    switch (metric) {
      case metric = this.variables[0]: {
        return obj.tonnes
      }
  
      case metric = this.variables[1]: {
  
        return obj.rsv
      }
      case metric = this.variables[2]: {
  
        return obj.rp
      }
      case metric = this.variables[3]: {
  
        return obj.nsv
      }
      case metric = this.variables[4]: {
  
        return obj.mac
      }
      
      default: {
        return 0
  
      }
    }
  }
  getDistinctData(data :{value:SimulatedArray,year:number}[]){
    // let headers = []
if(data.length > 0){
  data.forEach(d=>{
    if(!this.year.includes(d.year)){
      this.year.push(d.year)

    }
    if(!this.headers.includes(d.value.key)){
      this.headers.push(d.value.key)

    }
  })
  

}
  }
  ngOnChanges(changes){
    console.log(changes , "CHANGESss+")
  }

}
