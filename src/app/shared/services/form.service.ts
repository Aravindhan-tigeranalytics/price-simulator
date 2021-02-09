import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import {RouterStateSnapshot} from "@angular/router"
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { map, tap, catchError, switchMap, mergeMap } from 'rxjs/operators';
 
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Injectable()
export class FormService {
    private myForm : FormGroup;
    private formObservable = new BehaviorSubject<any>(null);
    private forms ={}
  constructor() {
    
  }
public setForms(forms){
    // console.log(forms , "FORMS SET")
    if(!forms){
        this.forms = {
            formValue  : null,
            myform : null,
            date_lpi : null,
            date_rsp : null,
            date_cogs : null,
            selectedScenario:null,
        }
    

    }
    else{
        this.forms['formValue'] = forms['formValue']
        this.forms['myform'] = forms['myform']
        this.forms['date_lpi'] = forms['date_lpi']
        this.forms['date_rsp'] = forms['date_rsp']
        this.forms['date_cogs'] = forms['date_cogs']
        this.forms['selectedScenario'] = forms['selectedScenario']

    }
    this.formObservable.next(this.forms)
    // console.log(forms , "FORMS SET AFTER")

}
public getFormObservable(){
    return this.formObservable.asObservable()
}
public getForms(){
    // console.log(this.forms , "FORMS GET")
    return this.forms

}
  public setForm(form : FormGroup){
    //   console.log(form , "SETTING INCOMMIN FORM SERVICE")
      this.myForm = form
    //   console.log(this.myForm , "SETTING FORM VALUES INSIDE SERVICE")
  }
  public getForm() : FormGroup {
    //   console.log(this.myForm , "GET FORM VALUE INSIDE SERVICES")
      return this.myForm

  }

 
}
