import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { DashHomeComponent } from './dashboard/dash-home/dash-home.component';
import { DashInputComponent } from './dashboard/dash-input/dash-input.component';
import { MaterialModule } from './shared/material.module';
import { HighchartsChartModule } from 'highcharts-angular';
// import { DashInputComponent } from './dash-input/dash-input.component'
// import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './shared/services/auth.services';
import { ProfitPoolService } from './shared/services/profit-pool.service';
import { ExcelServicesService } from './shared/services/excel.service';
import { AuthGuard } from './shared/services/auth-guard.service';
import { ScenarioComparisonComponent } from './scenario-comparison/scenario-comparison.component';
import { ScenarioCardComponent } from './scenario-card/scenario-card.component';
import { ScenarioBuilderComponent } from './scenario-builder/scenario-builder.component';
import {
  ScenarioInputComponent,
  // RemoveWrapperDirective,
} from './scenario-input/scenario-input.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderSideComponent } from './header-side/header-side.component';
import { SimulateSummaryRowComponent } from './simulate-summary-row/simulate-summary-row.component';
import { CustomHttpInterceptor } from './shared/services/interceptor.service';
import { PricePoolComponent } from './price-pool/price-pool.component';
import { YearlyComparisonComponent } from './yearly-comparison/yearly-comparison.component';
import { YearlyTrendsComponent } from './yearly-trends/yearly-trends.component';
import { ProfitPoolHeaderComponent } from './profit-pool-header/profit-pool-header.component';
import { ProfitSummaryTableComponent } from './profit-summary-table/profit-summary-table.component';
import { HomeComponent } from './home/home.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ScenarioSummaryComponent } from './scenario-summary/scenario-summary.component';
import { RemoveUnderscorePipe } from './shared/pipes/remove-underscore.pipe';
import { RemoveUnderPipe } from './remove-under.pipe';
import { ConvertTonnesPipe } from './convert-tonnes.pipe';
import { ChangeColorDirective } from './change-color.directive';
// import {} from './dashboard/'

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'scenario',
    component: ScenarioBuilderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashHomeComponent,
    canActivate: [AuthGuard],
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'input',
    component: DashInputComponent,
    canActivate: [AuthGuard],
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'graph',
    component: LineChartComponent,
    // canActivate: [AuthGuard],
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  // {
  //   path: 'summ',
  //   component: ProfitSummaryTableComponent,
  //   // canActivate: [AuthGuard],
  //   // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  // },
  {
    path: 'compare',
    component: ScenarioComparisonComponent,
    canActivate: [AuthGuard],
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'pricepool',
    // component: PricePoolComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: '', component: PricePoolComponent },
      { path: 'yc', component: YearlyComparisonComponent },
      { path: 'yearly-trends', component: YearlyTrendsComponent },
      { path: 'summ', component: ProfitSummaryTableComponent },
    ],
    // canActivate: [AuthGuard],
    // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  // {
  //   path: 'yc',
  //   component: YearlyComparisonComponent,
  //   // canActivate: [AuthGuard],
  //   // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  // },
  // {
  //   path: 'yearly-trends',
  //   component: YearlyTrendsComponent,
  //   // canActivate: [AuthGuard],
  //   // loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  // },
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
    HeaderSideComponent,
    SimulateSummaryRowComponent,
    // RemoveWrapperDirective,
    PricePoolComponent,
    YearlyComparisonComponent,
    YearlyTrendsComponent,
    ProfitPoolHeaderComponent,
    ProfitSummaryTableComponent,
    HomeComponent,
    LineChartComponent,
    ScenarioSummaryComponent,
    RemoveUnderscorePipe,
    RemoveUnderPipe,
    ConvertTonnesPipe,
    ChangeColorDirective,
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
  providers: [
    AuthService,
    AuthGuard,
    ProfitPoolService,
    ExcelServicesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
