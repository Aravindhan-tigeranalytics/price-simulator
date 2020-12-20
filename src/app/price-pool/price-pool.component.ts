import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import addMore from 'highcharts/highcharts-more';
import { ProfitPool } from '../shared/models/profit-pool.model';
import { ProfitPoolService } from '../shared/services/profit-pool.service';
import { Observable, of, from, BehaviorSubject, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as Utils from '../shared/utils/utils';

import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
} from 'rxjs/operators';
addMore(Highcharts);

@Component({
  selector: 'app-price-pool',
  templateUrl: './price-pool.component.html',
  styleUrls: ['./price-pool.component.scss'],
})
export class PricePoolComponent implements OnInit {
  total_rsv = 0;
  total_rsv_vat = 0;
  total_trade_expense = 0;
  total_nsv = 0;
  total_lsv = 0;
  total_cogs = 0;
  total_mars_mac = 0;
  total_mars_mac_inc = 0;
  total_retailer_margin = 0;
  total_retailer_margin_inc = 0;
  mars_mac_percentof_nsv = 0;
  retailer_margin_percntof_rsv = 0;
  mars_percent_of_total_profit = 0;
  retailer_percent_of_total_profit = 0;

  highcharts = Highcharts;
  data_mars_ratailer = [
    this.mars_percent_of_total_profit,
    this.retailer_percent_of_total_profit,
  ];

  data_nsv_rsv = [
    this.mars_mac_percentof_nsv,
    this.retailer_margin_percntof_rsv,
  ];

  data = [
    [0, this.total_rsv_vat],
    [0, this.total_nsv],
    [0, this.total_cogs],
    [this.total_cogs, this.total_cogs + this.total_mars_mac],

    [this.total_nsv, this.total_nsv + this.total_retailer_margin],
  ];
  data_mars = [
    [0, this.total_lsv],
    [this.total_nsv, this.total_nsv + this.total_trade_expense],
    [0, this.total_nsv],
    [0, this.total_cogs],

    [this.total_cogs, this.total_cogs + this.total_mars_mac],
  ];
  data_retail = [
    [0, this.total_rsv],
    [0, this.total_rsv_vat],
    [0, this.total_nsv],
    [this.total_nsv, this.total_nsv + this.total_retailer_margin],
  ];
  categories = [
    'Retail Sales Value,RSV(w/o VAT)',
    'Net Sales Value, NSV',
    'COGS',
    'Mars MAC',
    'Retailer Margin',
  ];
  mars_profit_categories = [
    'List Sales Value, LSV',
    'Trade Expense',
    'Net Sales Value,NSV',
    'COGS',
    'Mars MAC',
  ];
  retail_categories = [
    'Retal Sales Value,RSV',
    'Retal Sales Value,RSV(w/o VAT)',
    'Net Sales Value,NSV',
    'Retailer Margin',
  ];
  msv_rsv_categories = ['Mars MAC,% of NSV', 'Retailer Margin,% of RSV'];
  mars_retailer_categories = [
    'Mars,% of Total Profit Pool',
    'Retailer,% of Total Profit Pool',
  ];
  mars_retailer_chart = Utils.getChartOptionColumn(
    'Mars And Retailer % Total Profit Pool',
    this.mars_retailer_categories,
    this.data_mars_ratailer,
    'column'
  );

