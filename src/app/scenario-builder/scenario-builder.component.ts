import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';
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
  ReplaySubject,
  pipe,
} from 'rxjs';
import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
  take
} from 'rxjs/operators';
import { ApiService } from '../shared/services/api.service';
import {PriceScenarioService} from '../shared/services/price-scenario.service'
import { NewUnit } from '../shared/models/unit';
import { Options } from "@angular-slider/ngx-slider";
interface Bank {
  id: string;
  name: string;
}
@Component({
  selector: 'app-scenario-builder',
  templateUrl: './scenario-builder.component.html',
  styleUrls: ['./scenario-builder.component.scss'],
})

export class ScenarioBuilderComponent implements OnInit {
  // value = 2019;
  // options: Options = {
  //   showTicksValues: true,
  //   stepsArray: [
  //   ]
  // };
  active = 1;
  filters
  arr = [1, 2, 3, 4, 5];
  disabled = true
  combination = []
 
   
  tableData$: Observable<NewUnit[]>;

  retailer_filter = [];
  retailers = new FormControl();
  public filteredRetailers : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public retailersFilterCtrl: FormControl = new FormControl('');

  product_filter = [];
  products = new FormControl();
  public filteredProducts : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public productsFilterCtrl: FormControl = new FormControl('');

  categories_filter = [];
  categories = new FormControl();
  public filteredCategories : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public categoriesFilterCtrl: FormControl = new FormControl('');

  simulateFlag$ = new BehaviorSubject<boolean>(false);
  simulate;
  isSimulate = false;
  date_lpi;
  date_rsp;
  date_cogs;
  isCHG;
  initialForm = null;
  allDisabled  = false
  // decimalFormat = '1.0-1';
  // simulated_summary_obj = {

  // }
  decimalFormat = '1.0-1';
  panelOpenState = false;
  scenarioComment;
  scenarioName;
  expanded_flag = false;
  params = ['Current Values', 'Simulated', 'ABS Change', '% Change'];
  base_summary: SimulatedSummary = new SimulatedSummary(0, 0, 0, 0,0, 0, 0, 0, 0);
  simulated_summary: SimulatedSummary = new SimulatedSummary(
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  );

  // retailers = new FormControl();
  // categories = new FormControl();
  // products = new FormControl();
  categoryFilterSubject = new BehaviorSubject([]);
  productFilterSubject = new BehaviorSubject([]);
  retailerFilterSubject = new BehaviorSubject([]);

  inputList: string[];
  // categories_filter = [];
  // retailer_filter = [];
  // product_filter = [];
  update = false;
  // @ViewChild('initElement') initElement: HTMLElement;
  // @ViewChild('simulate') simulate: HTMLElement;
  // @ViewChild('scrollHeader') scrollHeader: ElementRef;
  // @ViewChild('filterHeader') filterHeader: ElementRef;
  // @ViewChild('closebutton') closebutton: ElementRef;
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

  
  // units: NewUnit[];
  constructor(private api: ApiService , private priceScenario:PriceScenarioService) {}

  allEvent(event){
    // console.log(event , "EVENT")
    if ((event as Array<any>).includes('ALL')){
      this.products.patchValue(this.product_filter.concat(event))

    }
    if((event as Array<any>).length == this.product_filter.length && !(event as Array<any>).includes('ALL')){
      this.products.patchValue([])
    }
    this.allDisabled = true
  }
  changeYear(event){
    this.applyFilter()
    //  console.log(this.value , "value changed")
  }

