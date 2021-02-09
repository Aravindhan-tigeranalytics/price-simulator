import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SimulatedArray, SimulatedSummary } from '../shared/models/input';

@Component({
  selector: '[app-simulate-summary-row]',
  templateUrl: './simulate-summary-row.component.html',
  styleUrls: ['./simulate-summary-row.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class SimulateSummaryRowComponent implements OnInit {
  @Input() obj: SimulatedSummary;
  @Input() name: string;
  @Input() opt: string;
  val : SimulatedSummary;
  decimalFormat = '1.0-1';

  constructor() {}

  ngOnInit(): void {
    this.val = this.obj
   
  }
  updateObj(){
    if(this.opt == "Per Unit"){
      this.val = this.obj.getUnits()


    }
    else if (this.opt == "Per Tonne"){
      this.val = this.obj.getTonnes()

    }
    else{
      this.val = this.obj

    }
    // console.log(this.obj , "OBJ....")
  }
  ngOnChanges(changes) {
    if('opt' in changes){
      if(changes.opt.currentValue){
        this.opt = changes.opt.currentValue
        this.updateObj()

      }
    }
    // console.log(changes , "changes ")
  }
}
