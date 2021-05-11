import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject,ReplaySubject, Subject, throwError, of,combineLatest,forkJoin } from 'rxjs';
import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
  switchMap,

} from 'rxjs/operators';
import { UnitModel, NewUnit } from '../models/unit';
// import { SimulatedArray } from '../../shared/models/input';
import {
  SimulatorInput,
  SimulatedSummary,
  SimulatedArray,
  ClassObj,
} from '../../shared/models/input';
import {ApiService} from "./api.service"
import {  FormGroup } from '@angular/forms';
// import { ThrowStmt } from '@angular/compiler';
// import { debug } from 'console';
@Injectable()
export class PriceScenarioService {

  // private newUnitObservable = new BehaviorSubject<NewUnit[]>([]);
  simulatedArrayObservable = new BehaviorSubject<SimulatedArray[]>([]);
 private newUnitObservableSubject = new BehaviorSubject<NewUnit[]>([]);
 private yearlyUnits = new BehaviorSubject<NewUnit[]>([])
 public yearlyUnitsObservable = this.yearlyUnits.asObservable()
 private initYearlyUnits = new BehaviorSubject<NewUnit[]>([])
 public initYearlyUnitsObservable = this.initYearlyUnits.asObservable()
//  public  newUnitObservable =this.newUnitObservableSubject.asObservable()
  newUnitChangeObservable = new BehaviorSubject<NewUnit[]>([]);
  categoryFilterObservable = new BehaviorSubject<NewUnit[]>([]);
  productFilterObservable = new BehaviorSubject<any[]>([]);
  retailerFilterObservable = new BehaviorSubject<NewUnit[]>([]);
  initData = new BehaviorSubject<NewUnit[]>([]);

