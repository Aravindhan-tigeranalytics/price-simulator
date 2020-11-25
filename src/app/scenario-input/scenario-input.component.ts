import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  ElementRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../shared/services/api.service';
import { NewUnit } from '../shared/models/unit';
import { SimulatorInput, SimulatedSummary } from '../shared/models/input';
import { Observable, of, from, BehaviorSubject, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
} from 'rxjs/operators';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-scenario-input',
  templateUrl: './scenario-input.component.html',
  styleUrls: ['./scenario-input.component.scss'],
})
export class ScenarioInputComponent implements OnInit {
  isSimulate = false;
  date;
  panelOpenState = false;
  params = ['Current Values', 'Simulated', 'ABS Change', '% Change'];

  retailers = new FormControl();
  categories = new FormControl();
  products = new FormControl();
  categoryFilterSubject = new BehaviorSubject([]);
  productFilterSubject = new BehaviorSubject([]);
  retailerFilterSubject = new BehaviorSubject([]);
  tableData$: Observable<NewUnit[]>;
  inputList: string[];
  categories_filter = [];
  retailer_filter = [];
  product_filter = [];
  // @ViewChild('initElement') initElement: HTMLElement;
  @ViewChild('simulate') simulate: HTMLElement;
  @ViewChild('scrollHeader') scrollHeader: ElementRef;
  sticky: boolean = false;
  topScroll = 0;
  scrollHeaderPosition = 0;
  units: NewUnit[];
  simulatorInput: SimulatorInput[] = new Array();
  inputForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {
    // this.inputForm = new FormGroup({})
  }
  resetDate() {
    this.date = null;
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
    // console.log(this.products.value,"Products")
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
      this.productFilterSubject.next(this.product_filter);
    } else {
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
  resetFilter() {}

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  ngOnInit(): void {
    this.scrollHeaderPosition = 0;
    this.tableData$ = this.api.getUnits();
    this.tableData$.subscribe((data: NewUnit[]) => {
      this.units = data;
      this.inputList = this.aggregate(this.units);
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
          parseFloat(data.mars_cogs_per_unit.replace(/,/g, '')),
          parseFloat(data.list_price.replace(/,/g, '')),
          parseFloat(data.retailer_median_base_price.replace(/,/g, '')),

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
    // console.log(group , "GROUP FOR FOM")
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
      mac: new FormControl('-'),
      rp: new FormControl('-'),
      te: new FormControl('-'),
    };
  }

  populateSummary(units: NewUnit[]) {
    // let totalrsv$ =  of(...units).pipe(
    //      reduce((a, b) => a + ((b.base_units)), 0)
    //      )
    let total_base$ = of(...units).pipe(
      reduce((a, b) => a + parseFloat(b.base_units.replace(/,/g, '')), 0)
    );
    let total_base_new$ = of(...units).pipe(
      reduce((a, b) => a + b.new_base_units, 0)
    );
    let total_weight_in_tons$ = of(...units).pipe(
      reduce((a, b) => a + parseFloat(b.total_weight_in_tons), 0)
    );
    let total_weight_in_tons_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_weight_in_tons_new, 0)
    );
    let total_lsv$ = of(...units).pipe(
      reduce((a, b) => a + parseFloat(b.total_lsv.replace(/,/g, '')), 0)
    );
    let total_lsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_lsv_new, 0)
    );
    let total_rsv$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat, 0)
    );
    let total_rsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat_new, 0)
    );
    let total_nsv$ = of(...units).pipe(
      reduce((a, b) => a + parseFloat(b.total_nsv.replace(/,/g, '')), 0)
    );
    let total_nsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_nsv_new, 0)
    );

    let trade_expense$ = of(...units).pipe(
      reduce((a, b) => a + parseFloat(b.trade_expense.replace(/,/g, '')), 0)
    );
    let trade_expense_new$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense_new, 0)
    );

    let mars_mac$ = of(...units).pipe(
      reduce((a, b) => a + parseFloat(b.mars_mac.replace(/,/g, '')), 0)
    );
    let mars_mac_new$ = of(...units).pipe(
      reduce((a, b) => a + b.mars_mac_new, 0)
    );
    let retailer_margin$ = of(...units).pipe(
      reduce((a, b) => a + parseFloat(b.retailer_margin.replace(/,/g, '')), 0)
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
        console.log(baseSummary, 'BASE SUMMARY');
        console.log(SimulateSummary, 'SIMULATED SUMMARY');
      }
    );
  }

  simulateSummary(el: HTMLElement) {
    // console.log(this.inputForm.value , "VALUES")
    let new_unit: NewUnit[] = this.api.updateSimulatedvalue(
      this.inputForm.value
    );
    //  this.aggregate(new_unit)
    this.populateSummary(new_unit);
    this.scroll(el);
  }

  scroll(el: HTMLElement) {
    this.isSimulate = true;
    el.scrollIntoView({
      behavior: 'smooth',
    });
  }
  @HostListener('window:scroll')
  checkScroll() {
    let ele: any = this.simulate;
    this.topScroll = ele.nativeElement.offsetHeight;
    this.scrollHeaderPosition = this.scrollHeader.nativeElement.offsetTop;
    // console.log(this.scrollHeaderPosition , "SCROLL HEAD POSITION")
    // console.log(window.pageYOffset , "SCROLL HEAD POSITION Windows")
    if (window.pageYOffset > this.scrollHeaderPosition) {
      // this.scrollHeader.nativeElement.classList.add("sticky")
      this.sticky = true;
      this.isSimulate = true;
    } else {
      // this.scrollHeader.nativeElement.classList.remove("sticky")
      this.sticky = false;
      this.isSimulate = false;
    }
  }
  ngAfterViewInit() {
    // this.scrollHeaderPosition = 0
    // console.log(this.scrollHeader , "SCROLL HEADER..")

    this.scrollHeaderPosition = this.scrollHeader.nativeElement.offsetTop;

    // let ele:any = this.initElement
    // if(ele){
    //   // console.log(ele.nativeElement.offsetHeight , "OFFSET TOP")

    // }
    // console.log(window.pageYOffset , "WINDOS OFFSET")
  }
  ngOnDestroy() {
    this.scrollHeaderPosition = 0;
  }
}
