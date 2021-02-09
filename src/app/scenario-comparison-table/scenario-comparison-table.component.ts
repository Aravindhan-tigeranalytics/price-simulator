import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { PriceScenarioService } from '../shared/services/price-scenario.service';
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
import {convertCurrency} from '../shared/utils/utils'
@Component({
  selector: 'app-scenario-comparison-table',
  templateUrl: './scenario-comparison-table.component.html',
  styleUrls: ['./scenario-comparison-table.component.scss']
})
export class ScenarioComparisonTableComponent implements OnInit {
  decimalFormat = '1.0-1';
  abs = "ABS Change"
  per = "% Change"
  reverse_metric = ['TE','TE,%LSV','TE/Units']
  arr = [];
  filter_used
  excel = [1, 3, 4, 5, 5];
  metrics = []
  // init_metrics = ['Units','Tonnes','LSV' , 'RSV' , 'NSV' , 'MAC','TE','Customer Margin' ]
  init_metrics = [ 
    {total : 'Units' , ton :'Units' , units : 'Units'},
    {total : 'Tonnes' , ton :'Tonnes' , units : 'Tonnes'},
    {total : 'LSV' , ton :'LSV/Tonnes' , units : 'LSV/Units'},
    {total : 'RSV' , ton :'RSV/Tonnes' , units : 'RSV/Units'},
    {total : 'NSV' , ton :'NSV/Tonnes' , units : 'NSV/Units'},
    {total : 'MAC' , ton :'MAC/Tonnes' , units : 'MAC/Units'},
    {total : 'Customer Margin' , ton :'Customer Margin/Tonnes' , units : 'Customer Margin/Units'},
    {total : 'TE' , ton :'TE/Tonnes' , units : 'TE/Units'}, ]
    // 'TE,%LSV', 'MAC,%NSV' ,'Customer Margin,%RSV'
  additional_metrics = [
    {total : 'TE,%LSV' , ton :'TE,%LSV' , units : 'TE,%LSV'},
    {total : 'MAC,%NSV' , ton :'MAC,%NSV' , units : 'MAC,%NSV'},
    {total : 'Customer Margin,%RSV' , ton :'Customer Margin,%RSV' , units : 'Customer Margin,%RSV'},
    
  ]
  selectComparearr = new Array(5);
  selectedScenario;
  scenarioArray;
  scenarios;
  is_per = false;
  tableData$: Observable<NewUnit[]>;
  units: NewUnit[];
  simulatedArray: SimulatedArray[] = new Array();
  radioModel = 'total'
  constructor(
    private api: ApiService,
    private priceScenarioService:PriceScenarioService,
    private excelService: ExcelServicesService
  ) {}
  modelChangeFn($event){
    // console.log($event.value)

  }
  isCurrency(m){
    return ['LSV' , 'RSV' , 'NSV' , 'MAC','TE','Customer Margin'].includes(m)

  }
addMetric(){
  this.metrics.push('NSV')
}
metricChange(val){
  this.metrics = this.init_metrics
  this.metrics = this.metrics.concat(val)
  // console.log(val , "Drop down values")
  // console.log(this.metrics , "changed metrics")
}
toggleChange($event){
  this.is_per = $event.checked
  // console.log(this.is_per , "isabs")

}
  ngOnInit(): void {
    // debugger
    this.metrics = this.init_metrics
  
    this.tableData$ = this.priceScenarioService.getUnits()
    //  this.api.getUnits();
    this.tableData$.subscribe((data: NewUnit[]) => {
      this.units = data;
      // console.log(this.units , 'UNITSSS')
    });
    this.api.getScenario().subscribe((data: any[]) => {
      // console.log(data, 'GET DATA');
      this.scenarios = data;
      this.scenarioArray = data.map((d) => ({ name: d.name, id: d.id ,dump : JSON.parse(d.savedump)}));
      // console.log(this.scenarioArray, 'SELECTED SCENARIO');
    });
  }
  exportAsXLSX(): void {
    console.log(this.simulatedArray)
    let arr = {

    }
    // this.simulatedArray.map(d=>{
    //   d.percent_change
    // })
    let data = JSON.parse(JSON.stringify(this.simulatedArray));
    for(let v in data){
      let d = data[v]
      arr[d.key] = {"name" : d.key}
      console.log(arr ,"AR")
      arr[d.key]["header"] = Object.keys(d.current)
      arr[d.key]["current"] = Object.values(d.current).map(d=>convertCurrency(d))
      arr[d.key]["simulated"] =Object.values(d.simulated).map(d=>convertCurrency(d))
      arr[d.key]["Absolute change"] = Object.values(d.absolute_change).map(d=>convertCurrency(d))
      arr[d.key]["percent change"] = Object.values(d.percent_change).map(d=>convertCurrency(d , true))
      // d.key
      // console.log(Object.values(d.current).map(d=>convertCurrency(d)))
      // console.log(Object.values(d.simulated).map(d=>convertCurrency(d)))
      // console.log(Object.values(d.absolute_change).map(d=>convertCurrency(d)))
      // console.log(Object.values(d.percent_change).map(d=>convertCurrency(d , true)))
      // d.simulated
      // d.absolute_change
      // d.percent_change
      // console.log(data[v] , "VVV")
       
    }
    console.log(arr , "ARRAY ")
  //  let t =  data.map((d) => Object.assign({}, { name: d.key }, d.absolute_change))
  //  debugger
   this.api.getExcel(arr , "comp").subscribe(data=>{
    this.excelService.save(data , "comparison_summary")
   })
    // this.excelService.exportAsExcelFile(
    //   data.map((d) => Object.assign({}, { name: d.key }, d.absolute_change)),
    //   'sample'
    // );
  }
  prepareJson(arr: SimulatedArray[]) {
    // let finalArray=[]
    // let json = {}
    // arr.forEach(data=>{
    //   json["Scenario Name"] = data.key
    //   json.
    // })
  }
  selectFilters(key){
    // console.log(this.simulatedArray)
    // console.log(key)
    // console.log(this.scenarios)
    this.filter_used =this.scenarioArray.find(d=>d.name == (key)).dump
    // console.log(this.filter_used)

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
    // console.log(val, 'remove id');
    // console.log(this.simulatedArray);
    this.simulatedArray = this.simulatedArray.filter((arr) => arr.key != val);
    // console.log(this.simulatedArray);
    this.selectComparearr = new Array(5 - this.simulatedArray.length);
    // this.scenarioArray = this.scenarioArray.filter((p) => p.name === val);
  }