  constructor(private api : ApiService) {

    // this.api.getScenarioMetrics().subscribe(data=>{
    //   this.yearlyUnits.next(data)
    //   this.initYearlyUnits.next(data)
    //   // this.newUnitChangeObservable.next(data)
    //   // this.initData.next(data)
    // })
    let data = this.api.getData()
       this.newUnitObservableSubject.next(data)
       this.newUnitChangeObservable.next(data)
       this.initData.next(data)
        
     
   }
   public getInitUnits():Observable<NewUnit[]>{
     return this.initData.asObservable()
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
      public filterYear(year){

        let units = this.initYearlyUnits.getValue()
        // console.log(units , "UNITS ")
        if(year){
          units = units.filter((unit) => unit.year == year); 
          this.yearlyUnits.next(units)
        }

      }
      public filterTableData(category , product , retailer ){
        let units = this.initData.getValue()
       
        
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
      public filterTableDataYear(category , product , retailer,cell , brand,brand_format ,year ){
        let units = this.initYearlyUnits.getValue()

        if(year){
          units = units.filter((unit) => unit.year == year); 
        }
       
        
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
        if (cell && cell.length > 0) {
          units = units.filter((unit) => cell.includes(unit.strategic_cell_filter));
        }
        if (brand && brand.length > 0) {
          units = units.filter((unit) => brand.includes(unit.brand_filter));
        }
        if (brand_format && brand_format.length > 0) {
          units = units.filter((unit) => brand_format.includes(unit.brand_format_filter));
        }
        // this.newUnitObservable.next(units);  
         
        this.yearlyUnits.next(units)

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
        
    
        units.forEach((data) => {
          
          if (data.product_group in form) {
            let val = form[data.product_group];
             
            data.lpi_percent = Number(val.lpi_increase) / 100;
            data.rsp_increase_percent = Number(val.rsp_increase) / 100;
            data.cogs_increase_percent = Number(val.cogs_increase) / 100;
            data.base_price_elasticity = val.base_price_elasticity;
            data.updateValues();
          
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
      public updateSimulatedvalueYearly(formArray){
        let units = this.initYearlyUnits.getValue()
        return formArray.map(d=>this.updateSimulatedvalue(units.filter(unit=>unit.year == d.year),null,d.inputFormArray))
        // this.updateSimulatedvalue()

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

      calculateAggregate(d){
         
             let baseSummary = new SimulatedSummary(
                d[0],
                d[2],
                d[4],
                d[6],
                d[8],
                d[10],
                d[12],
                d[14],
                d[16]
              );
              let SimulateSummary = new SimulatedSummary(
                d[1],
                d[3],
                d[5],
                d[7],
                d[9],
                d[11],
                d[13],
                d[15],
                d[17]
              );
               
              // this.base_summary = baseSummary;
              // this.simulated_summary = SimulateSummary;
                         let sarr = new SimulatedArray(
               d[19],
              'category',
              'retialer',
               
                baseSummary,
                SimulateSummary,
                baseSummary.get_absolute(SimulateSummary),
                baseSummary.get_percent_change(SimulateSummary)
              );
               
     
    return sarr
      }

      populateSummary(units: NewUnit[], key) {
     
    
        let total_base$ = of(...units).pipe(
          reduce((a, b) => a + Number(b.base_units.toFixed(2)),0)
          );
        let category$ = of(...units)
        .pipe(
          map(data => Array.from(new Set(data.category))),
        )
        
          
        let retailer$ = of(...units)
          .pipe(distinct((unit) => unit.retailer))
        let product$ = of(...units)
          .pipe(distinct((unit) => unit.product_group))
         
        let total_base_new$ = of(...units).pipe(
          reduce((a, b) => a + b.new_base_units, 0)
        );
        let total_weight_in_tons$ = of(...units).pipe(
          reduce((a, b) => a + b.total_weight_in_tons, 0)
        );
        let total_weight_in_tons_new$ = of(...units).pipe(
          reduce((a, b) => a + b.total_weight_in_tons_new, 0)
        );
        let total_lsv$ = of(...units).pipe(reduce((a, b) => a + b.total_lsv, 0));
        let total_lsv_new$ = of(...units).pipe(
          reduce((a, b) => a + b.total_lsv_new, 0)
        );
        let total_rsv$ = of(...units).pipe(
          
          reduce((a, b) => a + b.total_rsv_w_o_vat, 0),
         
        );
        let total_rsv_new$ = of(...units).pipe(
          reduce((a, b) => a + b.total_rsv_w_o_vat_new, 0)
        );
        let total_nsv$ = of(...units).pipe(reduce((a, b) => a + b.total_nsv, 0));
        let total_nsv_new$ = of(...units).pipe(
          reduce((a, b) => a + b.total_nsv_new, 0)
        );
        let total_cogs$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs, 0));
        let total_cogs_new$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs_new, 0));
    
        let trade_expense$ = of(...units).pipe(
          reduce((a, b) => a + b.trade_expense, 0)
        );
        let trade_expense_new$ = of(...units).pipe(
          reduce((a, b) => a + b.trade_expense_new, 0)
        );
    
        let mars_mac$ = of(...units).pipe(reduce((a, b) => a + b.mars_mac, 0));
        let mars_mac_new$ = of(...units).pipe(
          reduce((a, b) => a + b.mars_mac_new, 0)
        );
        let retailer_margin$ = of(...units).pipe(
          reduce((a, b) => a + b.retailer_margin, 0)
        );
        let retailer_margin_new$ = of(...units).pipe(
          reduce((a, b) => a + b.retailer_margin_new, 0)
        );
        let year$ = of(units[0].year)
        let key$ = of(key)
    
        return forkJoin([
          total_base$,
          total_base_new$,
          total_weight_in_tons$,
          total_weight_in_tons_new$,
          total_lsv$,
          total_lsv_new$,
          total_rsv$,
          total_rsv_new$,
          total_nsv$,
          total_nsv_new$,
          total_cogs$,
          total_cogs_new$,
          trade_expense$,
          trade_expense_new$,
          mars_mac$,
          mars_mac_new$,
          retailer_margin$,
          retailer_margin_new$,
          year$,
          key$,
          retailer$,
          category$,
          product$
        ])
      }
    
    
}
