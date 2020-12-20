import { Component, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import addMore from 'highcharts/highcharts-more';
import { MatAccordion } from '@angular/material/expansion';
import { ApiService } from '../../shared/services/api.service';
import { UnitModel, NewUnit } from '../../shared/models/unit';
import { Observable, of, from, BehaviorSubject, combineLatest } from 'rxjs';

import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
} from 'rxjs/operators';
// import { ParseError } from '@angular/compiler';
addMore(Highcharts);
@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.scss'],
})
export class DashHomeComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  isToggle = false;

  currency_symbol = '₽';

  tableData: NewUnit[];
  tableData$: Observable<NewUnit[]>;
  categoryFilter = new BehaviorSubject(null);
  productFilter = new BehaviorSubject(null);
  retailerFilter = new BehaviorSubject(null);
  tableDataFilter: NewUnit[];
  categories_filter = [];
  retailer_filter = [];
  product_filter = [];
  selected_category = null;
  selected_retailer = null;
  selected_product = null;
  total_rsv = 0;
  total_rsv_new = 0;
  total_trade_expense = 0;
  total_trade_expense_new = 0;
  total_nsv = 0;
  total_nsv_new = 0;
  total_cogs = 0;
  total_cogs_new = 0;
  total_mars_mac = 0;
  total_mars_mac_new = 0;
  total_retailer_margin = 0;
  total_retailer_margin_new = 0;
  total_base_units = 0;
  total_weight_in_tons = 0;
  rsv_w_o_vat_$_chg = 0;
  trade_expense_$_chg = 0;
  nsv_$_chg = 0;
  cogs_$_chg = 0;
  mars_mac_$_chg = 0;
  retailer_margin_$_chg = 0;
  rsv_w_o_vat_$_chg_percent = 0;
  trade_expense_$_chg_percent = 0;
  nsv_$_chg_percent = 0;
  cogs_$_chg_percent = 0;
  mars_mac_$_chg_percent = 0;
  retailer_margin_$_chg_percent = 0;

  highcharts = Highcharts;
  categories = [
    'Retail Sales Value,RSV(w/o VAT)',
    'Trade Expense',
    'Net Sales Value, NSV',
    'COGS',
    'Mars MAC',
    'Retailer Margin',
  ];
  categories_perton = [
    'RSV(w/o VAT)/Ton',
    'Trade Expense / Ton',
    'NSV/Ton',
    'COGS/Ton',
    'Mars MAC/Ton',
    'Retailer Margin/Ton',
  ];
  data = [
    [0, this.total_rsv],
    [this.total_nsv, this.total_nsv + this.total_trade_expense],
    [0, this.total_nsv],
    [0, this.total_cogs],
    [this.total_cogs, this.total_cogs + this.total_mars_mac],
    [
      this.total_cogs + this.total_mars_mac,
      this.total_cogs + this.total_mars_mac + this.total_retailer_margin,
    ],
  ];
  data_new = [
    [0, this.total_rsv_new],
    [this.total_nsv_new, this.total_nsv_new + this.total_trade_expense_new],
    [0, this.total_nsv_new],
    [0, this.total_cogs_new],
    [this.total_cogs_new, this.total_cogs_new + this.total_mars_mac_new],
    [
      this.total_cogs_new + this.total_mars_mac_new,
      this.total_cogs_new +
        this.total_mars_mac_new +
        this.total_retailer_margin_new,
    ],
  ];
  // data_perton = [ [0,0.679],
  // [0.407, 0.407 + 0.160],
  // [0,0.407],
  // [0,0.183],
  // [0.183,0.183 + 0.224],
  // [0.407 , 0.407+0.272],
  // ]
  data_perton = [
    [0, 0],
    [0, 0 + 0],
    [0, 0],
    [0, 0],
    [0, 0 + 0],
    [0.407, 0.407 + 0.272],
  ];

  categories_2 = ['Mars MAC,% of NSV', 'Retailer Margin,% of RSP'];
  categories_3 = ['Base Units', 'New Units'];
  category_change = [
    'RSV w/o VAT $ chg',
    'Trade expense $ chg',
    'NSV $ chg',
    'COGS $ chg',
    'Mars MAC $ chg',
    'Retailer Margin $ chg',
  ];
  data_2 = [55.03, 40.1];
  data_3 = [this.total_base_units, this.total_base_units];

  data_change = [
    [
      this.rsv_w_o_vat_$_chg,
      this.trade_expense_$_chg,
      this.nsv_$_chg,
      this.cogs_$_chg,
      this.mars_mac_$_chg,
      this.retailer_margin_$_chg,
    ],
    [
      this.rsv_w_o_vat_$_chg_percent,
      this.trade_expense_$_chg_percent,
      this.nsv_$_chg_percent,
      this.cogs_$_chg_percent,
      this.mars_mac_$_chg_percent,
      this.retailer_margin_$_chg_percent,
    ],
  ];
  chartOptions = this.getChartOption(
    'Base scenario',
    this.categories,
    this.data,
    'columnrange'
  );
  chartOptions_1 = this.getChartOption(
    'New scenario',
    this.categories,
    this.data_new,
    'columnrange'
  );
  chartOptions_2 = this.getChartOptionColumn(
    'Base scenario',
    this.categories_2,
    this.data_2,
    'column'
  );
  chartOptions_3 = this.getChartOptionColumn(
    'New scenario',
    this.categories_2,
    this.data_2,
    'column'
  );
  chartOptions_4 = this.getChartOptionColumn(
    'Change in Units',
    this.categories_3,
    this.data_3,
    'column'
  );
  chartOptions_change = this.getChartOptionColumnYaxis(
    'change',
    this.category_change,
    this.data_change,
    'column'
  );
  chartOptionPerTonBase = this.getChartOption(
    'Base scenario',
    this.categories_perton,
    this.data_perton,
    'columnrange'
  );
  chartOptionPerTonNew = this.getChartOption(
    'New scenario',
    this.categories_perton,
    this.data_perton,
    'columnrange'
  );

  chartOptionBase = this.chartOptions;
  chanrtOptionsNew = this.chartOptions_1;
  chartOptionsChange = this.chartOptions_change;
  chartRetailerMars = this.chartOptions_2;
  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    // let y:UnitModel[] = this.apiservice.getData<UnitModel[]>(UnitModel);
    // console.log( y, "YYYYY")
    this.tableData$ = this.apiservice.getUnits();
    this.tableData$.subscribe((data) => {
      console.log(data, 'New unit LENGTH TABLE DATA');
      this.tableData = data;
      console.log(data.length, 'LENGTH TABLE DATA');
      this.populateFilter(this.tableData);
      this.filterData(this.tableData);
    });

    //  setTimeout(()=>{
    //    this.tableData = []

    //  },5000)

    // .subscribe((data:UnitModel[])=>{
    //   if(data){
    //     console.log(data , "DATA FROM JSO FILE")

    //   }

    // });
    // this.api.get

    // this.
    //.replace(/,/g, '')
  }

  toggleChange(e) {
    this.isToggle = e.checked;
    this.reRender();
    if (this.isToggle) {
      this.chartOptionBase = this.chartOptionPerTonBase;
      this.chanrtOptionsNew = this.chartOptionPerTonNew;
      this.chartOptionsChange = this.chartOptions_change;
      this.chartRetailerMars = this.chartOptions_2;
    } else {
      this.chartOptionBase = this.chartOptions;
      this.chanrtOptionsNew = this.chartOptions_1;
      this.chartOptionsChange = this.chartOptions_change;
      this.chartRetailerMars = this.chartOptions_2;
    }
  }
  populateFilter(datas) {
    of(...datas)
      .pipe(distinct((unit: UnitModel) => unit.category))
      .subscribe((data) => {
        this.categories_filter.push(data.category);
      });
    of(...datas)
      .pipe(distinct((unit: UnitModel) => unit.retailer))
      .subscribe((data) => {
        this.retailer_filter.push(data.retailer);
      });
    of(...datas)
      .pipe(distinct((unit: UnitModel) => unit.product_group))
      .subscribe((data) => {
        this.product_filter.push(data.product_group);
      });
  }
  resetFilter(name) {
    console.log(name);

    if (name == 'category') {
      this.selected_category = null;
      this.categoryFilter.next(null);
    }
    if (name == 'product') {
      this.selected_product = null;
      this.productFilter.next(null);
    }
    if (name == 'retail') {
      this.selected_retailer = null;
      this.retailerFilter.next(null);
    }
  }
  applyFilter() {
    this.categoryFilter.next(this.selected_category);
    this.productFilter.next(this.selected_product);
    this.retailerFilter.next(this.selected_retailer);
    combineLatest([
      this.tableData$,
      this.categoryFilter,
      this.productFilter,
      this.retailerFilter,
    ])
      .pipe(
        map(([units, category, product, retailer]) => {
          if (category) {
            units = units.filter((unit) => unit.category === category);
          }
          if (product) {
            units = units.filter((unit) => unit.product_group === product);
          }
          if (retailer) {
            units = units.filter((unit) => unit.retailer === retailer);
          }

          return units;
        })
      )
      .subscribe((data) => {
        this.filterData(data);
        console.log(data.length, 'LENGTH TABLE DATA');
      });

    // if(this.selected_category){
    //   this.tableData$.pipe(
    //   map(units=> units.filter(unit=> unit.category === this.selected_category))
    //   )

    // }
    // if(this.selected_product){
    //   this.tableData$.pipe(
    //     map(units=> units.filter(unit=> unit.product_group === this.selected_product))
    //     )

    // }
    // if(this.selected_retailer){
    //   this.tableData$.pipe(
    //     map(units=> units.filter(unit=> unit.retailer === this.selected_retailer))
    //     )

    // }
    // this.tableData$.subscribe(data=>{
    //   console.log(data.length , "LENGTH TABLE DATA")
    // })
    // And represent the current value of the two filters using
    // BehaviourSubjects

    // // combineLatest allows us to compose a stream of streams
    // const combineFilters = (
    //   items,
    //   this.filter1,
    //   this.filter2
    // ) =>

    // const filteredItems = combineFilters.subscribe();
  }
  onWriterChange() {
    alert('wewe');
  }
  filterData(units: NewUnit[]) {
    let totalrsv$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat, 0)
    );

    let trade_expense$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense, 0)
    );
    let total_nsv$ = of(...units).pipe(reduce((a, b) => a + b.total_nsv, 0));
    let total_cogs$ = of(...units).pipe(reduce((a, b) => a + b.total_cogs, 0));
    let mars_mac$ = of(...units).pipe(reduce((a, b) => a + b.mars_mac, 0));
    let retailer_margin$ = of(...units).pipe(
      reduce((a, b) => a + b.retailer_margin, 0)
    );
    let total_base$ = of(...units).pipe(reduce((a, b) => a + b.base_units, 0));
    let total_weight_in_tons$ = of(...units).pipe(
      reduce((a, b) => a + b.total_weight_in_tons, 0)
    );
    let rsv_vat_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_rsv_w_o_vat_new, 0)
    );
    let trade_expense_new$ = of(...units).pipe(
      reduce((a, b) => a + b.trade_expense_new, 0)
    );
    let total_nsv_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_nsv_new, 0)
    );
    let total_cogs_new$ = of(...units).pipe(
      reduce((a, b) => a + b.total_cogs_new, 0)
    );
    let mars_mac_new$ = of(...units).pipe(
      reduce((a, b) => a + b.mars_mac_new, 0)
    );
    let retailer_margin_new$ = of(...units).pipe(
      reduce((a, b) => a + b.retailer_margin_new, 0)
    );
    combineLatest([
      totalrsv$,
      trade_expense$,
      total_nsv$,
      total_cogs$,
      mars_mac$,
      retailer_margin$,
      total_base$,
      total_weight_in_tons$,
      rsv_vat_new$,
      trade_expense_new$,
      total_nsv_new$,
      total_cogs_new$,
      mars_mac_new$,
      retailer_margin_new$,
    ]).subscribe(
      ([
        totalrsv,
        tradeexpense,
        totalnsv,
        totalcogs,
        marsmc,
        retailermargin,
        totalbase,
        totalweightintons,
        rsv_vat_new,
        trade_expense_new,
        total_nsv_new,
        total_cogs_new,
        mars_mac_new,
        retailer_margin_new,
      ]) => {
        console.log(totalweightintons, 'totalweightintons');
        // console.log(rsv_vat_new , "RSV NEW");
        this.total_rsv = Math.ceil(totalrsv / 1000000);
        this.total_nsv = Math.ceil(totalnsv / 1000000);
        this.total_trade_expense = Math.ceil(tradeexpense / 1000000);
        this.total_cogs = Math.ceil(totalcogs / 1000000);
        this.total_mars_mac = Math.ceil(marsmc / 1000000);
        this.total_retailer_margin = Math.ceil(retailermargin / 1000000);
        this.total_base_units = Math.ceil(totalbase / 1000000);
        this.total_weight_in_tons = Math.ceil(totalweightintons);
        this.total_rsv_new = Math.ceil(rsv_vat_new / 1000000);
        this.total_trade_expense_new = Math.ceil(trade_expense_new / 1000000);
        this.total_cogs_new = Math.ceil(total_cogs_new / 1000000);
        this.total_nsv_new = Math.ceil(total_nsv_new / 1000000);
        this.total_mars_mac_new = Math.ceil(mars_mac_new / 1000000);
        this.total_retailer_margin_new = Math.ceil(
          retailer_margin_new / 1000000
        );
        this.rsv_w_o_vat_$_chg = -(this.total_rsv_new - this.total_rsv);
        this.trade_expense_$_chg = -(
          this.total_trade_expense_new - this.total_trade_expense
        );
        this.nsv_$_chg = -(this.total_nsv_new - this.total_nsv);
        this.cogs_$_chg = -(this.total_cogs_new - this.total_cogs);
        this.mars_mac_$_chg = -(this.total_mars_mac_new - this.total_mars_mac);
        this.retailer_margin_$_chg = -(
          this.total_retailer_margin_new - this.total_retailer_margin
        );

        this.rsv_w_o_vat_$_chg_percent =
          (this.rsv_w_o_vat_$_chg / this.total_rsv) * 100;
        this.trade_expense_$_chg_percent =
          (this.trade_expense_$_chg / this.total_trade_expense) * 100;
        this.nsv_$_chg_percent = (this.nsv_$_chg / this.total_nsv) * 100;
        this.cogs_$_chg_percent = (this.cogs_$_chg / this.total_cogs) * 100;
        this.mars_mac_$_chg_percent =
          (this.mars_mac_$_chg / this.total_mars_mac) * 100;
        this.retailer_margin_$_chg_percent =
          (this.retailer_margin_$_chg / this.total_retailer_margin) * 100;

        console.log(trade_expense_new, 'trade_expense_new NEW');
        console.log(total_cogs_new, 'total_cogs_new NEW');
        console.log(total_nsv_new, 'total_nsv_new NEW');
        console.log(mars_mac_new, 'mars_mac_new NEW');
        console.log(retailer_margin_new, 'retailer_margin_new NEW');
        this.reRender();
      }
    );
  }
  reRender() {
    this.data = [
      [0, this.total_rsv],
      [this.total_nsv, this.total_nsv + this.total_trade_expense],
      [0, this.total_nsv],
      [0, this.total_cogs],
      [this.total_cogs, this.total_cogs + this.total_mars_mac],
      [
        this.total_cogs + this.total_mars_mac,
        this.total_cogs + this.total_mars_mac + this.total_retailer_margin,
      ],
    ];
    this.data_perton = [
      [0, this.total_rsv / this.total_weight_in_tons],
      [
        this.total_nsv / this.total_weight_in_tons,
        this.total_nsv / this.total_weight_in_tons +
          this.total_trade_expense / this.total_weight_in_tons,
      ],
      [0, this.total_nsv / this.total_weight_in_tons],
      [0, this.total_cogs / this.total_weight_in_tons],
      [
        this.total_cogs / this.total_weight_in_tons,
        this.total_cogs / this.total_weight_in_tons +
          this.total_mars_mac / this.total_weight_in_tons,
      ],
      [
        this.total_cogs / this.total_weight_in_tons +
          this.total_mars_mac / this.total_weight_in_tons,
        this.total_cogs / this.total_weight_in_tons +
          this.total_mars_mac / this.total_weight_in_tons +
          this.total_retailer_margin / this.total_weight_in_tons,
      ],
    ];
    console.log(this.total_weight_in_tons, 'TOTAL WEIGH');
    console.log(this.data_perton, 'PER TON');
    console.log(this.data, 'DATA');
    this.data_new = [
      [0, this.total_rsv_new],
      [this.total_nsv_new, this.total_nsv_new + this.total_trade_expense_new],
      [0, this.total_nsv_new],
      [0, this.total_cogs_new],
      [this.total_cogs_new, this.total_cogs_new + this.total_mars_mac_new],
      [
        this.total_cogs_new + this.total_mars_mac_new,
        this.total_cogs_new +
          this.total_mars_mac_new +
          this.total_retailer_margin_new,
      ],
    ];
    this.data_change = [
      [
        this.rsv_w_o_vat_$_chg,
        this.trade_expense_$_chg,
        this.nsv_$_chg,
        this.cogs_$_chg,
        this.mars_mac_$_chg,
        this.retailer_margin_$_chg,
      ],
      [
        this.rsv_w_o_vat_$_chg_percent,
        this.trade_expense_$_chg_percent,
        this.nsv_$_chg_percent,
        this.cogs_$_chg_percent,
        this.mars_mac_$_chg_percent,
        this.retailer_margin_$_chg_percent,
      ],
    ];
    console.log(this.data_change, 'DATA CJANGE');
    this.data_3 = [this.total_base_units, this.total_base_units];
    this.data_2 = [
      parseFloat(((this.total_mars_mac / this.total_nsv) * 100).toFixed(2)),
      parseFloat(((this.total_mars_mac / this.total_nsv) * 100).toFixed(2)),
    ];
    this.chartOptions = this.getChartOption(
      'Base scenario',
      this.categories,
      this.data,
      'columnrange'
    );
    this.chartOptions_1 = this.getChartOption(
      'New scenario',
      this.categories,
      this.data_new,
      'columnrange'
    );
    this.chartOptions_4 = this.getChartOptionColumn(
      'Change in Units',
      this.categories_3,
      this.data_3,
      'column'
    );
    this.chartOptions_2 = this.getChartOptionColumn(
      'Base scenario',
      this.categories_2,
      this.data_2,
      'column'
    );
    this.chartOptions_3 = this.getChartOptionColumn(
      'New scenario',
      this.categories_2,
      this.data_2,
      'column'
    );
    this.chartOptionPerTonBase = this.getChartOption(
      'Base scenario',
      this.categories_perton,
      this.data_perton,
      'columnrange'
    );
    this.chartOptionPerTonNew = this.getChartOption(
      'New scenario',
      this.categories_perton,
      this.data_perton,
      'columnrange'
    );
    this.chartOptions_change = this.getChartOptionColumnYaxis(
      'change',
      this.category_change,
      this.data_change,
      'column'
    );
    this.chartOptionBase = this.chartOptions;
    this.chanrtOptionsNew = this.chartOptions_1;
    this.chartOptionsChange = this.chartOptions_change;
    this.chartRetailerMars = this.chartOptions_2;
  }
  getChartOptionColumn(title, categories, data_array, type) {
    return {
      chart: {
        backgroundColor: {
          linearGradient: [0, 0, 500, 500],
          stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(200, 200, 255)'],
          ],
        },
        type: type,
      },

      title: {
        text: title,
      },
      xAxis: {
        categories: categories,
      },
      yAxis: {
        title: {
          text: 'Percentage',
        },
      },

      tooltip: {
        formatter: function () {
          return this.y + '%';
        },
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y + '%';
            },
          },
        },
      },

      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          data: data_array,
        },
      ],
    };
  }

  getChartOptionColumnYaxis(title, categories, data_array, type) {
    return {
      chart: {
        backgroundColor: {
          linearGradient: [0, 0, 500, 500],
          stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(200, 200, 255)'],
          ],
        },
        zoomType: 'xy',
      },

      title: {
        text: title,
      },
      // subtitle: {
      //   text: 'change'
      // },
      xAxis: {
        categories: categories,
        crosshair: true,
      },

      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: '{value}$',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          title: {
            text: 'Value Changes(Millions)',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        {
          // Secondary yAxis
          title: {
            text: '% Change',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          labels: {
            format: '{value} %',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          opposite: true,
        },
      ],

      tooltip: {
        formatter: function () {
          return this.y + '%';
        },
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y + '%';
            },
          },
        },
      },

      // legend: {
      //   enabled: true
      // },
      legend: {
        layout: 'vertical',
        // align: 'left',
        // x: 120,
        verticalAlign: 'top',
        // y: 100,
        // floating: true,
        // backgroundColor:
        //   Highcharts.defaultOptions.legend.backgroundColor || // theme
        //   'rgba(255,255,255,0.25)'
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Value Changes',
          type: 'column',
          yAxis: 1,
          data: data_array[0],
          tooltip: {
            valueSuffix: '$',
          },
        },
        {
          name: '% change',
          type: 'spline',
          data: data_array[1],
          tooltip: {
            valueSuffix: '%',
          },
        },
      ],
      //     series: [{
      //       name:"Value change",
      //       data : data_array[0],
      //        zones: [{
      //          value: 1,
      //          color: '#47475C',
      //      } , {

      //      }]
      //    },
      //  {
      //   name : '% Change',
      //    data: data_array[1],
      //    yAxis: 1,

      //  }
      // ]
    };
  }

  getChartOption(title, categories, data_array, type) {
    console.log(data_array, 'DATAARRAY');
    return {
      chart: {
        backgroundColor: {
          linearGradient: [0, 0, 500, 500],
          stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(200, 200, 255)'],
          ],
        },
        type: type,
      },

      title: {
        text: title,
      },
      xAxis: {
        categories: categories,
      },
      yAxis: {
        title: {
          text: 'Millions',
        },
      },

      // yAxis: {

      // },
      tooltip: {
        formatter: function () {
          // console.log(this.point , "POINT")
          return (
            '<b>' + (this.point.high - this.point.low).toFixed(3) + ' ₽</b>'
          );
        },
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              // console.log("FORMATTER " , this)
              if (this.y != this.point.low) {
                let value = this.point.high - this.point.low;
                if (value % 1 != 0) {
                  return value.toFixed(3) + '₽';
                } else {
                  return String(value) + '₽';
                }
              }
            },
          },
        },
      },

      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          data: data_array,
          zones: [
            {
              value: 0.1,
              color: '#ffbf00',
            },
            {
              // value: 0.1,
              // color: '#47475C',
            },
          ],
        },
        // {
        //   data: data_array,
        //   yAxis: 1,
        //   name : 'Millions'
        // }
      ],
    };
  }
}