  ngOnInit(): void {
    
    this.retailers.valueChanges.subscribe(data=>{
      console.log(this.combination , "COMBINATON")
      console.log(data , " RETAILERS ")
    //  let cat =  this.categories.value
    //  let prod = this.products.value
    //  console.log(cat , "CAT")
    //  console.log(prod , "PROD")
      if(data && data.length > 0){
        let filtered = this.combination.filter(d=>data.includes(d.retailer))
       this.filteredProducts.next([...new Set(filtered.map(d=>d.product_group))])
       this.filteredCategories.next([...new Set(filtered.map(d=>d.category))])
      }
      console.log(this.filteredProducts , " filtered products ")
      console.log(this.filteredCategories , " filtered categories ")
      // console.log()
    })
    this.categories.valueChanges.subscribe(data=>{
      console.log(data , " CATEGORIES ")
      console.log(this.combination , "COMBINATON")
      if(data && data.length > 0){
        let filtered = this.combination.filter(d=>data.includes(d.category))
       this.filteredRetailers.next([...new Set(filtered.map(d=>d.retailer))])
       this.filteredProducts.next([...new Set(filtered.map(d=>d.product_group))])
      }
    })
    // this.products.valueChanges.subscribe(data=>{
    //   console.log(data , " PRODUCTS ")
    //   console.log(this.combination , "COMBINATON")
    //   if(data && data.length > 0){
    //     let filtered = this.combination.filter(d=>data.includes(d.product_group))
    //    this.filteredRetailers.next([...new Set(filtered.map(d=>d.retailer))])
    //    this.filteredCategories.next([...new Set(filtered.map(d=>d.category))])
    //   }
    // })
    
    
   
      this.retailersFilterCtrl.valueChanges
          .subscribe((d) => {
            // console.log(d , "ret")
           
            this.filterRetailer();
          });
          this.productsFilterCtrl.valueChanges
          .subscribe((d) => {
            // console.log(d , "prod")
           
            this.filterProduct();
          });
          this.categoriesFilterCtrl.valueChanges
          .subscribe((d) => {
            // console.log(d , "cat")
            this.filterCategories();
          });
    this.tableData$ = this.priceScenario.getUnits();
    this.tableData$.subscribe((data: NewUnit[]) => {
      // setTimeout(()=>{
        console.log(data , "UNITSSSSSSSSSSSSSSSS")
        this.units = data
        // this.inputList = this.aggregate(this.units);
       

      // },5000)
      
     
    });
    this.priceScenario.getInitUnits().
    pipe(
      filter(data => data.length > 0)
    ).subscribe(data=>{
      // console.log(data , "UNITSSSSSSSSSSSSSSSS TAKE")
      this.populateFilter( data);
    })
   
      // this.populateFilter( this.priceScenario.getUnitValue());
   
  }
  private filterProduct(){
    // console.log(this.retailer_filter)
    if (!this.product_filter) {
      return;
    }

    // get the search keyword
    let search = this.productsFilterCtrl.value;
    // console.log(search , "SEARCH")
    if (!search) {
      this.filteredProducts.next(this.product_filter.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the banks
    this.filteredProducts.next(
      this.product_filter.filter(data => data.toLowerCase().indexOf(search) > -1)
    );

  }
  private filterRetailer(){
    // console.log(this.retailer_filter)
    if (!this.retailer_filter) {
      return;
    }

    // get the search keyword
    let search = this.retailersFilterCtrl.value;
    // console.log(search , "SEARCH")
    if (!search) {
      this.filteredRetailers.next(this.retailer_filter.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the banks
    this.filteredRetailers.next(
      this.retailer_filter.filter(data => data.toLowerCase().indexOf(search) > -1)
    );

  }
  private filterCategories(){
    // console.log(this.retailer_filter)
    if (!this.categories_filter) {
      return;
    }

    // get the search keyword
    let search = this.categoriesFilterCtrl.value;
    // console.log(this.categoriesFilterCtrl.dirty, "category dirty")
    // console.log(search , "SEARCH")
    if (!search) {
      this.filteredCategories.next(this.categories_filter.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the banks
    this.filteredCategories.next(
      this.categories_filter.filter(data => data.toLowerCase().indexOf(search) > -1)
    );

  }
  saveScenarioEvent($event){
    let res ={}
    let id = null
    let result;
    if("id" in $event){
      id = $event.id

    }
    res['formArray'] = $event.formArray
    res['productFilter'] =  this.products.value 
    res['categoryFilter'] = this.categories.value
    res['retailerFilter'] = this.retailers.value
    // console.log(this.products.value , "Product filter ")
    // console.log(this.categories.value , "Product filter ")
    // console.log(this.retailers.value , "Product filter ")
    // console.log($event , "SAVE EVENT  ")
    if(id){
      result = 
      result= this.api
      .editScenario(id,
        $event.scenarioName,
        $event.scenarioComment,
        res
      )

    }
    else{
     result= this.api
      .saveScenario(
        $event.scenarioName,
        $event.scenarioComment,
        res
      )

    }
        
      result.subscribe((data) => {
        // console.log(data , "DATA ")
        
       
      },
      error=>{
        console.log(error , "ERROR")
        throw error
       
      });
  }
   
  filtersEvent(event){

    console.log(event , "EVENT FROM INPUT")
    this.products.patchValue(event.product)
    this.categories.patchValue(event.category)
    this.retailers.patchValue(event.retailer)
    this.applyFilter()
  }
  // populateFilterDynamic(datas){
    
    
  // }

  populateFilter(datas) {
    this.retailer_filter = []
    this.categories_filter = []    
    this.product_filter = []
    of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.retailer))
      .subscribe((data) => {
        this.retailer_filter.push(data.retailer);
        this.filteredRetailers.next(this.retailer_filter)
       },err=>{

      },()=>{
        
        
         
      });
      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.category))
      .subscribe((data) => {
        this.categories_filter.push(data.category);
        this.filteredCategories.next(this.categories_filter)
      });
     
  
      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.product_group))
      .subscribe((data) => {
        this.product_filter.push(data.product_group);
        this.filteredProducts.next(this.product_filter);
      });

      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.retailer+"-"+unit.product_group+"-"+unit.category))
      .subscribe((data) => {
        this.combination.push(data)
         
       });
      //  of(...datas)
      //  .pipe(distinct((unit: NewUnit) => unit.year))
      //  .subscribe((data) => {
      //   console.log(data, "STEP ARRY")
        
      //    this.options.stepsArray.push({ value:data.year })
        
      //  },()=>{},()=>{
      //   let arr = this.options.stepsArray
      //   if(arr.length > 0){
      //     this.value = arr[0].value
      //     this.applyFilter()
           
      //   }
      //  });
      
    
  }
  ResetSummary() {
    this.simulateFlag$.next(false);
  }
  SimulateSummary() {
    this.simulateFlag$.next(true);
    // console.log('CLICKED');
  }
  applyFilter() {
   
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
   this.filters = arr;
   // console.log(arr, 'AFTER PUSH');
   // console.log([...new Set(arr)], 'UNIQUE');
   // && this.products.value.includes('ALL')
   this.productFilterSubject.next(arr);
 } else {
  this.filters = this.products.value;
   // console.log(this.products.value, 'ARARAA else');
   // let arr = this.products.value;
   this.productFilterSubject.next(this.products.value);
 }
