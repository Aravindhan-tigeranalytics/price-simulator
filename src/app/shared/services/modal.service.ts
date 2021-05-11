import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
 
 constructor( private modalService: NgbModal){

 }
 
  open(content , extra? , data?) {
    let obj = { ariaLabelledBy: 'modal-basic-title',}
    if(extra){
      obj = {...obj , ...extra}

    }
     
    
    let ins = this.modalService
      .open(content,obj )
      if(data){
        console.log(data , "data")
        // ins.componentInstance.simulatedData = data
      } 
      
  }
 
  close(content) {
    this.modalService.dismissAll(content);
  }
}