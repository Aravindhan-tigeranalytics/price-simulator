import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject,ReplaySubject, Subject, throwError } from 'rxjs';
import { UnitModel, NewUnit } from '../models/unit';
import { SimulatedArray } from '../../shared/models/input';
import {ApiService} from "./api.service"
import {  FormGroup } from '@angular/forms';
// import { debug } from 'console';
@Injectable()
export class PriceScenarioService {

  // private newUnitObservable = new BehaviorSubject<NewUnit[]>([]);
  simulatedArrayObservable = new BehaviorSubject<SimulatedArray[]>([]);
 private newUnitObservableSubject = new BehaviorSubject<NewUnit[]>([]);
 public  newUnitObservable =this.newUnitObservableSubject.asObservable()
  newUnitChangeObservable = new BehaviorSubject<NewUnit[]>([]);
  categoryFilterObservable = new BehaviorSubject<NewUnit[]>([]);
  productFilterObservable = new BehaviorSubject<any[]>([]);
  retailerFilterObservable = new BehaviorSubject<NewUnit[]>([]);
  initData = new BehaviorSubject<NewUnit[]>([]);

  constructor(private api : ApiService) {

    let data = this.api.getData()
    //  this.api.getData().subscribe(data=>{
       this.newUnitObservableSubject.next(data)
       this.newUnitChangeObservable.next(data)
       this.initData.next(data)
       console.log(data , " calling next in constructor")
    //  })
   }
   public getUnitValue(){
     return this.newUnitObservableSubject.getValue()
   }
   public setNewChange(data : NewUnit[]){
     this.newUnitChangeObservable.next(data)
   }
   public getNewChange():Observable<NewUnit[]>{
     return this.newUnitChangeObservable.asObservable()
   }

   public  getProductFilter():Observable<any[]>{
    return this.productFilterObservable.asObservable()
    }
      public getSimulatedArray(): Observable<SimulatedArray[]> {
        return this.simulatedArrayObservable.asObservable();
      }
      public setSimulatedArray(simulatedArray: SimulatedArray[]) {
        // console.log("setsimulated")
        this.simulatedArrayObservable.next(simulatedArray);
      }
      public filterTableData(category , product , retailer){
        let units = this.initData.getValue()
        console.log(units , "UNITS")
        if (category && category.length > 0) {
          units = units.filter((unit) => category.includes(unit.category));
        }
        if ( product && product.length > 0) {
          units = units.filter((unit) =>
            product.includes(unit.product_group)
          );
        }
        if (retailer && retailer.length > 0) {
          units = units.filter((unit) => retailer.includes(unit.retailer));
        }
        // this.newUnitObservable.next(units);  
        console.log("setting null")
        this.setUnits(units)

      }
      public filterSimulatedSummary(products){
        let simulated = this.simulatedArrayObservable.getValue();
        if(products){
          simulated = simulated.filter(d=>products.includes(d.key))
        console.log(simulated , "SIMULATED OBSERVABLE")
        this.simulatedArrayObservable.next(simulated)
        }
        
      }
    
