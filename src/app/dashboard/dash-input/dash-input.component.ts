import { Component, OnInit } from '@angular/core';
// import * as data from '../../data/input1.json'
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../../shared/services/api.service"
@Component({
  selector: 'app-dash-input',
  templateUrl: './dash-input.component.html',
  styleUrls: ['./dash-input.component.scss']
})
export class DashInputComponent implements OnInit {
  tableform=  new FormGroup({
    orbit_otc_magnit :new FormGroup(this.getFormGroup("ORBIT OTC - Magnit")),
    orbit_otc_x5 :new FormGroup(this.getFormGroup("ORBIT OTC - X5")),
    orbit_xxl_magnit :new FormGroup(this.getFormGroup("ORBIT XXL - Magnit"))

  })

  constructor(private api : ApiService) { }
  onSubmit(){
    this.api.updateUnits(this.tableform);
    console.log("asdas")
  
  }

  private getFormGroup(name){
    return {
      product_group_retailer: new FormControl(name),
      lpi_increase : new FormControl('0.00'),
      rsp_increase : new FormControl('0.00'),
      cogs_increase : new FormControl('0.00'),
      base_price_elasticity : new FormControl('-2.04'),
      base_price_elasticity_manual : new FormControl('0.00'),
      competition : new FormControl('Not Follows')
    }
  }

  ngOnInit(): void {
    this.tableform.valueChanges.subscribe(data=>{
      console.log(data , "VALUE CHANGES DATA")
    })
    // this.tableform 
    
  }

}
