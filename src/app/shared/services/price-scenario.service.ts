import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { UnitModel, NewUnit } from '../models/unit';
import {ApiService} from "./api.service"
@Injectable()
export class PriceScenarioService {

  private newUnitObservable = new BehaviorSubject<NewUnit[]>([]);

  constructor(private api : ApiService) {
     this.api.getData().subscribe(data=>{
       this.newUnitObservable.next(data)
       console.log(data , " GENERATED DATA ")
     })
   }

   init(){
    //  this.newUnitObservable = this.api.getData()
   }
}
