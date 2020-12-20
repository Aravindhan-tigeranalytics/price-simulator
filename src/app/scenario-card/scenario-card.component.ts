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

  constructor() {}

  ngOnInit(): void {
    // console.log(this.simulated, 'SIMULATED ....');
  }
  removeScenario(value: string) {
    // console.log(value);
    this.removeEvent.emit(value);
  }
}