// console.log(this.productFilterSubject.getValue() , "FILTERED PRODUCT")
// console.log(this.categoryFilterSubject.getValue() , "category PRODUCT")
// console.log(this.retailerFilterSubject.getValue() , "retialer PRODUCT")
 this.priceScenario.filterTableData(this.categoryFilterSubject.getValue(),
 this.productFilterSubject.getValue() ,
 this.retailerFilterSubject.getValue(),
// this.value
 )
// debugger;
// console.log(this.productFilterSubject.getValue() , "FILTERED PRODUCT")
// console.log(this.categoryFilterSubject.getValue() , "category PRODUCT")
// console.log(this.retailerFilterSubject.getValue() , "retialer PRODUCT")

//  combineLatest([
//    this.tableData$,
//    this.categoryFilterSubject,
//    this.productFilterSubject,
//    this.retailerFilterSubject,
//  ])
//    .pipe(
//      map(([units, category, product, retailer]) => {
     
//        if (category && category.length > 0) {
//          units = units.filter((unit) => category.includes(unit.category));
//        }
//        if ( product && product.length > 0) {
//          units = units.filter((unit) =>
//            product.includes(unit.product_group)
//          );
//        }
//        if (retailer && retailer.length > 0) {
//          units = units.filter((unit) => retailer.includes(unit.retailer));
//        }

//        return units;
//      })
//    )
//    .subscribe((data) => {
//       console.log(data , "FILTERED DATA ")
//       this.units = data;
      
//    });
}
resetFilter() {
  console.log(this.product_filter , "product filter")
  console.log(this.productsFilterCtrl.value , "product filter value")
  console.log(this.products , "products ")
 this.categories.reset();
 this.retailers.reset();
 this.products.reset();
 this.filteredProducts.next(this.product_filter)
 this.filteredRetailers.next(this.retailer_filter)
 this.filteredCategories.next(this.categories_filter)
 this.applyFilter();
}
  // applyFilter() {
  //   console.log(this.products.value , "values")
  //   this.api.productFilterObservable.next(this.products.value)
    
  // }
 
}
