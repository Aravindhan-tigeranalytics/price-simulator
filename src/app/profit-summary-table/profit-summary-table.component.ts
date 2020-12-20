import { Component, OnInit } from '@angular/core';
import { ProfitPoolService } from '../shared/services/profit-pool.service';
import { ExcelServicesService } from '../shared/services/excel.service';
import { Observable, of, from, BehaviorSubject, combineLatest } from 'rxjs';
import { ProfitPool } from '../shared/models/profit-pool.model';
import * as Utils from '../shared/utils/utils';
@Component({
  selector: 'app-profit-summary-table',
  templateUrl: './profit-summary-table.component.html',
  styleUrls: ['./profit-summary-table.component.scss'],
})
export class ProfitSummaryTableComponent implements OnInit {
  profitPool: ProfitPool[];
  profitPool$: Observable<ProfitPool[]>;

  constructor(
    private profitService: ProfitPoolService,
    private excelService: ExcelServicesService
  ) {}

  ngOnInit(): void {
    this.profitPool$ = this.profitService.getProfitPool();
    this.profitPool$.subscribe((data) => {
      this.profitPool = data;
      // this.summary(data);
    });
  }

  downloadSummary(metric) {
    console.log(this.summary(this.profitPool, metric));
    this.excelService.exportAsExcelFile(
      this.summary(this.profitPool, metric),
      'Summary'
    );
  }

