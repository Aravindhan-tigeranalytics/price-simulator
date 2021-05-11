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
  OnChanges,
  ViewChildren,
  QueryList
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../shared/services/api.service';
import {PriceScenarioService} from "../shared/services/price-scenario.service"
import {ModalService} from "../shared/services/modal.service"
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
  // from,
  BehaviorSubject,
  Subject,
  combineLatest,
  forkJoin,
  pipe,
  fromEvent,
  Subscription,
  concat,
  zip,
  

  
  
} from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ExcelServicesService } from '../shared/services/excel.service';
import {FormService} from '../shared/services/form.service'
import { Options } from "@angular-slider/ngx-slider";

import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
  finalize,
  debounceTime,
  startWith,
  takeUntil,
  switchMap,
  concatMap,
  mergeScan,
  scan,
  

} from 'rxjs/operators';
import { Directive } from '@angular/core';
// import { debug } from 'console';
 
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
@Directive({
  selector: 'span[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '[class.sortable]': 'direction === ""',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: any = '';
  @Input() direction: string = '';
  @Output() sort = new EventEmitter<any>();
  rotateDirection: {[key: string]: any} = { 'asc': 'desc', 'desc': '', '': 'asc' };

  rotate() {
    // console.log(this.direction , "DIRECTION IN DIRECTIVE")
   
   
    this.direction = this.rotateDirection[this.direction];
    // console.log(this.direction, "AFTER ROTATE")
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'app-scenario-input-yearly',
  templateUrl: './scenario-input-yearly.component.html',
  styleUrls: ['./scenario-input-yearly.component.scss']
})
export class ScenarioInputYearlyComponent implements OnInit {
  value = null;
  yearMap = {}
  options: Options = {
    showTicksValues: true,
    stepsArray: [
     
      // { value: 2019 },
      // { value: 2020 },
    ],
    // translate : (value,i) =>{
    //   // cos
    //   console.log(value , "value of steps " , i)
    //   return 'wwww'
    // }
  };
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  // @Input('tableData') tableData$: Observable<NewUnit[]>;
  // @Input('units') _units: NewUnit[];
  private unsubscribe$: Subject<any> = new Subject<any>();
  @Input('simulteFlag') simulteFlag$: Observable<boolean>;
     @Output() simulateSummaryEvent = new EventEmitter<boolean>();
  @Output() filtersEvent = new EventEmitter<any>();
  @Output() saveScenarioEvent = new EventEmitter<any>()
  @Output() yearEvent = new EventEmitter<any>()
  simulate;
  isSimulate = false;
  date_lpi=null;
  date_rsp=null;
  date_cogs=null;
  isCHG;
  initialForm = null;
  scenarios;
  scenarioArray;
  selectedScenario = new FormControl();
  simulatedData;
  // decimalFormat = '1.0-1';
  // simulated_summary_obj = {

  // }
  decimalFormat = '1.0-2';
  panelOpenState = false;
  scenarioComment="";
  scenarioName="";
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

  retailers = new FormControl();
  categories = new FormControl();
  products = new FormControl();
  categoryFilterSubject = new BehaviorSubject([]);
  productFilterSubject = new BehaviorSubject([]);
  retailerFilterSubject = new BehaviorSubject(null);
  savedScenario;
  chosenScenario;
  // selectedScenario;

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
  myForm : FormGroup;
  inputFormArray : FormArray
  minDate: Date = new Date();
  maxDate: Date = new Date(1950,1,1);
fg

  constructor(
    private modalService: ModalService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private excel: ExcelServicesService,
    private router: Router,
    private formSevice : FormService,
    private priceScenarioService : PriceScenarioService
  ) { 
    this.inputFormArray = new FormArray([]);
    this.myForm = this.formBuilder.group({
      year : [],
      inputFormArray : this.formBuilder.array([])
    })
  }

  ngOnInit(): void {
    this.fg = this.formSevice.getForms() 
    // this.priceScenarioService.initYearlyUnitsObservable.subscribe(data=>{
    //   console.log(data , "init data..")
    //   if(data && data.length > 0){
    //     this.populateFilter(data)

    //   }
    //      })
    let init$ = this.priceScenarioService.initYearlyUnitsObservable
    // let filter$ = this.populateFilterObservable
    let filter$ = init$.pipe(
      filter(data=>data.length > 0),
     
      switchMap(data=>{
         
        return this.populateFilterObservable(data)
         

      }),
      switchMap(data=>{
        return this.priceScenarioService.yearlyUnitsObservable
      })
       
    )
    filter$.subscribe(data=>{
        if(data && data.length > 0){
          console.log(data , "DATA ")
                  this.units = data 
                  this.init()
                  this.updateForm()
                  // console.log(this.units , "DATA ")
                  // this.simulateFn()
        
              }
     
    })
    // combineLatest([filter$ , this.priceScenarioService.yearlyUnitsObservable]).subscribe(([data1,data])=>{
    //   if(data && data.length > 0){
    //               this.units = data 
    //               this.init()
    //               this.updateForm()
    //               this.simulateFn()
        
    //           }
    // })
    
    // this.priceScenarioService.yearlyUnitsObservable.pipe(
    //   takeUntil  (this.unsubscribe$)
    // )
    //   .subscribe(data=>{
    //       if(data && data.length > 0){
    //           this.units = data 
    //           this.init()
    //           this.updateForm()
    //           this.simulateFn()
    
    //       }
        
    //   },
    //   (err)=>{
  
    //   },()=>{
    //     console.log("COMPLETED")
    //   })
       
      
      this.priceScenarioService.getSimulatedArray().subscribe(data=>{
        if(data && data.length > 0){
          this.simulatedArray = data
        }
      })
    
     
      this.scrollHeaderPosition = 0;
      this.filterHeaderPosition = 0;
   
  
      this.simulteFlag$.subscribe((data) => {
        if (data) {
          this.simulateFn();
        }
  
        
      });
     
  }
  downloadExcel(){
    let form = this.myForm.get('inputFormArray')
    // console.log(form.value , "form values...")
    this.excel.exportAsExcelFile(form.value , "modify")
  }
  onSort({column, direction}: any) {
    // console.log(column , "C")
    // console.log(direction , "DIR")
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    let form = this.myForm.get('inputFormArray')
    let unsorted =form.value
    if (direction === '') {
    // let unsorted =this.inputFormArray.value
    } else {
     unsorted = [...unsorted].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
     
    form.patchValue(unsorted)
     
   
  }
  sortNull(...args) {
   return 0
  }
  init(){
    this.minDate  = new Date();
    this.maxDate  = new Date(1950,1,1);
     
    this.inputList = this.aggregate(this.units);
    // if(this.savedScenario){
      
    //      const control = <FormArray>this.myForm.controls['inputFormArray'];
    // this.savedScenario.formArray.forEach(element => {
    //   let form = (this.myForm.get('inputFormArray') as FormArray).
    //   controls.find((d:FormGroup)=>d.controls.product_group.value == element.product_group)
    //   let obj = {}
    //   for (var key of Object.keys(element)) {
    //     obj[key] = element[key]
    // }
    // form.patchValue(obj)
    // });

    // }
    
   
// console.log(this.myForm.value , "FORM VALUE YEAR UPDATE ")

  }
  ngOnChanges(changes) {
    // console.log(changes , "CCCCCCCCCCCCCCCCCCCCCCCCCCC")
    if('_units' in changes){
      if(changes._units.currentValue){

        // this.units = changes._units.currentValue;
      }
      

    }
    // this.init()
     
         }
      updateForm(){
        // let f : FormGroup =  this.formSevice.getForm();
        
        // let fr : {} = this.formSevice.getForms();
        // console.log(fr , "FORM s")
        // debugger
        // if(fr){
         
        //   if(fr['formValue']){
        //     this.myForm.get('inputFormArray').patchValue(fr['formValue']['inputFormArray'])
    
        //   }
        //   if(fr['date_cogs']){
        //     this.date_cogs = fr['date_cogs']
        //   }
        //   if(fr['date_lpi']){
        //     this.date_lpi = fr['date_lpi']
    
        //   }
        //   if(fr['date_rsp']){
        //     this.date_rsp = fr['date_rsp']
    
        //   }
        //   if(fr['selectedScenario']){
        //     this.selectedScenario.patchValue(fr['selectedScenario'].value)
    
        //   }
    
        // }
        this.updateYear()
   
       
      }
      updateYear(){
        let prev = this.value -1
        // console.log(this.value , "current value")
        // console.log(this.options.stepsArray, "STEPS ARRAY")
        if(this.options.stepsArray.length > 0){
          let initYear = this.options.stepsArray[0].value 
        // console.log(this.options.stepsArray[0].value , "options year ")
       

        }
        let initYear = this.options.stepsArray[0].value 
        let yearForm = this.formSevice.getFormYear()
        console.log(yearForm , "YEARFORM")
        
        


        
        if(yearForm.length > 0){
          let prevForm = yearForm.find(d=>d.year == prev)
          let currForm = yearForm.find(d=>d.year == this.value)
          let formArray = this.myForm.get('inputFormArray') as FormArray
          console.log(prevForm , "prev")
          console.log(currForm , "currform")

          if(prevForm){
            formArray.controls.forEach((arr,i)=>{
              // console.log(i , "INDEX")
           
              let ar = prevForm['inputFormArray'].find(d=>d.product_group == arr.value['product_group'])
              // console.log(ar , "prev form")
               
              arr.patchValue({
                current_lpi : ar['increased_lpi'],
                current_rsp : ar['increased_rsp'],
                current_cogs : ar['increased_cogs'],
                increased_lpi : ar['increased_lpi'],
                increased_rsp : ar['increased_rsp'],
                increased_cogs : ar['increased_cogs'],
              })
            })
            if(currForm){
              console.log(currForm , "currform condition")
              // currForm['']
              this.date_cogs = currForm['cogs_date'];
              this.date_rsp = currForm['rsp_date'];
              this.date_lpi = currForm['lpi_date'];
              // rsp_date : this.date_rsp,
              // lpi_date : this.date_lpi
              formArray.controls.forEach((arr,i)=>{
           
                let ar = currForm['inputFormArray'].find(d=>d.product_group == arr.value['product_group'])
  
                
                
                 
                arr.patchValue({
                  lpi_increase : ar['lpi_increase'],
                  rsp_increase : ar['rsp_increase'],
                  cogs_increase : ar['cogs_increase'],
                  base_price_elasticity : ar['base_price_elasticity'],
                  base_price_elasticity_manual : ar['base_price_elasticity_manual'],
                  net_elasticity : ar['net_elasticity'],
                  competition : ar['competition']
                })
                this.increaseValue(arr, 'lpi_increase',i, Number(ar['lpi_increase']))
                this.increaseValue(arr, 'rsp_increase',i, Number(ar['rsp_increase']))
                this.increaseValue(arr, 'cogs_increase',i, Number(ar['cogs_increase']))
              })
              
    
  

            }
  

          }
          else if(currForm && (initYear == this.value)){
            this.date_cogs = currForm['cogs_date'];
            this.date_rsp = currForm['rsp_date'];
            this.date_lpi = currForm['lpi_date'];
            formArray.patchValue(yearForm.find(d=>d.year == initYear).inputFormArray)
          }
          else {
            // formArray.controls.forEach(arr=>{
           
            //   let ar = currForm['inputFormArray'].find(d=>d.product_group == arr.value['product_group'])

               
              
               
            //   arr.patchValue({
            //     lpi_increase : ar['lpi_increase'],
            //     rsp_increase : ar['rsp_increase'],
            //     cogs_increase : ar['cogs_increase'],
            //     base_price_elasticity : ar['base_price_elasticity'],
            //     base_price_elasticity_manual : ar['base_price_elasticity_manual'],
            //     net_elasticity : ar['net_elasticity'],
            //     competition : ar['competition']
            //   })
            // })
            
  


          }
         
          
          // let formArray = this.myForm.get('inputFormArray') as FormArray
          // if(initYear == this.value){
          //  formArray.patchValue(yearForm.find(d=>d.year == initYear).inputFormArray)

          // } 
          // else{
            // formArray.controls.forEach(arr=>{
           
            //   let ar = yearForm.find(d=>d.year+1 == this.value)['inputFormArray'].find(d=>d.product_group == arr.value['product_group'])
               
            //   arr.patchValue({
            //     current_lpi : ar['increased_lpi'],
            //     current_rsp : ar['increased_rsp'],
            //     current_cogs : ar['increased_cogs'],
            //     increased_lpi : ar['increased_lpi'],
            //     increased_rsp : ar['increased_rsp'],
            //     increased_cogs : ar['increased_cogs1'],
            //   })
            // })
            
  

          // }  
         
           
          

          
        }
        // console.log(this.myForm.value , "updateYear MYFORMVALUE")
        // console.log(this.formSevice.getFormYear(), "updateYear getformupdateear")
        // console.log(this.myForm.get('inputFormArray') , "updateYear input form  year")

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

   
  }
  // resetDate(date) {
    
  // }
  csvInputChange(fileInputEvent: any) {
     
    const target: DataTransfer = <DataTransfer>fileInputEvent.target;
    const reader: FileReader = new FileReader();
    let file = target.files[0]
    // this.api.readExcel(file).subscribe(data=>{
    //   console.log(data )
    // },err=>{
    //   console.log(err, "error")
    // })
    // console.log(file , "file")
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
     
      this.updateElasiticity(this.excel.read(e.target.result));
    };
  }
  updateElasiticity(data) {
    // console.log(data , "DATA ") 
    let form = this.myForm.get('inputFormArray') as FormArray
   
    this.update = true;
   
    data.forEach((element) => {
      if(element.__rowNum__ > 5){
        const obj = Object.values(element)
        form.controls.find(d=>d.get('product_group').value == obj[0]).patchValue({

          base_price_elasticity : Number(obj[3])
        })

      }

    
      
    });
  }
  loadScenario(modal){

    
    let selected = this.scenarios.find((p) => p.id === this.selectedScenario.value);
    console.log(selected , "selected")
    // console.log(this.selectedScenario.value , "selected value")
    // debugger
    let valArr = JSON.parse(selected.savedump)
    console.log(valArr , "value array ")
    if('yearlyForm' in valArr){
      this.formSevice.updateFormYear(valArr.yearlyForm)

    }
    else{
      let o = [{year : this.value,inputFormArray : valArr.formArray}]
      console.log(o, "generated form array for on eyear")
      this.formSevice.updateFormYear(o)
    }
    
    this.savedScenario =  JSON.parse(selected.savedump)
    console.log(JSON.parse(selected.savedump), "SAVED DUMP");
    // console.log(selected , "selected")
    this.chosenScenario = selected
    this.scenarioName = this.chosenScenario.name
    this.scenarioComment = this.chosenScenario.comment
   
      
    this.filtersEvent.emit({
      product : valArr.productFilter,
      retailer : valArr.retailerFilter,
      category : valArr.categoryFilter

    })
    this.close(modal)
  

  }
  deleteScenario(modal){
    this.api.deleteScenario(this.chosenScenario.id).subscribe(data=>{
      this.close(modal)
      // console.log(this.scenarioArray , "SCE ARR")
      this.scenarioArray.filter(d=>d.id!=this.chosenScenario.id)
      this.chosenScenario =null
    })

    // this.close(modal)
  }
  editScenario(mymodal){
    let formval = this.formSevice.getFormYear()
    let form = [{...this.getFormValue(),year : this.value}]
    let res ={}
    
    res['id'] = this.chosenScenario.id
    res['yearlyForm'] = [...form , ...formval.filter(d=>d.year !== this.value)]
    // res['formArray'] = this.myForm.get('inputFormArray').value
    res['scenarioName'] = this.scenarioName
    res['scenarioComment'] = this.scenarioComment
    this.saveScenarioEvent.emit(res)
    this.close(mymodal);
  }
  saveScenario(mymodal) {
    console.log(this.formSevice.getFormYear() , "form year")
   
    let formval = this.formSevice.getFormYear()
    let form = [{...this.getFormValue(),year : this.value}]
    
    // form.push(formval.filter(d=>d.year !== this.value))
    
    let res ={}
   
    res['yearlyForm'] = [...form , ...formval.filter(d=>d.year !== this.value)]
    res['scenarioName'] = this.scenarioName
    res['scenarioComment'] = this.scenarioComment


    console.log(res , "RES")
    // console.log(this.formSevice.getFormYear() , "form year")
    this.saveScenarioEvent.emit(res)
    this.close(mymodal);
    
  }

  goToDashboard() {
     
    this.router.navigate(['dashboard']);
  }
  modifyForm(form , value){
    form.patchValue(value)

  }
  private checkValue(value,val){
    // debugger
    let inc_per ;
      if(value == ""){
        inc_per = ''
      }
      else if (value < 0){
        inc_per = 0
      }

      else if(value){
        
inc_per = Number(value)
      }
     
      else{
        inc_per = val + 5
      }
      return inc_per
      

  }
  increaseValue(formGroup, formname,index,value?) {
    
    let form  = this.myForm.get('inputFormArray') as FormArray
    if (formname == 'lpi_increase') {
      let val = formGroup.controls.lpi_increase.value;
      let cur_lpi = formGroup.controls.current_lpi.value;
      let inc_per = Number(this.checkValue(value , val))
      let inc_lpi = cur_lpi * (inc_per / 100)
      let v = {
        lpi_increase: inc_per,
        increased_lpi : cur_lpi +inc_lpi


      }
      this.modifyForm( form.at(index) , v)
     
    }
    if (formname == 'rsp_increase') {
      let val = formGroup.controls.rsp_increase.value;
      let cur_rsp = formGroup.controls.current_rsp.value;
      let inc_per = Number(this.checkValue(value , val))
      let inc_rsp = cur_rsp * (inc_per / 100)
      form.at(index).patchValue({
        rsp_increase: inc_per,
        increased_rsp : cur_rsp +inc_rsp

      })
       
    }
    if (formname == 'cogs_increase') {
      let val = formGroup.controls.cogs_increase.value;
      let cur_cogs = formGroup.controls.current_cogs.value;
      let inc_per = Number(this.checkValue(value , val))
      let inc_cogs = cur_cogs * (inc_per / 100)
      form.at(index).patchValue({
        cogs_increase: inc_per,
        increased_cogs : cur_cogs +inc_cogs


      })
      
   

     
  }
  
}
  decreaseValue(formGroup, formname , index?) {
    let form  = this.myForm.get('inputFormArray') as FormArray
    if (formname == 'lpi_increase') {
      let val = formGroup.controls.lpi_increase.value;
      let cur_lpi = formGroup.controls.current_lpi.value;
      let inc_per = val - 5
      if(inc_per < 0){
        inc_per = 0 
      }
      let inc_lpi = cur_lpi * (inc_per / 100)
      form.at(index).patchValue({
        lpi_increase: inc_per,
        increased_lpi : cur_lpi + inc_lpi

      })
       
    }
    if (formname == 'rsp_increase') {
      let val = formGroup.controls.rsp_increase.value;
      let cur_rsp = formGroup.controls.current_rsp.value;
      let inc_per = val - 5
      if(inc_per < 0){
        inc_per = 0 
      }
      let inc_rsp = cur_rsp * (inc_per / 100)
      form.at(index).patchValue({
        rsp_increase: inc_per,
        increased_rsp : cur_rsp + inc_rsp

      })
    
    }
    if (formname == 'cogs_increase') {
      let val = formGroup.controls.cogs_increase.value;
      let cur_cogs = formGroup.controls.current_cogs.value;
      let inc_per = val - 5
      if(inc_per < 0){
        inc_per = 0 
      }
      let inc_cogs = cur_cogs * (inc_per / 100)
      form.at(index).patchValue({
        cogs_increase: inc_per,
        increased_cogs : cur_cogs + inc_cogs

      })
     
    }

  
  }

  toggleChange(e) {
    this.isCHG = e.checked;
    // console.log(this.simulatedArray , "sim arr")
         if (e.checked) {
      this.simulatedArray.forEach((e) => {
        if (e.key != 'ALL') {
          
          let form  = (this.myForm.get('inputFormArray') as FormArray).
          controls.find((d:FormGroup)=>d.controls.product_group.value == e.key)
          
         form.patchValue({
           tonnes : e.percent_change.tonnes,
            mac:  e.percent_change.mac,
            te: e.percent_change.te,
            rsv:e.percent_change.rsv,
            nsv:e.percent_change.nsv,
            rp: e.percent_change.rp,
          });
        }
      });
    } else {
      this.simulatedArray.forEach((e) => {
        if (e.key != 'ALL') {
           
          let form  = (this.myForm.get('inputFormArray') as FormArray).
          controls.find((d:FormGroup)=>d.controls.product_group.value == e.key)
          
         form.patchValue({
           
           tonnes : e.simulated.tonnes  - e.current.tonnes,
            mac:  e.simulated.mac - e.current.mac,
            te:  e.simulated.te - e.current.te,
            rsv : e.simulated.rsv - e.current.rsv,
            nsv : e.simulated.nsv - e.current.nsv,
            rp: e.simulated.rp - e.current.rp,
          });
        }
      });
    }
  }
  openDialog(): void {
    
  }
   filterSummary(){


    let products = this.productFilterSubject.getValue()
    // console.log(products, "FILTER SIMILATED PRODUCTS")
    this.priceScenarioService.filterSimulatedSummary(products)

  }
  resetFilter() {
    this.categories.reset();
    this.retailers.reset();
    this.products.reset();
    // this.applyFilter();
  }
  downloadSummary() {
    let data = JSON.parse(JSON.stringify(this.simulatedArray));
    this.excel.exportAsExcelFile(
      data.map((d) => Object.assign({}, { name: d.key }, d.absolute_change)),
      'summary'
    );
  }
  openScenario(content){
    this.api.getScenario('ALL').subscribe((data: any[]) => {
      console.log(data, 'GET DATA');
      this.scenarios = data;
      this.scenarioArray = data.map((d) => ({ name: d.name, id: d.id }));
      // console.log(this.scenarioArray, 'SELECTED SCENARIO');
      this.open(content)
    });
   

  }

  open(content,large?) {
    let  obj = null
    if(large){
    obj = {size: 'lg', windowClass: 'modal'} 
    }

    console.log(this.formSevice.getFormYear() , "form year")

    console.log(this.myForm.value , "form value")
    let result = []
    let fy = this.formSevice.getFormYear()
    let fm = this.myForm.value
    let restfm = fy.filter(d=>d.year!=fm.year)
    result.push(fm)
    result = [...result , ...restfm]
    console.log(result , "RESULT")
    let form = this.myForm.get('inputFormArray') as FormArray
    let product_group = form.value.map(d=>d.product_group)
    product_group.unshift('ALL')
    let res = this.priceScenarioService.updateSimulatedvalueYearly(result)
    console.log(res, "RESULTTTTT")
    let obs$ = []
    res.map(d=>{
      product_group.forEach(element => {
        if(element == 'ALL'){
          obs$.push(this.populateSummary(d,element))
        }
        else{
          obs$.push(this.populateSummary(d.filter((unit) => unit.product_group === element ),element))

        }
      });
    })
    console.log(obs$ , "observables")

    forkJoin(obs$).subscribe(data=>{
      console.log(data , "DATA FORKJOIN")
      this.simulatedData = data.map(d=>{
      return  { 
        'value':this.calculateAggregate(d),
        'year' : d[18]
    }
      }
        )
      this.modalService.open(content , obj,this.simulatedData)
    })
    console.log(this.simulatedData , "calculted result")
    
      
  }
  calculateAggregate(d){
    // total_base,
      //     total_base_new,
      //     total_weight_in_tons,
      //     total_weight_in_tons_new,
      //     total_lsv,
      //     total_lsv_new,
      //     total_rsv,
      //     total_rsv_new,
      //     total_nsv,
      //     total_nsv_new,
      //     total_cogs,
      //     total_cogs_new,
      //     trade_expense,
      //     trade_expense_new,
      //     mars_mac,
      //     mars_mac_new,
      //     retailer_margin,
      //     retailer_margin_new,
      //     retialer,
      //     category,
      //     product
         let baseSummary = new SimulatedSummary(
            d[0],
            d[2],
            d[4],
            d[6],
            d[8],
            d[10],
            d[12],
            d[14],
            d[16]
          );
          let SimulateSummary = new SimulatedSummary(
            d[1],
            d[3],
            d[5],
            d[7],
            d[9],
            d[11],
            d[13],
            d[15],
            d[17]
          );
           
          this.base_summary = baseSummary;
          this.simulated_summary = SimulateSummary;
                     let sarr = new SimulatedArray(
           d[19],
          'category',
          'retialer',
           
            baseSummary,
            SimulateSummary,
            baseSummary.get_absolute(SimulateSummary),
            baseSummary.get_percent_change(SimulateSummary)
          );
           
          // if (key != 'ALL') {
          //   let form  = (this.myForm.get('inputFormArray') as FormArray).
          //   controls.find((d:FormGroup)=>d.controls.product_group.value == key)
            
          //  form.patchValue({
          //    tonnes:sarr.simulated.tonnes - sarr.current.tonnes,
          //     mac: sarr.simulated.mac - sarr.current.mac,
          //     te: sarr.simulated.te - sarr.current.te,
          //     rsv:sarr.simulated.rsv - sarr.current.rsv,
          //     nsv:sarr.simulated.nsv - sarr.current.nsv,
          //     rp: sarr.simulated.rp -sarr.current.rp,
          //   });
          //              }
           
          // let sindex = this.simulatedArray.findIndex(d=>d.key == sarr.key)
           
          // if (sindex > -1) {
          //   this.simulatedArray.splice(sindex, 1);
          // }

          // this.simulatedArray.push(sarr);
                

return sarr
  }
  close(content) {
    this.modalService.close(content);
  }
  resetDate(){
    this.date_lpi = null
    this.date_rsp = null
    this.date_cogs = null
  }
  resetFormGroup() {
    this.resetFilter()
    this.priceScenarioService.setSimulatedArray([]);
    // this.formSevice.setForm(null)
    this.formSevice.setForms(null);
     
    this.resetDate()
    this.selectedScenario.patchValue('')
    this.savedScenario = null;

    
      
    this.aggregate(this.units);
    this.update = false;
    this.expandTable('close');
   
    
  }
  getFormValue(){
    return {
      ...this.myForm.value ,
      cogs_date : this.date_cogs,
      rsp_date : this.date_rsp,
      lpi_date : this.date_lpi
    }

  }
  ChangeYear(e){
    
   
    // console.log(this.value , "VALUE   ")
    this.formSevice.setFormYear(this.getFormValue())
    this.resetDate()
    this.yearEvent.emit(this.value)

    // this.priceScenarioService.filterYear(e)
    //  console.log(this.formSevice.getFormYear() , "FORM YEAR GET")
  }
  populateFilterObservable(data){
    return of(...data)
    .pipe(
    distinct((unit: NewUnit) => unit.year),
    reduce((units, unit) => [...units, unit.year], []),
    tap(d=>{
      if(d.length > 0){
        this.value = d[0]
        this.yearEvent.emit(this.value)
        // this.priceScenarioService.filterYear(this.value)
        // this.options.stepsArray.push(d.map(d=>{}))
        this.options.stepsArray = d.map((a , i)=>{
          console.log(this , "this variable in setting")
          console.log(a , "value of a")
          this.yearMap[a] = `year ${i+1}`
          console.log(this.yearMap , "year map setting")
          return {value :  a}

        })
        this.options.translate = function(value){
         
          return this.yearMap[value]
        }.bind(this)
        
      }
      // console.log(d , "DDDDDDDDDDDDDDDDDDDDD")
      // console.log(this.value , "VALUE ")
      console.log(this.options , "options")
    })
    )
   
    
     
  }

  populateFilter(datas) {
         of(...datas)
       .pipe(distinct((unit: NewUnit) => unit.year))
       .subscribe((data) => {
        
        // console.log(data.year , "DATA YEAR ")
         this.options.stepsArray.push({ value:data.year })
        
       },()=>{},()=>{
        let arr = this.options.stepsArray
        if(arr.length > 0){
          // console.log(arr , "ARR")
          this.value = arr[0].value
          this.ChangeYear(this.value)
          // this.unsubscribe$.next()
          
           
        }
       });
  }
  competitionChange(value , input , index?){
     
    let val = 0
    // debugger
    if(value == "Follows"){
      val = input.controls.net_elasticity.value
    }
    else{
      val = input.controls.base_price_elasticity_manual.value
    }
    
    (this.myForm.get('inputFormArray') as FormArray).at(index).patchValue({
      base_price_elasticity: val
    })

     
  }
  aggregate(units: NewUnit[]) {
    
    this.myForm.get('year').patchValue(units[0].year)
     
    let f1 = (this.myForm.get('inputFormArray') as FormArray)
    f1.clear()
    // console.log(f1, "f111")
    // this.myForm.get('inputFormArray').patchValue([])
    this.inputFormArray = new FormArray([]);
    // console.log("AGGREGATE")
    const group = {};
    let arr = [];
    this.simulatorInput = new Array();
    let weight = {

    }
    units.forEach((data) => {
      // debugger
      this.minDate = this.minDate > data.date ? data.date : this.minDate
      this.maxDate = this.maxDate < data.date ? data.date : this.maxDate
      let str = data.product_group;
      //  + "-" + data.retailer + "-" + data.category
      if (arr.includes(str)) {
        let arr2 : FormArray = this.myForm.get('inputFormArray') as FormArray;
        let form = arr2.controls.find((d : FormGroup)=>d.controls.product_group_retailer.value == str)
        let prev = form.value.base_price_elasticity
        let val_lpi = ( prev+ data.base_price_elasticity)
        // weight[str] = weight[str] + 1
        weight[str]['count'] = weight[str]['count'] + 1
        weight[str]['b*u']  = weight[str]['b*u'] + (data.base_price_elasticity * data.base_units)
        weight[str]['units'] = weight[str]['units'] + data.base_units
              } else {
        arr.push(str);
        weight[str] = {
          'count' : 0,
          'b*u' : data.base_price_elasticity * data.base_units,
          'units' : data.base_units
        };
        let obj = new SimulatorInput(
          data.retailer,
          data.category,
          data.product_group,
          data.mars_cogs_per_unit,
          data.list_price,
          data.retailer_median_base_price_w_o_vat,
          data.base_price_elasticity,
          data.net_elasticity,
          data.competition
        );



        // console.log(obj , "OBBBB")
        if (obj) {
          console.log(obj , "GENERATED OBJECT")
          this.simulatorInput.push(obj);

          let arr1 : FormArray = this.myForm.get('inputFormArray') as FormArray;
          // debugger
          arr1.push(this.getFormGroup(obj));
         
        }
      }
      // console.log(weight , "WEIGHT")
    });
   
    for (const i in weight){
         weight[i]['el']  = weight[i]['b*u'] / weight[i]['units']
    }
     
    let form = this.myForm.get('inputFormArray') as FormArray;
     
   for(const obj in weight){
    let ctrl = form.controls.find((d : FormGroup)=>d.controls.product_group_retailer.value == obj)
    
    
    let weighted_value =  weight[obj]['el'].toFixed(2)
    ctrl.patchValue({
     
      base_price_elasticity:weighted_value,
      base_price_elasticity_manual:  weighted_value

    })

   }
    // 
   
   
     
    this.expandTable('close')

  
    return arr;
  }
  sortForm(column , direction){
    let f = this.simulatorInput
    this.simulatorInput = [...f].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });


  }
   
  private getFormGroup(obj: SimulatorInput) {

    return this.formBuilder.group({
        product_group: [obj.product_group],
      retailer: [obj.retailer],
      category: [obj.category],
      product_group_retailer: [obj.ret_cat_prod],
      current_lpi: [obj.lp],
      increased_lpi : [obj.lp],
      current_rsp:  [obj.rsp],
      increased_rsp:  [obj.rsp],
      current_cogs: [obj.cogs],
      increased_cogs: [obj.cogs],
      lpi_increase: [0],
      rsp_increase: [0],
      cogs_increase:[0],
      base_price_elasticity: [obj.base_price_elasticity_used],
      base_price_elasticity_manual: [obj.base_price_elasticity_manual],
      net_elasticity : [obj.net_elasticity],
      competition:  [obj.competition],
      tonnes : [obj.tonnes],
      rsv : [obj.rsv],
      mac: [obj.mac],
      rp: [obj.rp],
      nsv : [obj.nsv],
      te:  [obj.te],

    })
     
  }

  populateSummary(units: NewUnit[], key) {
     
    
    let total_base$ = of(...units).pipe(
      reduce((a, b) => a + Number(b.base_units.toFixed(2)),0)
      );
    let category$ = of(...units)
    .pipe(
      map(data => Array.from(new Set(data.category))),
    )
    
      
    let retailer$ = of(...units)
      .pipe(distinct((unit) => unit.retailer))
    let product$ = of(...units)
      .pipe(distinct((unit) => unit.product_group))
     
    let total_base_new$ = of(...units).pipe(
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
      
      reduce((a, b) => a + b.total_rsv_w_o_vat, 0),
     
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
    let year$ = of(units[0].year)
    let key$ = of(key)

    return combineLatest([
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
      year$,
      key$,
      retailer$,
      category$,
      product$
    ])
    
      // .subscribe(
      //   ([
      //     total_base,
      //     total_base_new,
      //     total_weight_in_tons,
      //     total_weight_in_tons_new,
      //     total_lsv,
      //     total_lsv_new,
      //     total_rsv,
      //     total_rsv_new,
      //     total_nsv,
      //     total_nsv_new,
      //     total_cogs,
      //     total_cogs_new,
      //     trade_expense,
      //     trade_expense_new,
      //     mars_mac,
      //     mars_mac_new,
      //     retailer_margin,
      //     retailer_margin_new,
      //     retialer,
      //     category,
      //     product
      //   ]) => {
 
          
      //     let baseSummary = new SimulatedSummary(
      //       total_base,
      //       total_weight_in_tons,
      //       total_lsv,
      //       total_rsv,
      //       total_nsv,
      //       total_cogs,
      //       trade_expense,
      //       mars_mac,
      //       retailer_margin
      //     );
      //     let SimulateSummary = new SimulatedSummary(
      //       total_base_new,
      //       total_weight_in_tons_new,
      //       total_lsv_new,
      //       total_rsv_new,
      //       total_nsv_new,
      //       total_cogs_new,
      //       trade_expense_new,
      //       mars_mac_new,
      //       retailer_margin_new
      //     );
           
      //     this.base_summary = baseSummary;
      //     this.simulated_summary = SimulateSummary;
      //                let sarr = new SimulatedArray(
      //       key,
      //     category,
      //     retialer,
           
      //       baseSummary,
      //       SimulateSummary,
      //       baseSummary.get_absolute(SimulateSummary),
      //       baseSummary.get_percent_change(SimulateSummary)
      //     );
           
      //     if (key != 'ALL') {
      //       let form  = (this.myForm.get('inputFormArray') as FormArray).
      //       controls.find((d:FormGroup)=>d.controls.product_group.value == key)
            
      //      form.patchValue({
      //        tonnes:sarr.simulated.tonnes - sarr.current.tonnes,
      //         mac: sarr.simulated.mac - sarr.current.mac,
      //         te: sarr.simulated.te - sarr.current.te,
      //         rsv:sarr.simulated.rsv - sarr.current.rsv,
      //         nsv:sarr.simulated.nsv - sarr.current.nsv,
      //         rp: sarr.simulated.rp -sarr.current.rp,
      //       });
      //                  }
           
      //     let sindex = this.simulatedArray.findIndex(d=>d.key == sarr.key)
           
      //     if (sindex > -1) {
      //       this.simulatedArray.splice(sindex, 1);
      //     }

      //     this.simulatedArray.push(sarr);
      //            },
      //   (err) => {},
      //   () => {
      //     this.priceScenarioService.setSimulatedArray(this.simulatedArray);
      //     // console.log(this.simulatedArray, 'OBSERVABLE COMPLETED..........');
      //   }
      // );
  }
  sm(){
    this.isCHG = false
  }
  simulateFn(expand?) {
    // console.log(expand , "expand flag")
    if(expand){
      this.expandTable('expand');
    }
    this.isCHG = false;
  
    this.simulateSummary();
    
  }

  simulateSummary(el?: HTMLElement) {
    
     
    this.simulatedArray = [];
    
    let form = this.myForm.get('inputFormArray') as FormArray
     
    // console.log(form.value , "form value")
     
    let product_group = form.value.map(d=>d.product_group)
     
var values = form.controls.map(d=>d.dirty)

var result = {};
product_group.forEach((key, i) => result[key] = values[i]);
 
    product_group.unshift('ALL')
    
     
    let new_unit: NewUnit[] = this.priceScenarioService.updateSimulatedvalue(
      this.units,
  
      result,
      this.myForm.get('inputFormArray').value,
      this.date_lpi,
      this.date_rsp,

      this.date_cogs
    );
    this.priceScenarioService.setNewChange(new_unit);
    // console.log(product_group , "PRODUCT GROUPGROUP3")
    // this.simulatedArray = []
    product_group.forEach((p) => {
      if(p == "ALL"){
        this.populateSummary(
          new_unit,
          p
        );

      }
      else{
        this.populateSummary(
          new_unit.filter((unit) => unit.product_group === p  ),
          p
        );

      }
      
  
        
      });
     
   
    if (el) {
      this.scroll(el);
       
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({
      behavior: 'smooth',
    });
  }
  @HostListener('window:scroll')
  checkScroll() {
     
  }
  ngAfterViewInit() {
  
  }
  downloadE(){
    let val = this.myForm.get('inputFormArray').value
    // console.log(val , "VAL")
    let gen_val = []
    for(var i in val){
     
      gen_val.push(
        {
        "Product Group":val[i]['product_group'],
       
        "Base Price Elasticity" : val[i]['base_price_elasticity']
       })
    }
   
    // console.log(gen_val , "genval")
    this.api.getExcel(gen_val , "input").subscribe(data=>{
      // console.log(data)
      this.excel.save(data , "input")
    },
    err=>{
      // console.log(err , "error")
    })
  }
  ngOnDestroy() {
    // alert("DESTROYING")
    // this.formSevice.setForm(this.myForm)
    this.formSevice.setFormYear(this.getFormValue())
    // this.formSevice.setForms({
    //   'formValue':this.myForm.value,
    //   'myform' : this.myForm,
    //   'date_lpi' : this.date_lpi,
    //   'date_rsp' : this.date_rsp,
    //   'date_cogs' : this.date_cogs,
    //   'selectedScenario' : this.selectedScenario,
    // })
    this.scrollHeaderPosition = 0;
    this.filterHeaderPosition = 0;
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }


}
