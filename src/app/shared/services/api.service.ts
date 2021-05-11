import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {  NewUnit } from '../models/unit';
import { map, tap, catchError, switchMap, mergeMap  } from 'rxjs/operators';
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
// import { from ,of} from 'rxjs';
import { ProfitPool } from '../models/profit-pool.model';
import * as Utils from '../utils/utils';

import {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiRoot = '/api';
  

  constructor(private http: HttpClient) {
    console.log('SERVICE CONSTRUCTOR');
    this.getData();
    // this.getScenarioMetrics().subscribe(data=>{
    //   console.log(data , "METRIC DATA")
    // })
  }
  public getData()  {
    // debugger;
    let t1 : NewUnit[] = []
    ipdata['Sheet1'].forEach(data=>{

      t1.push(new NewUnit(
        data['Category'],
        data['Product Group'],
        data['Retailer'],
        data['Category'],
        data['Product Group'],
        data['Retailer'],
        Utils.stringToParseConversion(data['Year']),
        new Date(data['Date']),
         
        Utils.stringToParseConversion(data['%LPI']),
        Utils.stringToParseConversion(data['% RSP Increase']),
        Utils.stringToParseConversion(data['% COGS Increase']),
        Number(data['Base Price Elasticity']),
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
       
      ));
    })
    return t1
     
  }
  public getScenarioMetrics(){
    return this.http.get(environment.baseUrl+ '/api/scenario/scenario-metrics/').pipe(
      map((data:any )=> {
        let t1 : NewUnit[] = []
         
        data.forEach(d=>{
          t1.push(new NewUnit(
            d.category,d.product_group,d.retailer,
            d.brand_filter , d.brand_format_filter , d.strategic_cell_filter
            ,d.year,new Date(d.date),0.0,0.0,0.0,Number(d.base_price_elasticity),
            d.cross_elasticity ,d.net_elasticity ,'Not Follows' , 
            Utils.stringToParseConversion(d.base_units.replace(/,/g, '')) ,
            Utils.stringToParseConversion(d.list_price.replace(/,/g, '')),
            Utils.stringToParseConversion(d.retailer_median_base_price.replace(/,/g, '')),
            Utils.stringToParseConversion(d.retailer_median_base_price_w_o_vat.replace(/,/g, '')),
            Utils.stringToParseConversion(d.on_inv_percent),Utils.stringToParseConversion(d.off_inv_percent),
            Utils.stringToParseConversion(d.tpr_percent),Utils.stringToParseConversion(d.gmac_percent_lsv),
            Utils.stringToParseConversion(d.product_group_weight)
    
            ))

        }) 
        return t1 
      }
    

        )
    );

  }
  private checkForChanges(obj) {
    return (
      Number(obj.lpi_increase) &&
      Number(obj.rsp_increase) &&
      Number(obj.cogs_increase)
    );
  }
  public deleteScenario(id) {
    // console.log(form, 'FORMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
    
    return this.http.delete(
       environment.baseUrl+ '/api/scenario/savedscenario/' + id + "/",
     
    );
  }
  public editScenario(id,name, comment, form,yearly?) {
    // console.log(form, 'FORMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
    // ?yearly=${ is_yearly ? 'True' : 'False'}`
    let formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('comments', comment);
    formData.append('savedump', JSON.stringify(form));
    if(yearly){
      formData.append('is_yearly', yearly);
    }
    // formData.append('password', credentials.password);
    return this.http.put(
       environment.baseUrl+ `/api/scenario/savedscenario/${id}/?yearly=${ yearly ? 'True' : 'False'}`,
      formData
    );
  }
  
    public saveScenario(name, comment, form,yearly?) {
    // console.log(form, 'FORMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'); 
    let formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('comments', comment);
    formData.append('savedump', JSON.stringify(form));
    if(yearly){
      formData.append('is_yearly', yearly);
    }
    // formData.append('password', credentials.password);
    return this.http.post(
       environment.baseUrl+ '/api/scenario/savedscenario/',
      formData
    );
  }

  public getScenario(is_yearly='false') {
    // const yearly = 
    return this.http.get( environment.baseUrl+ `/api/scenario/savedscenario/?yearly=${ is_yearly}`);
  }
  // public getExcel() {
  //   return this.http.get( environment.baseUrl + '/api/scenario/download/', {
  //     responseType: 'blob',
  //   });
  // }
  public getExcel(data , type) {
    let formData: FormData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('type', type);
    console.log(formData , "formdata")
    return this.http.post( environment.baseUrl + '/api/scenario/downloads/', formData,{
      responseType: 'blob',
    });
  }
  public readExcel(data) {
    let formData: FormData = new FormData();
    formData.append('file', data);
    console.log(formData , "formdata")
    return this.http.post( environment.baseUrl + '/api/scenario/getExcel/', formData);
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
  }
