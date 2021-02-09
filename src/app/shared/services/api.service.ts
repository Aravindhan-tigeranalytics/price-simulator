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
  }
  public getData()  {
    // debugger;
    let t1 : NewUnit[] = []
    ipdata['Sheet1'].forEach(data=>{

      t1.push(new NewUnit(
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
  public editScenario(id,name, comment, form) {
    // console.log(form, 'FORMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
    let formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('comments', comment);
    formData.append('savedump', JSON.stringify(form));
    // formData.append('password', credentials.password);
    return this.http.put(
       environment.baseUrl+ '/api/scenario/savedscenario/' + id + "/",
      formData
    );
  }
  
    public saveScenario(name, comment, form) {
    // console.log(form, 'FORMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM'); 
    let formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('comments', comment);
    formData.append('savedump', JSON.stringify(form));
    // formData.append('password', credentials.password);
    return this.http.post(
       environment.baseUrl+ '/api/scenario/savedscenario/',
      formData
    );
  }

  public getScenario() {
    return this.http.get(  environment.baseUrl+ '/api/scenario/savedscenario/');
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
