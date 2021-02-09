import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SimulatedArray } from '../shared/models/input';

@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.scss'],
})
export class ScenarioCardComponent implements OnInit {
  @Input() simulated: SimulatedArray;
  decimalFormat = '1.0-1';
  @Output() removeEvent = new EventEmitter<string>();
  @Input() filters:any[]
  filter_used

  constructor() {}

  ngOnInit(): void {
    // console.log(this.filters , "filters ")
    // console.log(this.simulated, 'SIMULATED ....');
   this.filter_used =  this.filters.find(d=>d.name === this.simulated.key).dump
  //  console.log(this.filter_used, 'filter useed ....');
  }
  removeScenario(value: string) {
    // console.log(value);
    this.removeEvent.emit(value);
  }
}
