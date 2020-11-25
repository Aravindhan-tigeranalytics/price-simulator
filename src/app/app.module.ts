import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {RouterModule, Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { DashHomeComponent } from './dashboard/dash-home/dash-home.component';
import { DashInputComponent } from './dashboard/dash-input/dash-input.component';
import {MaterialModule} from "./shared/material.module"
import {HighchartsChartModule} from 'highcharts-angular';
// import { DashInputComponent } from './dash-input/dash-input.component'
// import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './shared/services/auth.services';
import { AuthGuard } from './shared/services/auth-guard.service';
import { ScenarioComparisonComponent } from './scenario-comparison/scenario-comparison.component';
import { ScenarioCardComponent } from './scenario-card/scenario-card.component';
import { ScenarioBuilderComponent } from './scenario-builder/scenario-builder.component';
import { ScenarioInputComponent } from './scenario-input/scenario-input.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HeaderSideComponent } from './header-side/header-side.component';
// import {} from './dashboard/'


const routes: Routes = [
  {
    path : '',
    component : AuthComponent
  },
  {
    path: 'scenario',
    component:ScenarioBuilderComponent,
    canActivate:[AuthGuard]
     
  },
  {
    path: 'dashboard',
    component:DashHomeComponent,
    canActivate:[AuthGuard]
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'input',
    component:DashInputComponent,
    canActivate:[AuthGuard]
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'compare',
    component:ScenarioComparisonComponent,
    canActivate:[AuthGuard]
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },

  
  
];


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    DashInputComponent,
    DashHomeComponent,
    ScenarioComparisonComponent,
    ScenarioCardComponent,
    ScenarioBuilderComponent,
    ScenarioInputComponent,
    HeaderSideComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgbModule,
    RouterModule.forRoot(routes),
  ],
  providers: [AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
