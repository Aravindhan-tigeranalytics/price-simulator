// import { utils } from 'protractor';
import * as Utils from '../utils/utils';

export class ProfitPool {
  category: string;
  product_group: string;
  retailer: string;
  year: number;
  date: Date;
  promo_month: string;
  promo: string;
  promo_mechanic: string;
  promo_activity: string;
  promo_days: number;
  base_units: number;
  incremental_units: number; // q
  turnover_in_units: number; // r
  list_price: number; // s
  retail_average_selling_price: number; // t
  retail_average_selling_price_w_o_vat: number; // retail_average_selling_price * (1-x) x = 0.18 for 2017,2018 x = 0.2 for 19,20
  on_inv_percent: number;
  off_inv_percent: number;
  tpr_percent: number;
  gmac_percent_lsv: number;
  mars_on_invoice: number; //list_price * (on_inv_percent/100)
  mars_nrv: number; // list_price - mars_on_invoice
  tpr_budget: number; // mars_nrv * (tpr_percent/100)
  mars_net_invoice_price: number; //mars_nrv-(mars_nrv * (tpr_percent/100))
  mars_off_invoice: number; //mars_net_invoice_price*(off_inv_percent/100)
  mars_nsv: number; //mars_net_invoice_price - mars_off_invoice
  retail_mark_up: number; // ((retail_average_selling_price_w_o_vat/mars_nsv) - 1 ) * 100
  gmac_lsv_per_unit: number; // list_price * (gmac_percent_lsv/100)
  mars_cogs_per_unit: number; // list_price - Math.abs(gmac_lsv_per_unit)
  uplift_rsv: number; // retail_average_selling_price * incremental_units
  total_rsv: number; // retail_average_selling_price * turnover_in_units
  uplift_rsv_w_o_vat: number; //incremental_units * retail_average_selling_price_w_o_vat
  total_rsv_w_o_vat: number; // turnover_in_units * retail_average_selling_price_w_o_vat
  uplift_lsv: number; // incremental_units * list_price
  total_lsv: number; // turnover_in_units * list_price
  mars_uplift_on_invoice: number; // uplift_lsv * (on_inv_percent/100)
  mars_total_on_invoice: number; // total_lsv* (on_inv_percent/100)
  mars_uplift_nrv: number; // uplift_lsv - mars_uplift_on_invoice
  mars_total_nrv: number; //total_lsv - mars_total_on_invoice
  uplift_promo_cost: number; // mars_uplift_nrv * (tpr_percent/100)
  tpr_budget2: number; // mars_total_nrv * (tpr_percent/100)
  mars_uplift_net_invoice_price: number; //mars_uplift_nrv - uplift_promo_cost
  mars_total_net_invoice_price: number; //  mars_total_nrv - tpr_budget2
  mars_uplift_off_invoice: number; //mars_uplift_net_invoice_price * (off_inv_percent/100)w
  mars_total_off_invoice: number; //  mars_total_net_invoice_price * (off_inv_percent/100)
  uplift_nsv: number; // uplist_lsv - mars_uplift_on_invoice - uplift_promo_cost - mars_uplift_off_invoice
  total_nsv: number; // total_lsv - mars_total_on_invoice - tpr_budget2 - mars_total_off_invoice
  uplift_cogs: number; // mars_cogs_per_unit * incremental_units
  total_cogs: number; // mars_cogs_per_unit * turn_over_in_units
  trade_expense: number; // mars_total_on_invoice + tpr_budget2 + mars_total_off_invoice
  retailer_margin: number; // total_rsv_w_o_vat - total_nsv
  retailer_margin_percent_of_rsv: number; // bd/al  (retailer_margin / total_rsv_w_o_vat) * 100
  mars_mac: number; // az-bb total_nsv - total_cogs
  mars_mac_percent_of_nsv: number; // bf/az (mars_mac/total_nsv) * 100
  mars_percent_of_total_profit_pool: number; // =BF215/(BF215+BD215) (mars_mac/(mars_mac + retailer_margin)) * 100
  retailer_percent_of_total_profit_pool: number; // Bd215/(Bd215+Bf215)  (retiler_margin/(retailer_margin + mars_mac)) * 100

