import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
 
  visibility: BehaviorSubject<boolean>;
 
  constructor() {
    this.visibility = new BehaviorSubject(false);
  }
  getSpin(){
  return  this.visibility.asObservable()
  }
 
  show() {
    this.visibility.next(true);
  }
 
  hide() {
    this.visibility.next(false);
  }
}