import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { NewUnit } from '../shared/models/unit';
import {
  SimulatorInput,
  SimulatedSummary,
  SimulatedArray,
} from '../shared/models/input';
import {
  Observable,
  of,
  from,
  BehaviorSubject,
  combineLatest,
  pipe,
} from 'rxjs';
import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
} from 'rxjs/operators';
import { ExcelServicesService } from '../shared/services/excel.service';
@Component({
  selector: 'app-scenario-comparison',
  templateUrl: './scenario-comparison.component.html',
  styleUrls: ['./scenario-comparison.component.scss'],
})
export class ScenarioComparisonComponent implements OnInit {
  arr = [];
  excel = [1, 3, 4, 5, 5];
  selectComparearr = new Array(5);
  selectedScenario;
  scenarioArray;
  scenarios;
  tableData$: Observable<NewUnit[]>;
  units: NewUnit[];
  simulatedArray: SimulatedArray[] = new Array();
  constructor(
    private api: ApiService,
    private excelService: ExcelServicesService
  ) {}

  ngOnInit(): void {
    this.tableData$ = this.api.getUnits();
    this.tableData$.subscribe((data: NewUnit[]) => {
      this.units = data;
    });
    this.api.getScenario().subscribe((data: any[]) => {
      console.log(data, 'GET DATA');
      this.scenarios = data;
      this.scenarioArray = data.map((d) => ({ name: d.name, id: d.id }));
      console.log(this.scenarioArray, 'SELECTED SCENARIO');
    });
  }
  exportAsXLSX(): void {
    let data = JSON.parse(JSON.stringify(this.simulatedArray));
    this.excelService.exportAsExcelFile(
      data.map((d) => Object.assign({}, { name: d.key }, d.absolute_change)),
      'sample'
    );
  }
  prepareJson(arr: SimulatedArray[]) {
    // let finalArray=[]
    // let json = {}
    // arr.forEach(data=>{
    //   json["Scenario Name"] = data.key
    //   json.
    // })
  }
  downloadExcel() {
    this.exportAsXLSX();
    // this.api.getExcel().subscribe(
    //   (data) => {
    //     console.log(data, 'EXCEL');
    //     this.downloadFile(data);
    //   },
    //   (err) => {
    //     console.log(err, 'ERR');
    //   }
    // );
  }
  downloadFile(data) {
    const blob = new Blob([data], { type: 'application/xls' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  removeSce(val) {
    console.log(val, 'remove id');
    console.log(this.simulatedArray);
    this.simulatedArray = this.simulatedArray.filter((arr) => arr.key != val);
    console.log(this.simulatedArray);
    this.selectComparearr = new Array(5 - this.simulatedArray.length);
    // this.scenarioArray = this.scenarioArray.filter((p) => p.name === val);
  }

  selectCompare() {
    console.log(this.selectedScenario, 'SSSSSSSSSSS');
    let selected = this.scenarios.find((p) => p.id === this.selectedScenario);
    console.log(JSON.parse(selected.savedump));
    console.log(selected, 'Selected');
    // this.selectedScenario

    let new_unit: NewUnit[] = this.api.updateSimulatedvalue(
      this.units,
      JSON.parse(selected.savedump)
    );
    this.populateSummary(new_unit, selected.name);
  }
  populateSummary(units: NewUnit[], key) {
    // console.log(units, 'UNITS');
    // console.log(key, 'KEY');
    // let totalrsv$ =  of(...units).pipe(
    //      reduce((a, b) => a + ((b.base_units)), 0)
    //      )
    let total_base$ = of(...units).pipe(reduce((a, b) => a + b.base_units, 0));
    let total_base_new$ = of(...units).pipe(
      // filter(data=>data.category === category),
      reduce((a, b) => a + b.new_base_units, 0)
    );
    let total_weight_in_tons$ = of(...units).pipe(
      reduce((a, b) => a + b.total_weight_in_tons, 0)
    );
    let total_weight_in_tons_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_weight_in_tons_new, 0)
    );
    let total_lsv$ = of(...units).pipe(reduce((a, b) => a + b.total_lsv, 0));
    let total_lsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_lsv_new, 0)
    );
    let total_rsv$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat, 0)
    );
    let total_rsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat_new, 0)
    );
    let total_nsv$ = of(...units).pipe(reduce((a, b) => a + b.total_nsv, 0));
    let total_nsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_nsv_new, 0)
    );

    let trade_expense$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense, 0)
    );
    let trade_expense_new$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense_new, 0)
    );

    let mars_mac$ = of(...units).pipe(reduce((a, b) => a + b.mars_mac, 0));
    let mars_mac_new$ = of(...units).pipe(
      reduce((a, b) => a + b.mars_mac_new, 0)
    );
    let retailer_margin$ = of(...units).pipe(
      reduce((a, b) => a + b.retailer_margin, 0)
    );
    let retailer_margin_new$ = of(...units).pipe(
      reduce((a, b) => a + b.retailer_margin_new, 0)
    );

    combineLatest([
      total_base$,
      total_base_new$,
      total_weight_in_tons$,
      total_weight_in_tons_new$,
      total_lsv$,
      total_lsv_new$,
      total_rsv$,
      total_rsv_new$,
      total_nsv$,
      total_nsv_new$,
      trade_expense$,
      trade_expense_new$,
      mars_mac$,
      mars_mac_new$,
      retailer_margin$,
      retailer_margin_new$,
    ]).subscribe(
      ([
        total_base,
        total_base_new,
        total_weight_in_tons,
        total_weight_in_tons_new,
        total_lsv,
        total_lsv_new,
        total_rsv,
        total_rsv_new,
        total_nsv,
        total_nsv_new,
        trade_expense,
        trade_expense_new,
        mars_mac,
        mars_mac_new,
        retailer_margin,
        retailer_margin_new,
      ]) => {
        let baseSummary = new SimulatedSummary(
          total_base,
          total_weight_in_tons,
          total_lsv,
          total_rsv,
          total_nsv,
          trade_expense,
          mars_mac,
          retailer_margin
        );
        let SimulateSummary = new SimulatedSummary(
          total_base_new,
          total_weight_in_tons_new,
          total_lsv_new,
          total_rsv_new,
          total_nsv_new,
          trade_expense_new,
          mars_mac_new,
          retailer_margin_new
        );
        console.log(key, 'FOR KEY');
        console.log(baseSummary, 'BASE SUMMARY');
        console.log(SimulateSummary, 'SIMULATED SUMMARY');

        this.simulatedArray.push(
          new SimulatedArray(
            key,
            baseSummary,
            SimulateSummary,
            baseSummary.get_absolute(SimulateSummary),
            baseSummary.get_percent_change(SimulateSummary)
          )
        );
        this.selectComparearr = new Array(5 - this.simulatedArray.length);

        console.log(this.simulatedArray, 'Simulated array');
      }
    );
  }
}
