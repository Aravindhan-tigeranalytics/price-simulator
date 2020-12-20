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
  selector: 'app-yearly-comparison',
  templateUrl: './yearly-comparison.component.html',
  styleUrls: ['./yearly-comparison.component.scss'],
})
export class YearlyComparisonComponent implements OnInit {
  year1;
  year2;
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
  total_rsv_y2 = 0;
  total_rsv_vat_y2 = 0;
  total_trade_expense_y2 = 0;
  total_nsv_y2 = 0;
  total_lsv_y2 = 0;
  total_cogs_y2 = 0;
  total_mars_mac_y2 = 0;
  total_mars_mac_inc_y2 = 0;
  total_retailer_margin_y2 = 0;
  total_retailer_margin_inc_y2 = 0;
  mars_mac_percentof_nsv_y2 = 0;
  retailer_margin_percntof_rsv_y2 = 0;
  mars_percent_of_total_profit_y2 = 0;
  retailer_percent_of_total_profit_y2 = 0;

  highcharts = Highcharts;

  data_year1 = [
    [0, this.total_rsv_vat],
    [0, this.total_nsv],
    [0, this.total_cogs],
    [this.total_cogs, this.total_cogs + this.total_mars_mac],

    [this.total_nsv, this.total_nsv + this.total_retailer_margin],
  ];
  data_year2 = [
    [0, this.total_rsv_vat_y2],
    [0, this.total_nsv_y2],
    [0, this.total_cogs_y2],
    [this.total_cogs_y2, this.total_cogs_y2 + this.total_mars_mac_y2],

    [this.total_nsv_y2, this.total_nsv_y2 + this.total_retailer_margin_y2],
  ];
  data_mars_1 = [
    [0, this.total_lsv],
    [this.total_nsv, this.total_nsv + this.total_trade_expense],
    [0, this.total_nsv],
    [0, this.total_cogs],

    [this.total_cogs, this.total_cogs + this.total_mars_mac],
  ];
  data_mars_2 = [
    [0, this.total_lsv_y2],
    [this.total_nsv_y2, this.total_nsv_y2 + this.total_trade_expense_y2],
    [0, this.total_nsv_y2],
    [0, this.total_cogs_y2],

    [this.total_cogs_y2, this.total_cogs_y2 + this.total_mars_mac_y2],
  ];
  data_retail_1 = [
    [0, this.total_rsv],
    [0, this.total_rsv_vat],
    [0, this.total_nsv],
    [this.total_nsv, this.total_nsv + this.total_retailer_margin],
  ];
  data_retail_2 = [
    [0, this.total_rsv_y2],
    [0, this.total_rsv_vat_y2],
    [0, this.total_nsv_y2],
    [this.total_nsv_y2, this.total_nsv_y2 + this.total_retailer_margin_y2],
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

  chartOptions_year1 = Utils.getChartOption(
    'Profit Pool year1',
    this.categories,
    this.data_year1,
    'columnrange'
  );

  chartOptions_year2 = Utils.getChartOption(
    'Profit Pool year2',
    this.categories,
    this.data_year2,
    'columnrange'
  );
  mars_profit_pool_chartOptions_year1 = Utils.getChartOption(
    'Mars Profit pool',
    this.mars_profit_categories,
    this.data_mars_1,
    'columnrange'
  );
  mars_profit_pool_chartOptions_year2 = Utils.getChartOption(
    'Mars Profit pool',
    this.mars_profit_categories,
    this.data_mars_2,
    'columnrange'
  );
  retail_profit_pool_chartOptions_year1 = Utils.getChartOption(
    'Retailer Profit pool',
    this.retail_categories,
    this.data_retail_1,
    'columnrange'
  );
  retail_profit_pool_chartOptions_year2 = Utils.getChartOption(
    'Retailer Profit pool',
    this.retail_categories,
    this.data_retail_2,
    'columnrange'
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
      // this.filterData(this.profitPool);
    });
  }

  changeYear(value) {
    this.applyFilter();
    // this.selectedYear = value;
    console.log(value, 'SELECTED YYEAR');
  }
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

    // if (this.selectedYear.value && this.selectedYear.value.includes('ALL')) {
    //   this.yearFilterSubject.next(this.year_filter);
    // } else {
    //   this.yearFilterSubject.next(this.selectedYear.value);
    // }

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
    // if(pos){

    // }
    // let yearSel$ = of(yearSel);
    combineLatest([
      this.profitPool$,
      this.categoryFilterSubject,
      this.productFilterSubject,
      this.retailerFilterSubject,
      // yearSel$,
      // this.yearFilterSubject,
      this.activityFilterSubject,
      this.mechanicFilterSubject,
    ])
      .pipe(
        map(([units, category, product, retailer, activity, mechanic]) => {
          console.log(category, 'FILTER CATEGORY');
          console.log(product, 'FILTER product');
          console.log(retailer, 'FILTER retailer');
          // console.log(year, 'FILTER year');
          console.log(activity, 'FILTER activity');
          console.log(mechanic, 'FILTER mechanic');
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
        })
      )
      .subscribe((data) => {
        let years = this.selectedYear.value;
        if (years) {
          let yearArr = Utils.getArray(years);
          this.filterData(
            data.filter((data) => data.year == parseInt(yearArr[0])),
            yearArr[0],
            'year1'
          );
          this.filterData(
            data.filter((data) => data.year == parseInt(yearArr[1])),
            yearArr[1],
            'year2'
          );
          console.log(data.length, 'LENGTH TABLE DATA');
        }
      });
  }

  // FILTER FOR PROFIT TOOL
  populateFilter(datas) {
    // let dummy1 = of(...datas).pipe(
    //   distinct((unit: ProfitPool) => unit.category)
    // );
    // let dummy2 = of(...datas).pipe(distinct((unit: ProfitPool) => unit.year));

    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.category))
      .subscribe((data) => {
        this.category_filter.push(data.category);
      });
    of(...datas)
      .pipe(distinct((unit: ProfitPool) => unit.year))
      .subscribe(
        (data) => {
          console.log(data, 'YEAR');
          this.year_filter.push(data.year);
        },
        (error) => {},
        () => {
          this.year_filter = Utils.yearPair(this.year_filter);
        }
      );
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

    // combineLatest([dummy1, dummy2]).subscribe(
    //   ([d1, d2]) => {
    //     console.log(d1, 'DDDDDD!');
    //     console.log(d2, 'DDDDDD2');
    //     if (!dummy2) {
    //     }
    //   },
    //   (error) => {},
    //   () => {
    //     console.log('DDDDDFINISH');
    //   }
    // );
  }
  filterData(units: ProfitPool[], year?, pos?) {
    console.log(year);
    console.log(pos, 'YEAR AND POS');
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
        if (pos == 'year1') {
          this.year1 = year;
          this.total_rsv = Math.ceil(total_rsv / 1000000);
          this.total_rsv_vat = Math.ceil(total_rsv_vat / 1000000);
          this.total_trade_expense = Math.ceil(total_trade / 1000000);
          this.total_nsv = Math.ceil(total_nsv / 1000000);
          this.total_lsv = Math.ceil(total_lsv / 1000000);
          this.total_cogs = Math.ceil(total_cogs / 1000000);
          this.total_mars_mac = Math.ceil(mars_mac / 1000000);
          this.total_mars_mac_inc = Math.ceil(mars_mac2 / 1000000);
          this.total_retailer_margin = Math.ceil(
            total_retailer_margin / 1000000
          );
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
        } else {
          this.year2 = year;
          this.total_rsv_y2 = Math.ceil(total_rsv / 1000000);
          this.total_rsv_vat_y2 = Math.ceil(total_rsv_vat / 1000000);
          this.total_trade_expense_y2 = Math.ceil(total_trade / 1000000);
          this.total_nsv_y2 = Math.ceil(total_nsv / 1000000);
          this.total_lsv_y2 = Math.ceil(total_lsv / 1000000);
          this.total_cogs_y2 = Math.ceil(total_cogs / 1000000);
          this.total_mars_mac_y2 = Math.ceil(mars_mac / 1000000);
          this.total_mars_mac_inc_y2 = Math.ceil(mars_mac2 / 1000000);
          this.total_retailer_margin_y2 = Math.ceil(
            total_retailer_margin / 1000000
          );
          this.total_retailer_margin_inc_y2 = Math.ceil(
            total_retailer_margin2 / 1000000
          );
          this.mars_mac_percentof_nsv_y2 =
            (this.total_mars_mac_y2 / this.total_nsv_y2) * 100;
          this.retailer_margin_percntof_rsv_y2 =
            (this.total_retailer_margin_y2 / this.total_rsv_vat_y2) * 100;
          this.mars_percent_of_total_profit_y2 =
            (this.total_mars_mac_y2 /
              (this.total_mars_mac_y2 + this.total_retailer_margin_y2)) *
            100;
          this.retailer_percent_of_total_profit_y2 =
            (this.total_retailer_margin_y2 /
              (this.total_mars_mac_y2 + this.total_retailer_margin_y2)) *
            100;
        }
        this.reRender(year);
      }
    );
  }
  reRender(year?) {
    this.data_year1 = [
      [0, this.total_rsv_vat],
      [0, this.total_nsv],
      [0, this.total_cogs],
      [this.total_cogs, this.total_cogs + this.total_mars_mac],

      [this.total_nsv, this.total_nsv + this.total_retailer_margin],
    ];
    this.data_year2 = [
      [0, this.total_rsv_vat_y2],
      [0, this.total_nsv_y2],
      [0, this.total_cogs_y2],
      [this.total_cogs_y2, this.total_cogs_y2 + this.total_mars_mac_y2],

      [this.total_nsv_y2, this.total_nsv_y2 + this.total_retailer_margin_y2],
    ];
    this.data_mars_1 = [
      [0, this.total_lsv],
      [this.total_nsv, this.total_nsv + this.total_trade_expense],
      [0, this.total_nsv],
      [0, this.total_cogs],

      [this.total_cogs, this.total_cogs + this.total_mars_mac],
    ];
    this.data_mars_2 = [
      [0, this.total_lsv_y2],
      [this.total_nsv_y2, this.total_nsv_y2 + this.total_trade_expense_y2],
      [0, this.total_nsv_y2],
      [0, this.total_cogs_y2],

      [this.total_cogs_y2, this.total_cogs_y2 + this.total_mars_mac_y2],
    ];
    // console.log(this.data_mars, 'DATA MARSSSSSSSSSSSSSSSSSSSSS');
    this.data_retail_1 = [
      [0, this.total_rsv],
      [0, this.total_rsv_vat],
      [0, this.total_nsv],
      [this.total_nsv, this.total_nsv + this.total_retailer_margin],
    ];
    this.data_retail_2 = [
      [0, this.total_rsv_y2],
      [0, this.total_rsv_vat_y2],
      [0, this.total_nsv_y2],
      [this.total_nsv_y2, this.total_nsv_y2 + this.total_retailer_margin_y2],
    ];

    this.chartOptions_year1 = Utils.getChartOption(
      'Profit Pool ' + this.year1,
      this.categories,
      this.data_year1,
      'columnrange'
    );
    this.chartOptions_year2 = Utils.getChartOption(
      'Profit Pool ' + this.year2,
      this.categories,
      this.data_year2,
      'columnrange'
    );
    this.mars_profit_pool_chartOptions_year1 = Utils.getChartOption(
      'Mars Profit pool ' + this.year1,
      this.mars_profit_categories,
      this.data_mars_1,
      'columnrange'
    );
    this.mars_profit_pool_chartOptions_year2 = Utils.getChartOption(
      'Mars Profit pool ' + this.year2,
      this.mars_profit_categories,
      this.data_mars_2,
      'columnrange'
    );
    this.retail_profit_pool_chartOptions_year1 = Utils.getChartOption(
      'Retailer Profit pool ' + this.year1,
      this.retail_categories,
      this.data_retail_1,
      'columnrange'
    );
    this.retail_profit_pool_chartOptions_year2 = Utils.getChartOption(
      'Retailer Profit pool ' + this.year2,
      this.retail_categories,
      this.data_retail_2,
      'columnrange'
    );
  }
}
