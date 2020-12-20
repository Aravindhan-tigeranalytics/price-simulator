import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SimulatedSummary } from '../shared/models/input';

@Component({
  selector: '[app-simulate-summary-row]',
  templateUrl: './simulate-summary-row.component.html',
  styleUrls: ['./simulate-summary-row.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class SimulateSummaryRowComponent implements OnInit {
  @Input() obj: SimulatedSummary;
  @Input() name: string;
  decimalFormat = '1.0-1';

  constructor() {}

  ngOnInit(): void {}
}