  summary(data: ProfitPool[], metric) {
    // let gstr = []
    let obj = {};

    data.forEach((profit) => {
      let str;
      if (metric == 'Y') {
        str =
          profit.category +
          profit.product_group +
          profit.retailer +
          profit.year;
      }
      if (metric == 'A') {
        str =
          profit.category +
          profit.product_group +
          profit.retailer +
          profit.year +
          profit.promo_activity;
      }
      if (metric == 'M') {
        str =
          profit.category +
          profit.product_group +
          profit.retailer +
          profit.year +
          profit.promo_mechanic;
      }
      // if (str == 'ChocoBIG BARSMagnit2018') {
      //   console.log(
      //     profit.incremental_mars_mac_percent_of_nsv,
      //     'incremental_mars_mac_percent_of_nsv'
      //   );
      //   console.log(
      //     profit.incremental_retailer_margin_percent_of_rsv,
      //     'incremental_retailer_margin_percent_of_rsv'
      //   );
      // }
      if (str in obj) {
        let ob = obj[str];
        ob['Base Units'] = ob['Base Units'] + profit.base_units;
        ob['Incremental Units'] =
          ob['Incremental Units'] + profit.incremental_units;
        ob['Turnover in Units'] =
          ob['Turnover in Units'] + profit.turnover_in_units;
        ob['List Price'] = Utils.PercentAverageCalcuate(
          ob['List Price'],
          profit.list_price
        );
        // (ob['List Price'] + profit.list_price) / 2;
        ob['Retailer Average Selling Price'] = Utils.PercentAverageCalcuate(
          ob['Retailer Average Selling Price'],
          profit.retail_average_selling_price
        );
        // ( +
        //   ) /
        // 2;
        ob[
          'Retailer Average Selling Price w/o VAT'
        ] = Utils.PercentAverageCalcuate(
          ob['Retailer Average Selling Price w/o VAT'],
          profit.retail_average_selling_price_w_o_vat
        );
        // (ob['Retailer Average Selling Price w/o VAT'] +
        //   profit.retail_average_selling_price_w_o_vat) /
        // 2;
        ob['Trade Expense'] = ob['Trade Expense'] + profit.trade_expense;
        ob['Retailer Margin'] = ob['Retailer Margin'] + profit.retailer_margin;
        ob['Retailer Margin,% of RSV'] = Utils.PercentAverageCalcuate(
          ob['Retailer Margin,% of RSV'],
          profit.retailer_margin_percent_of_rsv
        );
        // (ob['Retailer Margin,% of RSV'] +
        //   profit.retailer_margin_percent_of_rsv) /
        // 2;
        ob['Mars MAC'] = ob['Mars MAC'] + profit.mars_mac;
        ob['Mars MAC,% of NSV'] = Utils.PercentAverageCalcuate(
          ob['Mars MAC,% of NSV'],
          profit.mars_mac_percent_of_nsv
        );
        // (ob['Mars MAC,% of NSV'] + profit.mars_mac_percent_of_nsv) / 2;
        ob['Mars,% of Total Profit Pool'] = Utils.PercentAverageCalcuate(
          ob['Mars,% of Total Profit Pool'],
          profit.mars_percent_of_total_profit_pool
        );
        // (ob['Mars,% of Total Profit Pool'] + profit.mars_mac_percent_of_nsv) /
        // 2;
        ob['Retailer,% of Total Profit Pool'] = Utils.PercentAverageCalcuate(
          ob['Retailer,% of Total Profit Pool'],
          profit.retailer_percent_of_total_profit_pool
        );
        // (ob['Retailer,% of Total Profit Pool'] +
        //   profit.retailer_percent_of_total_profit_pool) /
        // 2;
        ob['Incremental Trade Expense'] =
          ob['Incremental Trade Expense'] + profit.incremental_trade_expense;
        ob['Incremental Retailer Margin'] =
          ob['Incremental Retailer Margin'] +
          profit.incremental_retailer_margin;
        ob[
          'Incremental Retailer Margin,% of RSV'
        ] = Utils.PercentAverageCalcuate(
          ob['Incremental Retailer Margin,% of RSV'],
          profit.incremental_retailer_margin_percent_of_rsv
        );
        // (ob['Incremental Retailer Margin,% of RSV'] +
        //   profit.incremental_retailer_margin_percent_of_rsv) /
        // 2;
        ob['Incremental Mars MAC'] =
          ob['Incremental Mars MAC'] + profit.incremental_mars_mac;
        ob['Incremental Mars MAC,% of NSV'] = Utils.PercentAverageCalcuate(
          ob['Incremental Mars MAC,% of NSV'],
          profit.incremental_mars_mac_percent_of_nsv
        );
        // (ob['Incremental Mars MAC,% of NSV'] +
        //   profit.incremental_mars_mac_percent_of_nsv) /
        // 2;
        ob[
          'Incremental Mars,% of Total Profit Pool'
        ] = Utils.PercentAverageCalcuate(
          ob['Incremental Mars,% of Total Profit Pool'],
          profit.incremental_mars_percent_of_total_profit_pool
        );

        // (ob['Incremental Mars,% of Total Profit Pool'] +
        //   profit.incremental_mars_mac_percent_of_nsv) /
        // 2;
        ob[
          'Incremental Retailer,% of Total Profit Pool'
        ] = Utils.PercentAverageCalcuate(
          ob['Incremental Retailer,% of Total Profit Pool'],
          profit.incremental_retailer_percent_of_total_profit_pool
        );
        // (ob['Incremental Retailer,% of Total Profit Pool'] +
        //   profit.incremental_retailer_percent_of_total_profit_pool) /
        // 2;
      } else {
        obj[str] = {
          Category: profit.category,
          'Product Group': profit.product_group,
          Retailer: profit.retailer,
          'Promo Activity': profit.promo_activity,
          'Promo Mechanic': profit.promo_mechanic,
          Year: profit.year,
          'Base Units': profit.base_units,
          'Incremental Units': profit.incremental_units,
          'Turnover in Units': profit.turnover_in_units,
          'List Price': profit.list_price,
          'Retailer Average Selling Price': profit.retail_average_selling_price,
          'Retailer Average Selling Price w/o VAT':
            profit.retail_average_selling_price,
          'Trade Expense': profit.trade_expense,
          'Retailer Margin': profit.retailer_margin,
          'Retailer Margin,% of RSV': profit.retailer_margin_percent_of_rsv,
          'Mars MAC': profit.mars_mac,
          'Mars MAC,% of NSV': profit.mars_mac_percent_of_nsv,
          'Mars,% of Total Profit Pool':
            profit.mars_percent_of_total_profit_pool,
          'Retailer,% of Total Profit Pool':
            profit.retailer_percent_of_total_profit_pool,
          'Incremental Trade Expense': profit.incremental_trade_expense,
          'Incremental Retailer Margin': profit.incremental_retailer_margin,
          'Incremental Retailer Margin,% of RSV':
            profit.incremental_retailer_margin_percent_of_rsv,
          'Incremental Mars MAC': profit.incremental_mars_mac,
          'Incremental Mars MAC,% of NSV':
            profit.incremental_mars_mac_percent_of_nsv,
          'Incremental Mars,% of Total Profit Pool':
            profit.incremental_mars_percent_of_total_profit_pool,
          'Incremental Retailer,% of Total Profit Pool':
            profit.incremental_retailer_percent_of_total_profit_pool,
        };
      }
    });
    return Object.values(obj);
  }
}
