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
  selector: 'app-yearly-trends',
  templateUrl: './yearly-trends.component.html',
  styleUrls: ['./yearly-trends.component.scss'],
})
export class YearlyTrendsComponent implements OnInit {
  disable = true;
  chosenMetric = null;
  graphs = [];
  metrics = [
    'List Sales Value, LSV',
    'Trade Expense',
    'Net Sales Value,NSV',
    'COGS',
    'Mars MAC',
    'Retal Sales Value,RSV',
    'Retal Sales Value,RSV(w/o VAT)',
    'Retailer Margin',
  ];
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
  selectedMetric = new FormControl();
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

  category_change = ['2018', '2019', '2020'];
  data_change = [
    [40, -50, 70],
    [40, -50, 70],
  ];

  chartOptions_change = Utils.getChartOptionColumnYaxis(
    'change',
    this.category_change,
    this.data_change,
    'column'
  );

  constructor(private profitService: ProfitPoolService) {}

  ngOnInit(): void {
    this.profitPool$ = this.profitService.getProfitPool();
    this.profitPool$.subscribe((data) => {
      this.profitPool = data;
      this.populateFilter(this.profitPool);
      // this.filterData(this.profitPool);
    });
    // this.selectedMetric.valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.disable = false;
    //   } else {
    //     this.disable = true;
    //   }
    // });
  }
  getGrapth(data) {
    let arr = [data, Utils.getPercentChange(data)];

    return Utils.getChartOptionColumnYaxis(
      'change',
      this.year_filter,
      arr,
      'column'
    );
  }
  addMetric() {
    let obs$ = [];
    this.year_filter.forEach((year) => {
      obs$.push(
        this.filterData(
          this.profitPool.filter((da) => da.year === parseInt(year)),
          this.chosenMetric
        )
      );
    });
    combineLatest(obs$).subscribe((data) => {
      this.graphs.push(this.getGrapth(data.map((v: number) => v / 100000)));
    });
  }
  metricChange(val) {
    this.chosenMetric = val;
    this.disable = false;
  }
  filterData(units: ProfitPool[], metric) {
    // metrics = [
    //   'List Sales Value, LSV',
    //   'Trade Expense',
    //   'Net Sales Value,NSV',
    //   'COGS',
    //   'Mars MAC',
    //   'Retal Sales Value,RSV',
    //   'Retal Sales Value,RSV(w/o VAT)',
    //   'Retailer Margin',
    // ];
    let obs$;
    if (metric == this.metrics[0]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.total_lsv, 0));
    }
    if (metric == this.metrics[1]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.trade_expense, 0));
    }
    if (metric == this.metrics[2]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.total_nsv, 0));
    }
    if (metric == this.metrics[3]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs, 0));
    }
    if (metric == this.metrics[4]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.mars_mac, 0));
    }
    if (metric == this.metrics[5]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.total_rsv, 0));
    }
    if (metric == this.metrics[6]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.total_rsv_w_o_vat, 0));
    }
    if (metric == this.metrics[7]) {
      obs$ = of(...units).pipe(reduce((a, b) => a + b.retailer_margin, 0));
    }
    // of(...units).pipe(reduce((a, b) => a + b.total_rsv, 0));
    return obs$;
  }
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
        }
        // (error) => {},
        // () => {
        //   this.year_filter = Utils.yearPair(this.year_filter);
        // }
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
}
