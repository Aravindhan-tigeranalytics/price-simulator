import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../shared/services/api.service';
import { NewUnit } from '../shared/models/unit';
// import {} from '../simulate-summary-row/simulate-summary-row.component'
import {
  SimulatorInput,
  SimulatedSummary,
  SimulatedArray,
  ClassObj,
} from '../shared/models/input';
import {
  Observable,
  of,
  from,
  BehaviorSubject,
  combineLatest,
  pipe,
} from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ExcelServicesService } from '../shared/services/excel.service';

import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
  finalize,
} from 'rxjs/operators';
import { Directive } from '@angular/core';
export interface DialogData {
  animal: string;
  name: string;
}

// @Directive({
//   selector: '[remove-wrapper]',
// })
// export class RemoveWrapperDirective {
//   constructor(private el: ElementRef) {
//     console.log(el, 'DIRECTIVE ELEMENT REFERENCE');
//     const parentElement = el.nativeElement.parentElement;
//     const element = el.nativeElement;
//     parentElement.removeChild(element);
//     parentElement.parentNode.insertBefore(element, parentElement.nextSibling);
//     parentElement.parentNode.removeChild(parentElement);
//   }
// }

@Component({
  selector: 'app-scenario-input',
  templateUrl: './scenario-input.component.html',
  styleUrls: ['./scenario-input.component.scss'],
  // directives: []
  // directives:[]
})
export class ScenarioInputComponent implements OnInit {
  @Input('tableData') tableData$: Observable<NewUnit[]>;
  @Input('simulteFlag') simulteFlag$: Observable<boolean>;
  @Output() simulateSummaryEvent = new EventEmitter<boolean>();
  simulate;
  isSimulate = false;
  date_lpi;
  date_rsp;
  date_cogs;
  isCHG;
  initialForm = null;
  // decimalFormat = '1.0-1';
  // simulated_summary_obj = {

  // }
  decimalFormat = '1.0-1';
  panelOpenState = false;
  scenarioComment;
  scenarioName;
  expanded_flag = false;
  params = ['Current Values', 'Simulated', 'ABS Change', '% Change'];
  base_summary: SimulatedSummary = new SimulatedSummary(0, 0, 0, 0, 0, 0, 0, 0);
  simulated_summary: SimulatedSummary = new SimulatedSummary(
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  );

  retailers = new FormControl();
  categories = new FormControl();
  products = new FormControl();
  categoryFilterSubject = new BehaviorSubject([]);
  productFilterSubject = new BehaviorSubject([]);
  retailerFilterSubject = new BehaviorSubject([]);