  selectCompare() {
    // console.log(this.selectedScenario, 'SSSSSSSSSSS');
    let selected = this.scenarios.find((p) => p.id === this.selectedScenario);
    // console.log(JSON.parse(selected.savedump).formArray);
    // console.log(selected, 'Selected');
    // this.selectedScenario

    let new_unit: NewUnit[] = 
    this.priceScenarioService.updateSimulatedvalue(
      this.units,
      null,
      JSON.parse(selected.savedump).formArray,
      // ''
    );
    this.populateSummary(new_unit, selected.name);
  }
  
  populateSummary(units: NewUnit[], key) {
    // console.log(units, 'UNITS');
    // console.log(key, 'KEY');
    // let totalrsv$ =  of(...units).pipe(
    //      reduce((a, b) => a + ((b.base_units)), 0)
    //      )

  //   let category$ = of(...units)
  //   .pipe(distinct((unit) => unit.category))
  // let retailer$ = of(...units)
  //   .pipe(distinct((unit) => unit.retailer))
  // let product$ = of(...units)
  //   .pipe(distinct((unit) => unit.product_group))
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
    let total_cogs$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs, 0));
    let total_cogs_new$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs_new, 0));

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
      total_cogs$,
      total_cogs_new$,
      trade_expense$,
      trade_expense_new$,
      mars_mac$,
      mars_mac_new$,
      retailer_margin$,
      retailer_margin_new$,
      // retailer$,
      // category$,
      // product$
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
        total_cogs,
        total_cogs_new,
        trade_expense,
        trade_expense_new,
        mars_mac,
        mars_mac_new,
        retailer_margin,
        retailer_margin_new,
        // retialer,
        // category,
        // product
      ]) => {
        let baseSummary = new SimulatedSummary(
          total_base,
          total_weight_in_tons,
          total_lsv,
          total_rsv,
          total_nsv,
          total_cogs,
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
          total_cogs_new,
          trade_expense_new,
          mars_mac_new,
          retailer_margin_new
        );
        // console.log(key, 'FOR KEY');
        // console.log(baseSummary, 'BASE SUMMARY');
        // console.log(SimulateSummary, 'SIMULATED SUMMARY');

        this.simulatedArray.push(
          new SimulatedArray(
            key,
            '',
            '',
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
