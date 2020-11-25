import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashHomeComponent } from './dash-home/dash-home.component';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from "../shared/material.module"
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
// import {} from './dash-home/dash-home.component'
import {HighchartsChartModule} from 'highcharts-angular';
import { DashInputComponent } from './dash-input/dash-input.component'
import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {} from "./"
export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashHomeComponent

  },
  {
    path: 'input',
    component: DashInputComponent

  },
  
];


@NgModule({
  declarations: [DashHomeComponent, DashInputComponent],
  imports: [
    CommonModule,
    HighchartsChartModule,
    // MatExpansionModule,
    // MatTableModule,
    // MatInputModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSelectModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    
    RouterModule.forChild(DashboardRoutes)
  ]
})
export class DashboardModule { }
