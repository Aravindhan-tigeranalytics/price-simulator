import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
 
 constructor( private modalService: NgbModal){

 }
 
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
 
  close(content) {
    this.modalService.dismissAll(content);
  }
}