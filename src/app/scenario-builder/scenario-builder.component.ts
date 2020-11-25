import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scenario-builder',
  templateUrl: './scenario-builder.component.html',
  styleUrls: ['./scenario-builder.component.scss']
})
export class ScenarioBuilderComponent implements OnInit {
  arr=[1,2,3,4,5]
  constructor() { }

  ngOnInit(): void {
  }

}