  chartOptions = Utils.getChartOption(
    'Base scenario',
    this.categories,
    this.data,
    'columnrange'
  );
  mars_profit_pool_chartOptions = Utils.getChartOption(
    'Mars Profit pool',
    this.mars_profit_categories,
    this.data_mars,
    'columnrange'
  );
  retail_profit_pool_chartOptions = Utils.getChartOption(
    'Retailer Profit pool',
    this.retail_categories,
    this.data_retail,
    'columnrange'
  );
  nsv_rsv_chart = Utils.getChartOptionColumn(
    '',
    this.msv_rsv_categories,
    this.data_nsv_rsv,
    'column'
  );
  profitPool: ProfitPool[];
  profitPool$: Observable<ProfitPool[]>;
  selectedRetailer = new FormControl();
  selectedCategories = new FormControl();
  selectedProducts = new FormControl();
  selectedYear = new FormControl();
  selectedActivity = new FormControl();
  selectedMechanic = new FormControl();
  year_filter = [];
  retailer_filter = [];
  category_filter = [];
  product_filter = [];
  promo_activity_filter = [];
  promo_mechanic_filter = [];
  categoryFilterSubject = new BehaviorSubject(null);
  productFilterSubject = new BehaviorSubject(null);
  retailerFilterSubject = new BehaviorSubject(null);
  yearFilterSubject = new BehaviorSubject(null);
  activityFilterSubject = new BehaviorSubject(null);
  mechanicFilterSubject = new BehaviorSubject(null);

  constructor(private profitService: ProfitPoolService) {}

  ngOnInit(): void {
    this.profitPool$ = this.profitService.getProfitPool();
    this.profitPool$.subscribe((data) => {
      this.profitPool = data;
      this.populateFilter(this.profitPool);
      this.filterData(this.profitPool);
    });
  }

  // resetFilter(name) {
  //   console.log(name);

  //   if (name == 'category') {
  //     this.selected_category = null;
  //     this.categoryFilter.next(null);
  //   }
  //   if (name == 'product') {
  //     this.selected_product = null;
  //     this.productFilter.next(null);
  //   }
  //   if (name == 'retail') {
  //     this.selected_retailer = null;
  //     this.retailerFilter.next(null);
  //   }
  // }
  _apply() {
    if (
      this.selectedCategories.value &&
      this.selectedCategories.value.includes('ALL')
    ) {
      this.categoryFilterSubject.next(this.category_filter);
    } else {
      this.categoryFilterSubject.next(this.selectedCategories.value);
    }
    if (
      this.selectedProducts.value &&
      this.selectedProducts.value.includes('ALL')
    ) {
      this.productFilterSubject.next(this.product_filter);
    } else {
      this.productFilterSubject.next(this.selectedProducts.value);
    }
    if (
      this.selectedRetailer.value &&
      this.selectedRetailer.value.includes('ALL')
    ) {
      this.retailerFilterSubject.next(this.retailer_filter);
    } else {
      this.retailerFilterSubject.next(this.selectedRetailer.value);
    }

    if (this.selectedYear.value && this.selectedYear.value.includes('ALL')) {
      this.yearFilterSubject.next(this.year_filter);
    } else {
      this.yearFilterSubject.next(this.selectedYear.value);
    }

    if (
      this.selectedActivity.value &&
      this.selectedActivity.value.includes('ALL')
    ) {
      this.activityFilterSubject.next(this.promo_activity_filter);
    } else {
      this.activityFilterSubject.next(this.selectedActivity.value);
    }

    if (
      this.selectedMechanic.value &&
      this.selectedMechanic.value.includes('ALL')
    ) {
      this.mechanicFilterSubject.next(this.promo_mechanic_filter);
    } else {
      this.mechanicFilterSubject.next(this.selectedMechanic.value);
    }

    // this.mechanicFilterSubject.next(this.selectedMechanic);
  }
  applyFilter() {
    this._apply();
    combineLatest([
      this.profitPool$,
      this.categoryFilterSubject,
      this.productFilterSubject,
      this.retailerFilterSubject,
      this.yearFilterSubject,
      this.activityFilterSubject,
      this.mechanicFilterSubject,
    ])
      .pipe(
        map(
          ([units, category, product, retailer, year, activity, mechanic]) => {
            console.log(category, 'FILTER CATEGORY');
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
            if (year) {
              units = units.filter((unit) => year.includes(unit.year));
            }
            if (activity) {
              units = units.filter((unit) =>
                activity.includes(unit.promo_activity)
              );
            }
            if (mechanic) {
              units = units.filter((unit) =>
                mechanic.includes(unit.promo_mechanic)
              );
            }

            return units;
          }
        )
      )
      .subscribe((data) => {
        this.filterData(data);
        console.log(data.length, 'LENGTH TABLE DATA');
      });
  }