  incremental_trade_expense: number; //mars_uplift_on_invoice + tpr_budget2 + mars_uplift_off_invoice
  incremental_retailer_margin: number; //ak-ay uplift_rsv_w_o_vat - uplift_nsv
  incremental_retailer_margin_percent_of_rsv: number; // bk/ak  (incremental_retailer_margin / uplift_rsv_w_o_vat) * 100
  incremental_mars_mac: number; // ay-ba uplift_nsv - uplift_cogs
  incremental_mars_mac_percent_of_nsv: number; // bm/ay (incremental_mars_mac/uplift_nsv) * 100
  incremental_mars_percent_of_total_profit_pool: number; // =Bm215/(Bk215+Bm215) (incremental_mars_mac/(incremental_mars_mac + incremental_retailer_margin)) * 100
  incremental_retailer_percent_of_total_profit_pool: number; // Bk215/(Bk215+Bm215) (incremental_retailer_margin/(incremental_retailer_margin + incremental_mars_mac)) * 100

  constructor(
    category: string,
    product_group: string,
    retailer: string,
    year: number,
    date: Date,
    promo_month: string,
    promo: string,
    promo_mechanic: string,
    promo_activity: string,
    promo_days: number,
    base_units: number,
    incremental_units: number, // q
    turnover_in_units: number, // r
    list_price: number, // s
    retail_average_selling_price: number, // t
    on_inv_percent: number,
    off_inv_percent: number,
    tpr_percent: number,
    gmac_percent_lsv: number
  ) {
    this.category = category;
    this.product_group = product_group;
    this.retailer = retailer;
    this.year = year;
    this.date = date;
    this.promo_month = promo_month;
    this.promo = promo;
    this.promo_mechanic = promo_mechanic;
    this.promo_activity = promo_activity;
    this.promo_days = promo_days;
    this.base_units = base_units;
    this.incremental_units = incremental_units;
    this.turnover_in_units = turnover_in_units;
    this.list_price = list_price;
    this.retail_average_selling_price = retail_average_selling_price;
    this.retail_average_selling_price_w_o_vat =
      this.year == 2018 || this.year == 2017
        ? this.retail_average_selling_price * (1 - 0.18)
        : this.year == 2019 || this.year == 2020
        ? this.retail_average_selling_price * (1 - 0.2)
        : null;
    this.on_inv_percent = on_inv_percent;
    this.off_inv_percent = off_inv_percent;
    this.tpr_percent = tpr_percent;
    this.gmac_percent_lsv = gmac_percent_lsv;

    this.mars_on_invoice = this.list_price * (this.on_inv_percent / 100);
    this.mars_nrv = this.list_price - this.mars_on_invoice;
    this.tpr_budget = this.mars_nrv * (this.tpr_percent / 100);
    this.mars_net_invoice_price =
      this.mars_nrv - this.mars_nrv * (this.tpr_percent / 100);
    this.mars_off_invoice =
      this.mars_net_invoice_price * (this.off_inv_percent / 100);
    this.mars_nsv = this.mars_net_invoice_price - this.mars_off_invoice;
    this.retail_mark_up =
      (this.retail_average_selling_price_w_o_vat / this.mars_nsv - 1) * 100;
    this.gmac_lsv_per_unit = this.list_price * (this.gmac_percent_lsv / 100);
    this.mars_cogs_per_unit =
      this.list_price - Math.abs(this.gmac_lsv_per_unit);
    this.uplift_rsv =
      this.retail_average_selling_price * this.incremental_units;
    this.total_rsv = this.retail_average_selling_price * this.turnover_in_units;
    this.uplift_rsv_w_o_vat =
      this.incremental_units * this.retail_average_selling_price_w_o_vat;
    this.total_rsv_w_o_vat =
      this.turnover_in_units * this.retail_average_selling_price_w_o_vat;
    this.uplift_lsv = this.incremental_units * this.list_price;
    this.total_lsv = this.turnover_in_units * this.list_price;
    this.mars_uplift_on_invoice = this.uplift_lsv * (this.on_inv_percent / 100);
    this.mars_total_on_invoice = this.total_lsv * (this.on_inv_percent / 100);
    this.mars_uplift_nrv = this.uplift_lsv - this.mars_uplift_on_invoice;
    this.mars_total_nrv = this.total_lsv - this.mars_total_on_invoice;
    this.uplift_promo_cost = this.mars_uplift_nrv * (tpr_percent / 100);
    this.tpr_budget2 = this.mars_total_nrv * (this.tpr_percent / 100);
    this.mars_uplift_net_invoice_price =
      this.mars_uplift_nrv - this.uplift_promo_cost;
    this.mars_total_net_invoice_price = this.mars_total_nrv - this.tpr_budget2;
    this.mars_uplift_off_invoice =
      this.mars_uplift_net_invoice_price * (this.off_inv_percent / 100);
    this.mars_total_off_invoice =
      this.mars_total_net_invoice_price * (this.off_inv_percent / 100);
    this.uplift_nsv =
      this.uplift_lsv -
      this.mars_uplift_on_invoice -
      this.uplift_promo_cost -
      this.mars_uplift_off_invoice;
    this.total_nsv =
      this.total_lsv -
      this.mars_total_on_invoice -
      this.tpr_budget2 -
      this.mars_total_off_invoice;
    this.uplift_cogs = this.mars_cogs_per_unit * this.incremental_units;
    this.total_cogs = this.mars_cogs_per_unit * this.turnover_in_units;
    this.trade_expense =
      this.mars_total_on_invoice +
      this.tpr_budget2 +
      this.mars_total_off_invoice;
    this.retailer_margin = this.total_rsv_w_o_vat - this.total_nsv;
    this.retailer_margin_percent_of_rsv =
      Utils.NanCheck(this.retailer_margin, this.total_rsv_w_o_vat) * 100;
    this.mars_mac = this.total_nsv - this.total_cogs;
    this.mars_mac_percent_of_nsv =
      Utils.NanCheck(this.mars_mac, this.total_nsv) * 100;
    this.mars_percent_of_total_profit_pool =
      Utils.NanCheck(this.mars_mac, this.mars_mac + this.retailer_margin) * 100;
    this.retailer_percent_of_total_profit_pool =
      Utils.NanCheck(
        this.retailer_margin,
        this.retailer_margin + this.mars_mac
      ) * 100;

    this.incremental_trade_expense =
      this.mars_uplift_on_invoice +
      this.tpr_budget2 +
      this.mars_uplift_off_invoice;
    this.incremental_retailer_margin =
      this.uplift_rsv_w_o_vat - this.uplift_nsv;
    this.incremental_retailer_margin_percent_of_rsv =
      Utils.NanCheck(
        this.incremental_retailer_margin,
        this.uplift_rsv_w_o_vat
      ) * 100;
    this.incremental_mars_mac = this.uplift_nsv - this.uplift_cogs;
    this.incremental_mars_mac_percent_of_nsv =
      Utils.NanCheck(this.incremental_mars_mac, this.uplift_nsv) * 100;
    this.incremental_mars_percent_of_total_profit_pool =
      Utils.NanCheck(
        this.incremental_mars_mac,
        this.incremental_mars_mac + this.incremental_retailer_margin
      ) * 100;
    this.incremental_retailer_percent_of_total_profit_pool =
      Utils.NanCheck(
        this.incremental_retailer_margin,
        this.incremental_retailer_margin + this.incremental_mars_mac
      ) * 100;
  }
}
