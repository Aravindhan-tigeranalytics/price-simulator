import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map,tap, catchError, switchMap, mergeMap } from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { ModelMapper , mapJson } from '../models/modelmapper';
import *  as ipdata from '../../data/input1.json'
import { from , of } from 'rxjs';
import { UnitModel,NewUnit } from '../models/unit';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiRoot = '/api';
  newUnitObservable = new BehaviorSubject<NewUnit[]>([])
  newUnitChangeObservable = new BehaviorSubject<NewUnit[]>([])

  constructor(
    private http: HttpClient
  ) {
    console.log("SERVICE CONSTRUCTOR")
    this.getData<NewUnit[]>(NewUnit)
  }

  public getUnits():Observable<NewUnit[]>{
   return this.newUnitObservable.asObservable()
  }
public getData<T>(itemType: any){
    // console.log(itemType , "ITEM TYPE")

    // console.log(ipdata['Sheet1'] , "ipdata['Sheet1']")
    let t = ipdata['Sheet1'].map((data:any)=>{
        // return new ModelMapper(itemType).map(item)
        // console.log(data , "DATA DATA DATa")
        let r =  new NewUnit(
          data['Category'],
          data['Product Group'],
          data['Retailer'],
          data['Year'],
           data['Date'],
            data['%LPI'],
            data['% RSP Increase'],
           data['% COGS Increase'],
           data['Base Price Elasticity'],
           data['Cross Elasticity'],
           data['Net Elasticity'],
          data['Competition'],
            data['Base Units'],
          data['List Price'],
           data['Retailer Median Base Price'],
           data['Retailer Median Base Price  w\\o VAT'],
           data['On Inv. %'],
           data['Off Inv. %'],
          data['TPR %'],
           data['GMAC%, LSV'],
           data['Product Group Weight (grams)'],
           data['Mars On-Invoice'],
           data['Mars NSV'],
          data['TPR Budget'],
           data['Mars Net Invoice Price'],
          data['Mars Off-Invoice'],
           data['Mars NSV'],
           data['Retailer mark-up'],
           data['GMAC, LSV Per Unit'],
           data['Mars COGS Per Unit'],
          data["Total RSV"],
            data["Total RSV  w\\o VAT"],
         data["Total LSV"],
          data['Mars Total On-Invoice '],
          data["Mars Total NRV"],
           data["Mars Total Net Invoice Price"],
           data["Mars Total Off-Invoice"],
          data["Total NSV"],
           data["Total COGS"],
            data["Total Weight (tons)"],
            data[" Trade Expense"],
            data["Retailer Margin"],
           data["Retailer Margin,% of RSP"],
          data["Mars MAC"],
          data["Mars MAC,% of NSV"],
            data["Mars,% of Total Profit Pool"],
            data["Retailer ,% of Total Profit Pool"]
        );
        // console.log(r , "OBJECT RRR")
        return r
        // mapJson(item , NewUnit)
    })
    this.newUnitObservable.next(t)
    // console.log(t , "TTTT")
    // return this.newUnitObservable.asObservable()


    // return from(ipdata['Sheet1']).pipe(
        
    //     map(
    //     (data:any) => data.map((item:any)=>{
    //             return new ModelMapper(itemType).map(item)
    //         })
    //     )
    // )
}
private checkForChanges(obj){
  return (Number(obj.lpi_increase) && Number(obj.rsp_increase) && Number(obj.cogs_increase))
}
private update_values(data:NewUnit ,val){

  if(this.checkForChanges(val)){
    data.lpi_percent = (Number(val.lpi_increase) / 100).toString()
    data.rsp_increase_percent = (Number(val.lpi_increase) / 100).toString()
    data.cogs_increase_percent = (Number(val.lpi_increase) / 100).toString()
    data.updateValues()

  }
     

}
public updateUnits(form:FormGroup){
  // debugger;
  let units:NewUnit[]= this.newUnitObservable.getValue();
  console.log(units, "UNITS BEFORE")
  
  units.forEach(data=>{
    if ((data.product_group == "ORBIT OTC") && (data.retailer == "Magnit")){
      this.update_values(data, form.value.orbit_otc_magnit)

    }
    if ((data.product_group == "ORBIT OTC") && (data.retailer == "X5")){
      this.update_values(data, form.value.orbit_otc_x5)

    }
    if ((data.product_group == "ORBIT XXL") && (data.retailer == "Magnit")){
      this.update_values(data, form.value.orbit_xxl_magnit)

    }
  })
  console.log(units, "UNITS AFTER")
  this.newUnitObservable.next(units)

}
public updateSimulatedvalue(form){
  let units:NewUnit[]= this.newUnitObservable.getValue();
  console.log(units , "BEFORE MANIPULATION")

   
  units.forEach(data=>{
    // for(const i in form){}
    if(data.product_group in form){
      // console.log(form[data.product_group] , "ITERATION VALUES")
      this.update_values(data ,form[data.product_group] )
    }
  })

  console.log(units , "AFTER MANIPULATION")
return units
// }


}
//  public get<T>(url: string, itemType: any): Observable<T> {
//     if (!url) {
//       return;
//     }

//     return this.http.get<T>(url)
//       .pipe(
//         map(data => data.map((item: any) => {
//           return new ModelMapper(itemType).map(item);
//         }
//       ))
//     );
//   }
}