  // FILTER FOR PROFIT TOOL
  populateFilter(datas) {
    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.category))
      .subscribe((data) => {
        this.category_filter.push(data.category);
      });
    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.year))
      .subscribe((data) => {
        this.year_filter.push(data.year);
      });
    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.retailer))
      .subscribe((data) => {
        this.retailer_filter.push(data.retailer);
      });
    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.product_group))
      .subscribe((data) => {
        this.product_filter.push(data.product_group);
      });
    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.promo_activity))
      .subscribe((data) => {
        this.promo_activity_filter.push(data.promo_activity);
      });
    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.promo_mechanic))
      .subscribe((data) => {
        this.promo_mechanic_filter.push(data.promo_mechanic);
      });
  }
  filterData(units: ProfitPool[]) {
    let total_rsv$ = of(...units).pipe(reduce((a, b) => a + b.total_rsv, 0));
    let total_rsv_vat$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat, 0)
    );
    let total_lsv$ = of(...units).pipe(reduce((a, b) => a + b.total_lsv, 0));
    let total_trade$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense, 0)
    );

    let total_nsv$ = of(...units).pipe(reduce((a, b) => a + b.total_nsv, 0));
    let total_cogs$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs, 0));
    let mars_mac$ = of(...units).pipe(reduce((a, b) => a + b.mars_mac, 0));
    let mars_mac2$ = of(...units).pipe(
      reduce((a, b) => a + b.incremental_mars_mac, 0)
    );
    let total_retailer_margin$ = of(...units).pipe(
      reduce((a, b) => a + b.retailer_margin, 0)
    );
    let total_retailer_margin2$ = of(...units).pipe(
      reduce((a, b) => a + b.incremental_retailer_margin, 0)
    );

    combineLatest([
      total_rsv$,
      total_rsv_vat$,
      total_lsv$,
      total_trade$,
      total_nsv$,
      total_cogs$,
      mars_mac$,
      mars_mac2$,
      total_retailer_margin$,
      total_retailer_margin2$,
    ]).subscribe(
      ([
        total_rsv,
        total_rsv_vat,
        total_lsv,
        total_trade,
        total_nsv,
        total_cogs,
        mars_mac,
        mars_mac2,
        total_retailer_margin,
        total_retailer_margin2,
      ]) => {
        this.total_rsv = Math.ceil(total_rsv / 1000000);
        this.total_rsv_vat = Math.ceil(total_rsv_vat / 1000000);
        this.total_trade_expense = Math.ceil(total_trade / 1000000);
        this.total_nsv = Math.ceil(total_nsv / 1000000);
        this.total_lsv = Math.ceil(total_lsv / 1000000);
        this.total_cogs = Math.ceil(total_cogs / 1000000);
        this.total_mars_mac = Math.ceil(mars_mac / 1000000);
        this.total_mars_mac_inc = Math.ceil(mars_mac2 / 1000000);
        this.total_retailer_margin = Math.ceil(total_retailer_margin / 1000000);
        this.total_retailer_margin_inc = Math.ceil(
          total_retailer_margin2 / 1000000
        );
        this.mars_mac_percentof_nsv =
          (this.total_mars_mac / this.total_nsv) * 100;
        this.retailer_margin_percntof_rsv =
          (this.total_retailer_margin / this.total_rsv_vat) * 100;
        this.mars_percent_of_total_profit =
          (this.total_mars_mac /
            (this.total_mars_mac + this.total_retailer_margin)) *
          100;
        this.retailer_percent_of_total_profit =
          (this.total_retailer_margin /
            (this.total_mars_mac + this.total_retailer_margin)) *
          100;

        this.mars_mac_percentof_nsv =
          (this.total_mars_mac / this.total_nsv) * 100;
        this.retailer_margin_percntof_rsv =
          (this.total_retailer_margin / this.total_rsv_vat) * 100;
        this.mars_percent_of_total_profit =
          (this.total_mars_mac /
            (this.total_mars_mac + this.total_retailer_margin)) *
          100;
        this.retailer_percent_of_total_profit =
          (this.total_retailer_margin /
            (this.total_mars_mac + this.total_retailer_margin)) *
          100;
        console.log(total_rsv_vat, '$this.total_rsv_vat');
        console.log(total_trade, '$this.total_trade');
        console.log(total_nsv, '$this.total_nsv');
        console.log(total_cogs, '$this.total_cogs');
        console.log(mars_mac, '$this.total_mars_mac');
        console.log(total_retailer_margin, '$this.total_retailer_margin');
        console.log(mars_mac2, '$this.total_mars_mac_inc');
        console.log(total_retailer_margin2, '$this.total_retailer_margin_inc');
        console.log('---------------------------------------');

        console.log(this.total_rsv_vat, '$this.total_rsv_vat');
        console.log(this.total_nsv, '$this.total_nsv');
        console.log(this.total_cogs, '$this.total_cogs');
        console.log(this.total_mars_mac, '$this.total_mars_mac');
        console.log(this.total_retailer_margin, '$this.total_retailer_margin');
        console.log(this.total_mars_mac_inc, '$this.total_mars_mac_inc');
        console.log(
          this.total_retailer_margin_inc,
          '$this.total_retailer_margin_inc'
        );
        console.log(this.total_trade_expense, '$this.total_trade');

        this.reRender();
      }
    );
  }
  reRender() {
    this.data_mars_ratailer = [
      this.mars_percent_of_total_profit,
      this.retailer_percent_of_total_profit,
    ];

    this.data_nsv_rsv = [
      this.mars_mac_percentof_nsv,
      this.retailer_margin_percntof_rsv,
    ];
    this.data = [
      [0, this.total_rsv_vat],
      [0, this.total_nsv],
      [0, this.total_cogs],
      [this.total_cogs, this.total_cogs + this.total_mars_mac],

      [this.total_nsv, this.total_nsv + this.total_retailer_margin],
    ];
    this.data_mars = [
      [0, this.total_lsv],
      [this.total_nsv, this.total_nsv + this.total_trade_expense],
      [0, this.total_nsv],
      [0, this.total_cogs],

      [this.total_cogs, this.total_cogs + this.total_mars_mac],
    ];
    console.log(this.data_mars, 'DATA MARSSSSSSSSSSSSSSSSSSSSS');
    this.data_retail = [
      [0, this.total_rsv],
      [0, this.total_rsv_vat],
      [0, this.total_nsv],
      [this.total_nsv, this.total_nsv + this.total_retailer_margin],
    ];

    this.chartOptions = Utils.getChartOption(
      'Profit Pool',
      this.categories,
      this.data,
      'columnrange'
    );
    this.mars_profit_pool_chartOptions = Utils.getChartOption(
      'Mars Profit pool',
      this.mars_profit_categories,
      this.data_mars,
      'columnrange'
    );
    this.retail_profit_pool_chartOptions = Utils.getChartOption(
      'Retailer Profit pool',
      this.retail_categories,
      this.data_retail,
      'columnrange'
    );
    this.nsv_rsv_chart = Utils.getChartOptionColumn(
      '',
      this.msv_rsv_categories,
      this.data_nsv_rsv,
      'column'
    );
    this.mars_retailer_chart = Utils.getChartOptionColumn(
      'Mars And Retailer % Total Profit Pool',
      this.mars_retailer_categories,
      this.data_mars_ratailer,
      'column'
    );
  }
}