  inputList: string[];
  categories_filter = [];
  retailer_filter = [];
  product_filter = [];
  update = false;
  // @ViewChild('initElement') initElement: HTMLElement;
  // @ViewChild('simulate') simulate: HTMLElement;
  // @ViewChild('scrollHeader') scrollHeader: ElementRef;
  // @ViewChild('filterHeader') filterHeader: ElementRef;
  @ViewChild('closebutton') closebutton: ElementRef;
  sticky: boolean = false;
  sticky_header: boolean = false;
  topScroll = 0;
  scrollHeaderPosition = 0;
  filterHeaderPosition = 0;
  units: NewUnit[];
  initUnit: NewUnit[];
  simulatorInput: SimulatorInput[] = new Array();
  simulatedArray: SimulatedArray[] = new Array();
  inputForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private excel: ExcelServicesService,
    private router: Router
  ) {
    // this.inputForm = new FormGroup({})
  }
  expandTable(flag?) {
    if (flag) {
      if (flag == 'expand') {
        this.expanded_flag = true;
      } else {
        this.expanded_flag = false;
      }
    } else {
      this.expanded_flag = !this.expanded_flag;
    }

    // alert(this.expanded_flag);
  }
  resetDate(date) {
    // this.date = null;
  }
  csvInputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
    const target: DataTransfer = <DataTransfer>fileInputEvent.target;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      this.updateElasiticity(this.excel.read(e.target.result));
    };
  }
  updateElasiticity(data) {
    this.update = true;
    data.forEach((element) => {
      this.inputForm.controls[element.Product].patchValue({
        base_price_elasticity: element.Base,
      });
    });
  }
  saveScenario(mymodal) {
    this.close(mymodal);
    console.log(mymodal, 'MODAL REF');
    console.log(this.closebutton, 'CLOSE BUTTON');
    // this.closebutton.nativeElement.click();
    this.api
      .saveScenario(
        this.scenarioName,
        this.scenarioComment,
        this.inputForm.value
      )
      .subscribe((data) => {
        console.log(data, 'RETURN DATA ');
      });
  }

  goToDashboard() {
    this.api.updateUnits(this.inputForm.value);
    this.router.navigate(['dashboard']);
  }
  increaseValue(key, formname) {
    console.log(key, 'KEY');

    let val = this.inputForm.controls[key].get(formname).value;
    if (formname == 'lpi_increase') {
      this.inputForm.controls[key].patchValue({
        lpi_increase: val + 5,
      });
    }
    if (formname == 'rsp_increase') {
      this.inputForm.controls[key].patchValue({
        rsp_increase: val + 5,
      });
    }
    if (formname == 'cogs_increase') {
      this.inputForm.controls[key].patchValue({
        cogs_increase: val + 5,
      });
    }
  }
  decreaseValue(key, formname) {
    console.log(key, 'KEY');
    // console.log(lpi_increase, 'LPI');

    let val = this.inputForm.controls[key].get('lpi_increase').value;
    // debugger;
    if (formname == 'lpi_increase') {
      this.inputForm.controls[key].patchValue({
        lpi_increase: val - 5,
      });
    }
    if (formname == 'rsp_increase') {
      this.inputForm.controls[key].patchValue({
        rsp_increase: val - 5,
      });
    }
    if (formname == 'cogs_increase') {
      this.inputForm.controls[key].patchValue({
        cogs_increase: val - 5,
      });
    }
  }

  toggleChange(e) {
    this.isCHG = e.checked;
    // let sarr = new SimulatedArray(
    //   key,
    //   baseSummary,
    //   SimulateSummary,
    //   baseSummary.get_absolute(SimulateSummary),
    //   baseSummary.get_percent_change(SimulateSummary)
    // );
    // if (key != 'ALL') {
    //   this.inputForm.controls[key].patchValue({
    //     mac: sarr.simulated.mac,
    //     te: sarr.simulated.te,
    //     rp: sarr.simulated.rp,
    //   });
    // }
    // console.log(, 'EVENT');
    if (e.checked) {
      this.simulatedArray.forEach((e) => {
        if (e.key != 'ALL') {
          this.inputForm.controls[e.key].patchValue({
            mac: e.percent_change.mac,
            te: e.percent_change.te,
            rp: e.percent_change.rp,
          });
        }
      });
    } else {
      this.simulatedArray.forEach((e) => {
        if (e.key != 'ALL') {
          this.inputForm.controls[e.key].patchValue({
            mac: e.simulated.mac,
            te: e.simulated.te,
            rp: e.simulated.rp,
          });
        }
      });
    }
  }
  openDialog(): void {
    // const dialogRef: MatDialogRef<DialogOverviewExampleDialog>= this.dialog.open(DialogOverviewExampleDialog, {
    //   width: '250px',
    //   data: {name: 'sdfsdfsdf', animal: 'ssdsd'}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  applyFilter() {
    // console.log(this.retailers.value,"Retailers")
    // console.log(this.categories.value,"Categories")
    // console.log(this.products.value, 'Products');
    // console.log(this.product_filter, 'PRODUC T FILRET');
    if (this.categories.value && this.categories.value.includes('ALL')) {
      this.categoryFilterSubject.next(this.categories_filter);
    } else {
      this.categoryFilterSubject.next(this.categories.value);
    }
    if (this.retailers.value && this.retailers.value.includes('ALL')) {
      this.retailerFilterSubject.next(this.retailer_filter);
    } else {
      this.retailerFilterSubject.next(this.retailers.value);
    }
    if (this.products.value && this.products.value.includes('ALL')) {
      let arr = this.products.value;
      // console.log(arr, 'ARARAA');
      arr.push(...this.product_filter);
      // console.log(arr, 'AFTER PUSH');
      // console.log([...new Set(arr)], 'UNIQUE');
      // && this.products.value.includes('ALL')
      this.productFilterSubject.next(arr);
    } else {
      // console.log(this.products.value, 'ARARAA else');
      // let arr = this.products.value;
      this.productFilterSubject.next(this.products.value);
    }

    combineLatest([
      this.tableData$,
      this.categoryFilterSubject,
      this.productFilterSubject,
      this.retailerFilterSubject,
    ])
      .pipe(
        map(([units, category, product, retailer]) => {
          // console.log(category , "CATEGORY")

          if (category) {
            units = units.filter((unit) => category.includes(unit.category));
          }
          if (product) {
            units = units.filter((unit) =>
              product.includes(unit.product_group)
            );
          }
          if (retailer) {
            units = units.filter((unit) => retailer.includes(unit.retailer));
          }

          return units;
        })
      )
      .subscribe((data) => {
        //  console.log(data , "FILTERED DATA ")
        this.aggregate(data);
        //  console.log(data.length , "LENGTH TABLE DATA")
      });
  }
  resetFilter() {
    this.categories.reset();
    this.retailers.reset();
    this.products.reset();
    this.applyFilter();
  }
  downloadSummary() {
    let data = JSON.parse(JSON.stringify(this.simulatedArray));
    this.excel.exportAsExcelFile(
      data.map((d) => Object.assign({}, { name: d.key }, d.absolute_change)),
      'summary'
    );
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
  resetFormGroup() {
    console.log(this.units, 'RESETTING');
    this.api.getData();
    // this.aggregate(this.initUnit);
    this.api.getUnits().subscribe((data) => {
      this.aggregate(data);
      this.update = false;
      this.expandTable('close');
    });
  }

  ngOnInit(): void {
    this.scrollHeaderPosition = 0;
    this.filterHeaderPosition = 0;
    // this.api.getUnitsChange().subscribe((data) => {
    //   this.initUnit = data;
    // });

    let arr = [1, 2, 3];

    let sim = arr.map((d) => {
      let t = new ClassObj(d);
      return t;
    });
    let updated = sim.map((e) => {
      return new ClassObj(e.id + 100);
    });
    console.log(updated, 'UPDATED');
    console.log(sim, 'SIM');
    debugger;

    this.simulteFlag$.subscribe((data) => {
      if (data) {
        this.simulateFn();
      }

      console.log(data, 'OBSERVABLE DATA.......');
    });
    this.tableData$.subscribe((data: NewUnit[]) => {
      console.log(data, 'UNITTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
      this.units = data;
      // this.initUnit = Object.values({ ...data }) as NewUnit[];

      this.inputList = this.aggregate(this.units);
      console.log(this.inputList, 'IP LIST');
      this.populateFilter(this.units);
    });
  }

  populateFilter(datas) {
    of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.category))
      .subscribe((data) => {
        this.categories_filter.push(data.category);
      });
    of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.retailer))
      .subscribe((data) => {
        this.retailer_filter.push(data.retailer);
      });
    of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.product_group))
      .subscribe((data) => {
        this.product_filter.push(data.product_group);
      });
  }
  aggregate(units: NewUnit[]) {
    const group = {};
    let arr = [];
    this.simulatorInput = new Array();
    units.forEach((data) => {
      let str = data.product_group;
      //  + "-" + data.retailer + "-" + data.category
      if (arr.includes(str)) {
      } else {
        arr.push(str);
        let obj = new SimulatorInput(
          data.retailer,
          data.category,
          data.product_group,
          data.mars_cogs_per_unit,
          data.list_price,
          data.retailer_median_base_price,
          data.base_price_elasticity,
          data.competition
        );

        // console.log(obj , "OBBBB")
        if (obj) {
          this.simulatorInput.push(obj);
          group[str] = new FormGroup(this.getFormGroup(obj));
        }
      }
    });
    this.initialForm = group;

    console.log(group, 'GROUP FOR FOM');
    this.inputForm = new FormGroup(group);
    // this.inputForm.valueChanges.subscribe(data=>{
    //   console.log(data , "FORMV VALUE CHANEGS")

    // })
    // console.log(this.inputForm , "INPUT FORM VALUES")
    // console.log(this.simulatorInput , "ACTUAL DATA ")
    return arr;
  }
  //   getVal(obj){
  //     console.log(obj , "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
  // return true
  //   }
  private getFormGroup(obj: SimulatorInput) {
    return {
      product_group: new FormControl(obj.product_group),
      retailer: new FormControl(obj.retailer),
      category: new FormControl(obj.category),
      product_group_retailer: new FormControl(obj.ret_cat_prod),
      current_lpi: new FormControl(obj.lp),
      current_rsp: new FormControl(obj.rsp),
      current_cogs: new FormControl(obj.cogs),
      lpi_increase: new FormControl(0),
      rsp_increase: new FormControl(0),
      cogs_increase: new FormControl(0),
      base_price_elasticity: new FormControl(obj.base_price_elasticity_used),
      base_price_elasticity_manual: new FormControl(0),
      competition: new FormControl(obj.competition),
      mac: new FormControl(obj.mac),
      rp: new FormControl(obj.mac),
      te: new FormControl(obj.te),
      // lpi_date: new FormControl(),
      // rsp_date: new FormControl(),
      // cogs_date: new FormControl(),
    };
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
    ])
      .pipe(
        finalize(() => {
          console.log(this.simulatedArray, 'FINAAALLLLLLLLLLLLLL');
        })
      )

      .subscribe(
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
          // console.log(key, 'FOR KEY');
          // console.log(baseSummary, 'BASE SUMMARY');
          // console.log(SimulateSummary, 'SIMULATED SUMMARY');
          this.base_summary = baseSummary;
          this.simulated_summary = SimulateSummary;
          // let f = this.inputForm;
          // debugger;
          let sarr = new SimulatedArray(
            key,
            baseSummary,
            SimulateSummary,
            baseSummary.get_absolute(SimulateSummary),
            baseSummary.get_percent_change(SimulateSummary)
          );
          if (key != 'ALL') {
            this.inputForm.controls[key].patchValue({
              mac: sarr.simulated.mac,
              te: sarr.simulated.te,
              rp: sarr.simulated.rp,
            });
            this.expandTable('expand');
          }

          this.simulatedArray.push(sarr);
          console.log(this.simulatedArray, 'SIMULATED AT}RRAY');
        },
        (err) => {},
        () => {
          this.api.setSimulatedArray(this.simulatedArray);
          console.log(this.simulatedArray, 'OBSERVABLE COMPLETED..........');
        }
      );
  }
  simulateFn() {
    this.isCHG = false;
    // let new_unit: NewUnit[] = this.api.updateSimulatedvalue(
    //   this.inputForm.value
    // );
    // this.inputForm.controls[key].patchValue({
    //   mac: sarr.simulated.mac,
    //   te: sarr.simulated.te,
    //   rp: sarr.simulated.rp,
    // });
    this.simulateSummary();
  }

  simulateSummary(el?: HTMLElement) {
    // console.log(this.units, 'CURRENT UNITS11sss');
    this.simulatedArray = [];
    // console.log(this.inputForm.value, 'VALUES');
    let new_units = { ...this.units };

    // debugger;
    // console.log(Object.values(new_units), 'values');
    // debugger;

    let new_unit: NewUnit[] = this.api.updateSimulatedvalue(
      Object.values(new_units) as NewUnit[],
      this.inputForm.value,
      this.date_lpi,
      this.date_rsp,

      this.date_cogs
    );
    // console.log(new_unit, 'NEW UNIT');
    // console.log(this.units, 'CURRENT UNITS');
    //  this.aggregate(new_unit)
    let products = this.productFilterSubject.getValue();
    if (products.length == 0) {
      products.push('ALL');
      this.product_filter.forEach((e) => {
        products.push(e);
      });
    }
    // console.log(products, 'PRODUCTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
    if (products.includes('ALL')) {
      var index = products.indexOf('ALL');
      // if (index !== -1) {
      products.splice(index, 1);
      // console.log('PROCESSING ALL');
      this.populateSummary(new_unit, 'ALL');
      // }
    }
    // else{
    console.log(products, 'PRODUCTS ARRAY');
    products.forEach((p) => {
      this.populateSummary(
        new_unit.filter((unit) => unit.product_group === p),
        p
      );

      // console.log(p, 'PROCESSING');
    });

    // }

    // products.forEach(p=>{
    //   this.populateSummary(p,new_unit)
    // })
    // this.populateSummary(new_unit);
    if (el) {
      this.scroll(el);
      // this.isSimulate = true;
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({
      behavior: 'smooth',
    });
  }
  @HostListener('window:scroll')
  checkScroll() {
    // let ele: any = this.simulate;
    // this.topScroll = ele.nativeElement.offsetHeight;
    // this.scrollHeaderPosition = this.scrollHeader.nativeElement.offsetTop;
    // this.filterHeaderPosition = this.filterHeader.nativeElement.offsetTop;
    // if (window.pageYOffset > this.filterHeaderPosition) {
    //   this.sticky_header = true;
    // } else {
    //   this.sticky_header = false;
    // }
    // console.log(this.scrollHeaderPosition, 'SCROLL HEAD POSITION');
    // console.log(window.pageYOffset, 'SCROLL HEAD POSITION Windows');
    // console.log(this.filterHeaderPosition, 'filter HEAD POSITION');
    // if (window.pageYOffset > this.scrollHeaderPosition - 70) {
    //   // this.scrollHeader.nativeElement.classList.add("sticky")
    //   this.sticky = true;
    //   this.isSimulate = true;
    // } else {
    //   // this.scrollHeader.nativeElement.classList.remove("sticky")
    //   this.sticky = false;
    //   this.isSimulate = false;
    // }
  }
  ngAfterViewInit() {
    // this.scrollHeaderPosition = 0
    // console.log(this.scrollHeader , "SCROLL HEADER..")
    // this.scrollHeaderPosition = this.scrollHeader.nativeElement.offsetTop;
    // this.filterHeaderPosition = this.filterHeader.nativeElement.offsetTop;
    // let ele:any = this.initElement
    // if(ele){
    //   // console.log(ele.nativeElement.offsetHeight , "OFFSET TOP")
    // }
    // console.log(window.pageYOffset , "WINDOS OFFSET")
  }
  ngOnDestroy() {
    this.scrollHeaderPosition = 0;
    this.filterHeaderPosition = 0;
  }
}
