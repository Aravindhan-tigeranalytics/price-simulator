import { Component, OnInit, Input } from '@angular/core';
import { SimulatedArray } from '../shared/models/input';
import { ApiService } from '../shared/services/api.service';
@Component({
  selector: 'app-scenario-summary',
  templateUrl: './scenario-summary.component.html',
  styleUrls: ['./scenario-summary.component.scss'],
})
export class ScenarioSummaryComponent implements OnInit {
  simulatedArray: SimulatedArray[] = new Array();
  isSimulate: boolean;
  params = ['Current Values', 'Simulated', 'ABS Change', '% Change'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSimulatedArray().subscribe((data) => {
      if (data) {
        if (data.length > 0) {
          this.simulatedArray = data;
          this.isSimulate = true;
        }
      }
    });
  }
}
