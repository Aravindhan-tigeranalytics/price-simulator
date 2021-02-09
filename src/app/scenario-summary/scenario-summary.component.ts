import { Component, OnInit, Input } from '@angular/core';
import { SimulatedArray } from '../shared/models/input';
import { ApiService } from '../shared/services/api.service';
import { PriceScenarioService } from '../shared/services/price-scenario.service';
import {
  map
  
} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import {
  Observable,
  of,
  from,
  BehaviorSubject,
  combineLatest,
  pipe,
} from 'rxjs';
@Component({
  selector: 'app-scenario-summary',
  templateUrl: './scenario-summary.component.html',
  styleUrls: ['./scenario-summary.component.scss'],
})
export class ScenarioSummaryComponent implements OnInit {
  simulatedArray: SimulatedArray[] = new Array();
  isSimulate: boolean;
  form : FormGroup;
  TOTAL_OPTIONS = ['Units','Volume (in Tonnes)',
  'RSV w/o VAT','Customer Margin','LSV','TE','NSV','MAC',
  'TE,% LSV','MAC,% NSV','Customer Margin, % RSV']
  TOTAL_OPTIONS_TONNES = ['Units','Volume (in Tonnes)',
  'RSV w/o VAT/tonnes','Customer Margin/ tonnes','LSV/ tonnes','TE/ tonnes','NSV/ tonnes','MAC/ tonnes',
  'TE,% LSV','MAC,% NSV','Customer Margin, % RSV']
  TOTAL_OPTIONS_UNITS = ['Units','Volume (in Tonnes)',
  'RSV w/o VAT/units','Customer Margin/ units','LSV/ units','TE/ units','NSV/ units','MAC/ units',
  'TE,% LSV','MAC,% NSV','Customer Margin, % RSV']
  params = ['Current Values', 'Simulated', 'ABS Change', '% Change'];
  @Input() productFilterSubject : Observable<any[]>;
  @Input() categoryFilterSubject : Observable<any[]>;
  @Input() retailerFilterSubject : Observable<any[]>;

  constructor(private priceScenarioService: PriceScenarioService,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        simulatedArray : this.formBuilder.array([])
      })
      // this.form.get('simulatedArray').valueChanges.subscribe(data=>{
      //   console.group(data , " Value chanegs data ")
      // })
    }
    radioChange(event , index){
      let formArray = this.form.get('simulatedArray') as FormArray
      let option = this.TOTAL_OPTIONS
      if(event.value == "Per Unit"){
        option = this.TOTAL_OPTIONS_UNITS

      }
      // "Total" , 'Per Tonne' , 'Per Unit'
      else if(event.value == "Per Tonne"){
option = this.TOTAL_OPTIONS_TONNES
      }
      else{

        option = this.TOTAL_OPTIONS
      }
     
      // debugger;
      formArray.at(index).patchValue({
        table_header :option
      })
      
    }

  ngOnInit(): void {
    this.priceScenarioService.getSimulatedArray().subscribe(data=>{
      console.log(data , "DATA SIMULTED ARRAY ")
      this.simulatedArray = data;
        this.isSimulate = true;
       this.getForm(data) 

    })

  

    // combineLatest([
    //   this.priceScenarioService.getSimulatedArray(),
     
    //   this.productFilterSubject,
    //   this.retailerFilterSubject,
    //   this.categoryFilterSubject
     
    // ])
    //   .pipe(
    //     map(([simulatedSummary, 
    //       product,retailer,category
    //     ]) => {
    //       console.log(simulatedSummary , "simulatedSummary in summary")
    
    //       // if (product && product.length > 0) {
    //       //   product.unshift('ALL')
    //       //   simulatedSummary =  simulatedSummary.filter(d=> product.includes(d.key))
            
    //       // }
    //       // if (retailer && retailer.length > 0) {
    //       //   simulatedSummary =  simulatedSummary.filter(d=> product.includes(d.key))
            
    //       // }
          
    //       // if (product && product.length > 0) {
    //       //   simulatedSummary =  simulatedSummary.filter(d=> product.includes(d.key))
            
    //       // }
          
          
   
    //       return simulatedSummary;
    //     })
    //   )
    //   .subscribe((data) => {
    //     // console.log(data , "simuated array")
        
    //   //  console.log(this.form , "GENRETED FORM ")
       
        
        
        
    //   });
  
  }

  getForm(data : SimulatedArray[]){
    let arr1 : FormArray = this.form.get('simulatedArray') as FormArray;
    arr1.clear()
    // console.log(arr1 , "ARR!")
    // arr1.reset()
    // arr1 = this.formBuilder.array([])
    data.forEach(d=>{
      arr1.push(
        this.formBuilder.group({
          options :  this.formBuilder.array(["Total" , 'Per Tonne' , 'Per Unit']),
          table_header : this.formBuilder.array(this.TOTAL_OPTIONS),
          selected:['Total'],
          simulated : d
      
    
        })
      );

    })
    // console.log(arr1 , "ARR2")
    // arr1.clear()
    // console.log(arr1 , "ARR3")
        // debugger
   
   
  }
}
