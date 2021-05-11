import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';
// import { ReplaySubject,BehaviorSubject} from 'rxjs';
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

import {PriceScenarioService} from '../shared/services/price-scenario.service'
import { ApiService } from '../shared/services/api.service';
import { NewUnit } from '../shared/models/unit';

@Component({
  selector: 'app-scenario-year-plan',
  templateUrl: './scenario-year-plan.component.html',
  styleUrls: ['./scenario-year-plan.component.scss']
})
export class ScenarioYearPlanComponent implements OnInit {
  combination = []
  curr_year;


  retailer_filter = [];
  retailers = new FormControl();
  retailersFilterCtrl: FormControl = new FormControl('');
  public filteredRetailers : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  category_filter = [];
  categories = new FormControl();
  categoriesFilterCtrl: FormControl = new FormControl('');
  public filteredCategories : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  product_filter = [];
  products = new FormControl();
  productsFilterCtrl: FormControl = new FormControl('');
  public filteredProducts : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  cell_filter = [];
  cells = new FormControl();
  cellsFilterCtrl: FormControl = new FormControl('');
  public filteredCells : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  brand_filter = [];
  brands = new FormControl();
  brandsFilterCtrl: FormControl = new FormControl('');
  public filteredBrands : ReplaySubject<any[]> = new ReplaySubject<any[]>(1); 

  brand_format_filter = [];
  brandFormats = new FormControl();
  brandFormatsFilterCtrl: FormControl = new FormControl('');
  public filteredBrandFormats : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  simulateFlag$ = new BehaviorSubject<boolean>(false);
  constructor(private priceScenarioService:PriceScenarioService,private api: ApiService ) { }

  ngOnInit(): void {
    this.priceScenarioService.initYearlyUnitsObservable.pipe(
      filter(data=>data.length > 0)
    ).subscribe(data=>{
      this.populateFilter(data)
    })
     
     
         
      
         

     

//     setTimeout(()=>{
// this.category_filter =  ['cat1','cat2','cat3']
// this.retailer_filter = ['1','11','2'];
// this.product_filter = ['p1','p11','p3'];
// this.cell_filter =  ['cat1','cat2','cat3']
// this.brand_filter = ['1','11','2'];
// this.brand_format_filter = ['p1','p11','p3'];
// this.filteredRetailers.next(['1','11','2'])
//     this.filteredCategories.next(['cat1','cat2','cat3'])
//     this.filteredProducts.next(['p1','p11','p3'])
//     this.filteredCells.next(['1','11','2'])
//     this.filteredBrands.next(['cat1','cat2','cat3'])
//     this.filteredBrandFormats.next(['p1','p11','p3'])
//     },5000)
    
    
  }
  private _checkForm(form : FormControl){
    return form.value && form.value.includes("ALL")
  }
  reset(){
    this.categories.reset();
    this.retailers.reset();
    this.products.reset();
    this.cells.reset()
    this.brandFormats.reset()
    this.brands.reset()
    this.filteredProducts.next(this.product_filter)
    this.filteredRetailers.next(this.retailer_filter)
    this.filteredCategories.next(this.category_filter)
    this.filteredBrandFormats.next(this.brand_format_filter)
    this.filteredBrands.next(this.brand_filter)
    this.filteredCells.next(this.cell_filter)
    this.apply();
  }
  apply(){
    let category = []
    let retailer = []
    let product = []
    let cells=[]
    let brands = []
    let brand_format = []
    category = this._checkForm(this.categories) ? this.category_filter : this.categories.value
    retailer = this._checkForm(this.retailers)  ? this.retailer_filter : this.retailers.value
    product =  this._checkForm(this.products)  ? this.product_filter : this.products.value
    cells = this._checkForm(this.cells) ? this.cell_filter : this.cells.value
    brands =  this._checkForm(this.brands)  ? this.brand_filter : this.brands.value
    brand_format = this._checkForm(this.brandFormats) ? this.brand_format_filter  : this.brandFormats.value
    // if (this._checkForm(this.categories)) {
    //   category = this.category_filter
    // } else {
    //   category = this.categories.value
    //   // this.categoryFilterSubject.next(this.categories.value);
    // }
    // if (this._checkForm(this.retailers)) {
    //   retailer = this.retailer_filter
    //   // this.retailerFilterSubject.next(this.retailer_filter);
    // } else {
    //   retailer = this.retailers.value
    //   // this.retailerFilterSubject.next(this.retailers.value);
    // }
    // if (this._checkForm(this.products)) {
    //   product = this.product_filter
 
    // } else {
    //  product = this.products.value;
      
     
    // }
    
    this.priceScenarioService.filterTableDataYear(category,
    product,
    retailer,
    cells,
    brands,
    brand_format,
    this.curr_year
    )
   
  }
  filterYear(e){
    this.curr_year = e
     this.apply()

  }

  filtersEvent(e){
    console.log(e , "events")
    this.products.patchValue(e.poduct)
    this.categories.patchValue(e.category)
    this.retailers.patchValue(e.retailer)
    this.apply()

  }
  saveScenarioEvent($event){
    console.log($event , "SAVE EVENT")
    let res ={}
    let id = null
    let result;
    if("id" in $event){
      id = $event.id

    }
    res['yearlyForm'] = $event.yearlyForm
    res['productFilter'] =  this.products.value 
    res['categoryFilter'] = this.categories.value
    res['retailerFilter'] = this.retailers.value
    res['brandFilter'] = this.brands.value
    res['brandFormatFilter'] = this.brandFormats.value
    res['cellFilter'] = this.cells.value
    console.log(res , "SAVING RE")
    // debugger
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
        res,
        true
      )

    }
    else{
     result= this.api
      .saveScenario(
        $event.scenarioName,
        $event.scenarioComment,
        res,
        true
      )

    }
        
      result.subscribe((data) => {
        console.log(data , "DATA ")
        
       
      },
      error=>{
        console.log(error , "ERROR")
        throw error
       
      });
  }
  populateFilter(datas){
    this.retailer_filter = []
    this.category_filter = []    
    this.product_filter = []
    this.brand_filter = []
    this.brand_format_filter = []
    this.cell_filter = []
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
        this.category_filter.push(data.category);
        this.filteredCategories.next(this.category_filter)
      });
     
  
      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.product_group))
      .subscribe((data) => {
        this.product_filter.push(data.product_group);
        this.filteredProducts.next(this.product_filter);
      });

      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.brand_filter))
      .subscribe((data) => {
        this.brand_filter.push(data.brand_filter);
        this.filteredBrands.next(this.brand_filter);
      });

      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.brand_format_filter))
      .subscribe((data) => {
        this.brand_format_filter.push(data.brand_format_filter);
        this.filteredBrandFormats.next(this.brand_format_filter);
      });

      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.strategic_cell_filter))
      .subscribe((data) => {
        this.cell_filter.push(data.strategic_cell_filter);
        this.filteredCells.next(this.cell_filter);
      });

      of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.retailer+"-"+unit.product_group+"-"+unit.category))
      .subscribe((data) => {
        this.combination.push(data)
         
       });
  }

}
