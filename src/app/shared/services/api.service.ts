import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, tap, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { ModelMapper, mapJson } from '../models/modelmapper';
import * as ipdata from '../../data/input1.json';
import * as pricepool from '../../data/pricepool.json';
import { from, of } from 'rxjs';
import { UnitModel, NewUnit } from '../models/unit';
import { ProfitPool } from '../models/profit-pool.model';
import * as Utils from '../utils/utils';
import { SimulatedArray } from '../../shared/models/input';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiRoot = '/api';
  simulatedArrayObservable = new BehaviorSubject<SimulatedArray[]>([]);
  newUnitObservable = new BehaviorSubject<NewUnit[]>([]);
  newUnitChangeObservable = new BehaviorSubject<NewUnit[]>([]);

  constructor(private http: HttpClient) {
    console.log('SERVICE CONSTRUCTOR');
    this.getData<NewUnit[]>();
  }

  public getSimulatedArray(): Observable<SimulatedArray[]> {
    return this.simulatedArrayObservable.asObservable();
  }
  public setSimulatedArray(simulatedArray: SimulatedArray[]) {
    this.simulatedArrayObservable.next(simulatedArray);
  }

  public getUnits(): Observable<NewUnit[]> {
    return this.newUnitObservable.asObservable();
  }
  public getUnitsChange(): Observable<NewUnit[]> {
    return this.newUnitChangeObservable.asObservable();
  }
  public getPricePool(): ProfitPool[] {
    let t = pricepool['Sheet1'].map((data: any) => {
      let r = new ProfitPool(
        data['Category'],
        data['Product Group'],
        data['Retailer'],
        Utils.stringToParseConversion(data['Year']),
        new Date(data['Date']),
        data['Promo Month'],
        data['Promo'],
        data['Promo Mechanic'],
        data['Promo Activity'],
        Utils.stringToParseConversion(data['Promo Days']),
        Utils.stringToParseConversion(data['Base Units'].replace(/,/g, '')),
        Utils.stringToParseConversion(
          data['Incremental Units'].replace(/,/g, '')
        ),
        Utils.stringToParseConversion(
          data['Turnover in units'].replace(/,/g, '')
        ),
        Utils.stringToParseConversion(data['List Price'].replace(/,/g, '')),
        Utils.stringToParseConversion(
          data['Retailer Average Selling Price'].replace(/,/g, '')
        ),

        Utils.stringToParseConversion(data['On Inv. %']),
        Utils.stringToParseConversion(data['Off Inv. %']),
        Utils.stringToParseConversion(data['TPR %']),
        Utils.stringToParseConversion(data['GMAC%, LSV'])
      );

      return r;
    });
    return t;
  }
  public getData<T>() {
    let t = ipdata['Sheet1'].map((data: any) => {
      let r = new NewUnit(
        data['Category'],
        data['Product Group'],
        data['Retailer'],
        Utils.stringToParseConversion(data['Year']),
        new Date(data['Date']),
        //  data['Date'],
        data['%LPI'],
        data['% RSP Increase'],
        data['% COGS Increase'],
        data['Base Price Elasticity'],
        data['Cross Elasticity'],
        data['Net Elasticity'],
        data['Competition'],
        Utils.stringToParseConversion(data['Base Units'].replace(/,/g, '')),
        Utils.stringToParseConversion(data['List Price'].replace(/,/g, '')),
        Utils.stringToParseConversion(
          data['Retailer Median Base Price'].replace(/,/g, '')
        ),
        Utils.stringToParseConversion(
          data['Retailer Median Base Price  w\\o VAT'].replace(/,/g, '')
        ),
        Utils.stringToParseConversion(data['On Inv. %']),
        Utils.stringToParseConversion(data['Off Inv. %']),
        Utils.stringToParseConversion(data['TPR %']),
        Utils.stringToParseConversion(data['GMAC%, LSV']),
        Utils.stringToParseConversion(data['Product Group Weight (grams)'])
        // data['Mars On-Invoice'],
        // data['Mars NSV'],
        // data['TPR Budget'],
        // data['Mars Net Invoice Price'],
        // data['Mars Off-Invoice'],
        // data['Mars NSV'],
        // data['Retailer mark-up'],
        // data['GMAC, LSV Per Unit'],
        // data['Mars COGS Per Unit'],
        // data['Total RSV'],
        // data['Total RSV  w\\o VAT'],
        // data['Total LSV'],
        // data['Mars Total On-Invoice '],
        // data['Mars Total NRV'],
        // data['Mars Total Net Invoice Price'],
        // data['Mars Total Off-Invoice'],
        // data['Total NSV'],
        // data['Total COGS'],
        // data['Total Weight (tons)'],
        // data[' Trade Expense'],
        // data['Retailer Margin'],
        // data['Retailer Margin,% of RSP'],
        // data['Mars MAC'],
        // data['Mars MAC,% of NSV'],
        // data['Mars,% of Total Profit Pool'],
        // data['Retailer ,% of Total Profit Pool']
      );

      return r;
    });
    this.newUnitObservable.next(t);
    this.newUnitChangeObservable.next(t);
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
  private checkForChanges(obj) {
    return (
      Number(obj.lpi_increase) &&
      Number(obj.rsp_increase) &&
      Number(obj.cogs_increase)
    );
  }
  private update_values(data: NewUnit, val) {
    // console.log(val, 'VAL');
    // if (this.checkForChanges(val)) {
    // }
  }
  public updateUnits(form: FormGroup) {
    let units: NewUnit[] = this.newUnitObservable.getValue();
    //  / debugger;
    // let units = unit;

    // console.log(units, 'BEFORE MANIPULATION');

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
    this.newUnitObservable.next(units);
  }
  public updateSimulatedvalue(unit: NewUnit[], form, lpi?, rsp?, cogs?) {
    console.log(lpi, rsp, cogs, 'DATES');
    // let units: NewUnit[] = this.newUnitObservable.getValue();
    // debugger;
    let units = unit;

    console.log(units, 'BEFORE MANIPULATION');

    units.forEach((data) => {
      // for(const i in form){}
      if (data.product_group in form) {
        let val = form[data.product_group];
        // console.log(form[data.product_group] , "ITERATION VALUES")
        if (lpi && Number(val.lpi_increase) > 0) {
          if (lpi < data.date) {
            data.lpi_percent = Number(val.lpi_increase) / 100;
          }
        } else {
          data.lpi_percent = Number(val.lpi_increase) / 100;
        }
        if (rsp && Number(val.rsp_increase) > 0) {
          if (rsp < data.date) {
            data.rsp_increase_percent = Number(val.rsp_increase) / 100;
          }
        } else {
          data.rsp_increase_percent = Number(val.rsp_increase) / 100;
        }
        if (cogs && Number(val.cogs_increase) > 0) {
          if (cogs < data.date) {
            data.cogs_increase_percent = Number(val.cogs_increase) / 100;
          }
        } else {
          data.cogs_increase_percent = Number(val.cogs_increase) / 100;
        }

        // data.rsp_increase_percent = Number(val.rsp_increase) / 100;

        data.base_price_elasticity = Number(val.base_price_elasticity);
        data.competition = val.competition;
        data.updateValues();
        // this.update_values(data, form[data.product_group]);
      }
    });

    console.log(units, 'AFTER MANIPULATION');
    return units;
    // }
  }
  public saveScenario(name, comment, form) {
    console.log(form, 'FORMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
    let formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('comments', comment);
    formData.append('savedump', JSON.stringify(form));
    // formData.append('password', credentials.password);
    return this.http.post(
      'http://localhost:8000/api/scenario/savedscenario/',
      formData
    );
  }

  public getScenario() {
    return this.http.get('http://localhost:8000/api/scenario/savedscenario/');
  }
  public getExcel() {
    return this.http.get('http://127.0.0.1:8000/api/scenario/download/', {
      responseType: 'blob',
    });
  }
}