      public getUnits(): Observable<NewUnit[]> {
        console.log("getting units ")
        return this.newUnitObservableSubject.asObservable();
      }
      public setUnits(data : NewUnit[]){
        console.log("setting units ")
        this.newUnitObservableSubject.next(data);
      }
      public getUnitsChange(): Observable<NewUnit[]> {
        return this.newUnitChangeObservable.asObservable();
      }
      public updateUnits(form: FormGroup) {
        let units: NewUnit[] = this.newUnitObservableSubject.getValue();
        //  / debugger;
        // let units = unit;
    
        // console.log(units, 'BEFORE MANIPULATION');
        // units.forEach((data)=>{
        //   var clone = {...data}
          
        // })
    
        units.forEach((data) => {
          // for(const i in form){}
          if (data.product_group in form) {
            let val = form[data.product_group];
            // console.log(form[data.product_group] , "ITERATION VALUES")
            data.lpi_percent = Number(val.lpi_increase) / 100;
            data.rsp_increase_percent = Number(val.rsp_increase) / 100;
            data.cogs_increase_percent = Number(val.cogs_increase) / 100;
            data.base_price_elasticity = val.base_price_elasticity;
            data.updateValues();
            // this.update_values(data, form[data.product_group]);
          }
        });
    
        // debugger;
        // let units: NewUnit[] = this.newUnitObservable.getValue();
        // console.log(units, 'UNITS BEFORE');
    
        // units.forEach((data) => {
        //   if (data.product_group == 'ORBIT OTC' && data.retailer == 'Magnit') {
        //     this.update_values(data, form.value.orbit_otc_magnit);
        //   }
        //   if (data.product_group == 'ORBIT OTC' && data.retailer == 'X5') {
        //     this.update_values(data, form.value.orbit_otc_x5);
        //   }
        //   if (data.product_group == 'ORBIT XXL' && data.retailer == 'Magnit') {
        //     this.update_values(data, form.value.orbit_xxl_magnit);
        //   }
        // });
        // console.log(units, 'UNITS AFTER');
        console.log("caling next in fn")
        this.newUnitObservableSubject.next(units);
      }
      private isExists(arr:any[],prod , retailer){
        // debugger;
        // console.log(arr , "ARRRRRR")
        // console.log(prod , "PROD")
        return arr.find(d=>(d.product_group == prod))
        // arr.includes(d=>d.)
    
    
      }
      private checkForDirty(form_dirty ,prod ){
        return form_dirty[prod]
      }
      public updateSimulatedvalue(unit: NewUnit[], form_dirty,arr, lpi?, rsp?, cogs?) {
    
        // console.log(lpi, rsp, cogs, 'DATES');
        // console.log(arr , "ARR")
        // let units: NewUnit[] = this.newUnitObservable.getValue();
        // debugger;
        // debugger;
        // let units = this.newUnitObservable.getValue();
        // unit.filter()
        // if(lpi){
        //   unit = unit.filter(d=>(lpi <=d.date))
        // }
        // if(rsp){
        //   unit = unit.filter(d=>(rsp <=d.date))
        // }
        // if(cogs){
        //   unit = unit.filter(d=>(cogs <=d.date))
        // }
        let units = unit
    
        // console.log(units, 'BEFORE MANIPULATION');
        var cloned= []
    
        units.forEach((data) => {
          var clone = Object.create(data) as NewUnit
          // // {...data} as NewUnit
          // console.log(data , "ACTUAL DATA ")
          // console.log(clone , "CLONED DATA")
          
          
          // for(const i in form){}
          let val = this.isExists(arr,clone.product_group , clone.retailer)
          // console.log(val , "VAL LLLL")
          if (val) {
             
            // console.log(form[data.product_group] , "ITERATION VALUES")
            if (lpi && Number(val.lpi_increase) > 0) {
              if (lpi <= clone.date) {
                clone.lpi_percent = Number(val.lpi_increase) / 100;
              }
            } else {
              // debugger;
              clone.lpi_percent = Number(val.lpi_increase) / 100;
            }
            if (rsp && Number(val.rsp_increase) > 0) {
              if (rsp <= clone.date) {
                clone.rsp_increase_percent = Number(val.rsp_increase) / 100;
              }
            } else {
              clone.rsp_increase_percent = Number(val.rsp_increase) / 100;
            }
            if (cogs && Number(val.cogs_increase) > 0) {
              if (cogs <= clone.date) {
                clone.cogs_increase_percent = Number(val.cogs_increase) / 100;
              }
            } else {
              clone.cogs_increase_percent = Number(val.cogs_increase) / 100;
            }
    
            // data.rsp_increase_percent = Number(val.rsp_increase) / 100;
            if(form_dirty && this.checkForDirty(form_dirty , val.product_group)){
              clone.base_price_elasticity = Number(val.base_price_elasticity);

            }
    
            
            clone.competition = val.competition;
            clone.updateValues();
          //   console.log(data , "ACTUAL DATA ")
          // console.log(clone , "CLONED DATA")
          
          
            cloned.push(clone)
            // this.update_values(data, form[data.product_group]);
          }
        });
    
        // console.log(units, 'AFTER MANIPULATION');
        return cloned;
        // }
      }
    
    
}
