import { propertyMap } from '../utils/decorators';

// @propertyMap("Category")
// category : string;
// @propertyMap("Product Group")
// product_group : string;
// @propertyMap("Retailer")
// retailer : string;
// @propertyMap("Year")
// year : string;
// @propertyMap("Date")
// date: string;
// @propertyMap("%LPI")
// lpi_percent:string;
// @propertyMap("% RSP Increase")
// rsp_increase_percent:string;
// @propertyMap("% COGS Increase")
// cogs_increase_percent: string;
// @propertyMap("Base Price Elasticity")
// base_price_elasticity: string;
// @propertyMap("Cross Elasticity")
// cross_elasticity: string;
// @propertyMap("Net Elasticity")
// net_elasticity: string;
// @propertyMap("Competition")
// competition: string
// @propertyMap("Base Units")
// base_units: string
// @propertyMap("List Price")
// list_price: string
// @propertyMap("Retailer Median Base Price")
// retailer_median_base_price: string;
// @propertyMap("Retailer Median Base Price  w\\o VAT")
// retailer_median_base_price_w_o_vat: string;
// @propertyMap("On Inv. %")
// on_inv_percent: string
// @propertyMap("Off Inv. %")
// off_inv_percent: string
// @propertyMap("TPR %")
// tpr_percent: string;
// @propertyMap("GMAC%, LSV")
// gmac_percent_lsv: string;
// @propertyMap("Product Group Weight (grams)")
// product_group_weight_in_grams: string;
// @propertyMap("Mars On-Invoice")
// mars_on_invoice: string;
// @propertyMap("Mars NSV")
// mars_nrv: string;
// @propertyMap("TPR Budget")
// tpr_budget: string;
// @propertyMap("Mars Net Invoice Price")
// mars_net_invoice_price: string;
// @propertyMap("Mars Off-Invoice")
// mars_off_invoice: string;
// @propertyMap("Mars NSV")
// mars_nsv: string;
// @propertyMap("Retailer mark-up")
// retailer_mark_up: string;
// @propertyMap("GMAC, LSV Per Unit")
// gmac_lsv_per_unit: string;
// @propertyMap("Mars COGS Per Unit")
// mars_cogs_per_unit: string;
// @propertyMap("Total RSV")
// total_rsv: string;
// @propertyMap("Total RSV  w\\o VAT")
// total_rsv_w_o_vat: string;
// @propertyMap("Total LSV")
// total_lsv: string;
// @propertyMap("Mars Total On-Invoice ")
// mars_total_on_invoice: string;
// @propertyMap("Mars Total NRV")
// mars_total_nrv:string;
// @propertyMap("Mars Total Net Invoice Price")
// mars_total_net_invoice_price: string;
// @propertyMap("Mars Total Off-Invoice")
// mars_total_off_invoice: string;
// @propertyMap("Total NSV")
// total_nsv: string;
// @propertyMap("Total COGS")
// total_cogs: string;
// @propertyMap("Total Weight (tons)")
// total_weight_in_tons: string;
// @propertyMap(" Trade Expense")
// trade_expense: string;
// @propertyMap("Retailer Margin")
// retailer_margin: string;
// @propertyMap("Retailer Margin,% of RSP")
// retailer_margin_percent_of_rsp: string;
// @propertyMap("Mars MAC")
// mars_mac: string;
// @propertyMap("Mars MAC,% of NSV")
// mars_mac_percent_of_nsv: string;
// @propertyMap("Mars,% of Total Profit Pool")
// mars_percent_of_total_profit_pool: string;
// @propertyMap("Retailer ,% of Total Profit Pool")
// retailer_percent_of_total_profit_pool: string

// export interface Unit{
//     "Category" : string;
//     "Product Group" : string;
//     "Retailer" : string;
//     "Year" : string;
//     "Date": string;
//     "%LPI":string;
//     "% RSP Increase":string;
//     "% COGS Increase": string;
//     "Base Price Elasticity": string;
//     "Cross Elasticity": string;
//     "Net Elasticity": string;
//     "Competition": string
//     "Base Units": string;
//     "List Price": string;
//     "Retailer Median Base Price": string;
//     "Retailer Median Base Price  w\\o VAT": string;
//     "On Inv. %": string;
//     "Off Inv. %": string;
//     "TPR %": string;
//     "GMAC%, LSV": string;
//     "Product Group Weight (grams)": string;
//     "Mars On-Invoice": string;
//     "Mars NRV": string;
//     "TPR Budget": string;
//     "Mars Net Invoice Price": string;
//     "Mars Off-Invoice": string;
//     "Mars NSV": string;
//     "Retailer mark-up": string;
//     "GMAC, LSV Per Unit": string;
//     "Mars COGS Per Unit": string;
//     "Total RSV": string;
//     "Total RSV  w\\o VAT": string;
//     "Total LSV": string;
//     "Mars Total On-Invoice ": string;
//     "Mars Total NRV":string;
//     "Mars Total Net Invoice Price": string;
//     "Mars Total Off-Invoice": string;
//     "Total NSV": string;
//     "Total COGS": string;
//     "Total Weight (tons)": string;
//     " Trade Expense": string;
//     "Retailer Margin": string;
//     "Retailer Margin,% of RSP": string;
//     "Mars MAC": string;
//     "Mars MAC,% of NSV": string;
//     "Mars,% of Total Profit Pool": string;
//     "Retailer ,% of Total Profit Pool": string

// }

export class UnitModel {
  // @propertyMap("Category")
  category: string;
  // @propertyMap("Product Group")
  product_group: string;
  // @propertyMap("Retailer")
  retailer: string;
  // @propertyMap("Year")
  year: string;
  // @propertyMap("Date")
  date: string;
  // @propertyMap("%LPI")
  lpi_percent: string;
  // @propertyMap("% RSP Increase")
  rsp_increase_percent: string;
  // @propertyMap("% COGS Increase")
  cogs_increase_percent: string;
  // @propertyMap("Base Price Elasticity")
  base_price_elasticity: string;
  // @propertyMap("Cross Elasticity")
  cross_elasticity: string;
  // @propertyMap("Net Elasticity")
  net_elasticity: string;
  // @propertyMap("Competition")
  competition: string;
  // @propertyMap("Base Units")
  base_units: string;
  // @propertyMap("List Price")
  list_price: string;
  // @propertyMap("Retailer Median Base Price")
  retailer_median_base_price: string;
  // @propertyMap("Retailer Median Base Price  w\\o VAT")
  retailer_median_base_price_w_o_vat: string;
  // @propertyMap("On Inv. %")
  on_inv_percent: string;
  // @propertyMap("Off Inv. %")
  off_inv_percent: string;
  // @propertyMap("TPR %")
  tpr_percent: string;
  // @propertyMap("GMAC%, LSV")
  gmac_percent_lsv: string;
  // @propertyMap("Product Group Weight (grams)")
  product_group_weight_in_grams: string;
  // @propertyMap("Mars On-Invoice")
  mars_on_invoice: string;
  // @propertyMap("Mars NSV")
  mars_nrv: string;
  // @propertyMap("TPR Budget")
  tpr_budget: string;
  // @propertyMap("Mars Net Invoice Price")
  mars_net_invoice_price: string;
  // @propertyMap("Mars Off-Invoice")
  mars_off_invoice: string;
  // @propertyMap("Mars NSV")
  mars_nsv: string;
  // @propertyMap("Retailer mark-up")
  retailer_mark_up: string;
  // @propertyMap("GMAC, LSV Per Unit")
  gmac_lsv_per_unit: string;
  // @propertyMap("Mars COGS Per Unit")
  mars_cogs_per_unit: string;
  // @propertyMap("Total RSV")
  total_rsv: string;
  // @propertyMap("Total RSV  w\\o VAT")
  total_rsv_w_o_vat: number;
  // @propertyMap("Total LSV")
  total_lsv: string;
  // @propertyMap("Mars Total On-Invoice ")
  mars_total_on_invoice: string;
  // @propertyMap("Mars Total NRV")
  mars_total_nrv: string;
  // @propertyMap("Mars Total Net Invoice Price")
  mars_total_net_invoice_price: string;
  // @propertyMap("Mars Total Off-Invoice")
  mars_total_off_invoice: string;
  // @propertyMap("Total NSV")
  total_nsv: string;
  // @propertyMap("Total COGS")
  total_cogs: string;
  // @propertyMap("Total Weight (tons)")
  total_weight_in_tons: string;
  // @propertyMap(" Trade Expense")
  trade_expense: string;
  // @propertyMap("Retailer Margin")
  retailer_margin: string;
  // @propertyMap("Retailer Margin,% of RSP")
  retailer_margin_percent_of_rsp: string;
  // @propertyMap("Mars MAC")
  mars_mac: string;
  // @propertyMap("Mars MAC,% of NSV")
  mars_mac_percent_of_nsv: string;
  // @propertyMap("Mars,% of Total Profit Pool")
  mars_percent_of_total_profit_pool: string;
  // @propertyMap("Retailer ,% of Total Profit Pool")

  retailer_percent_of_total_profit_pool: string;

  // newObject : NewUnit;
  constructor(
    category,
    product_group,
    retailer,
    year,
    date,
    lpi_percent,
    rsp_increase_percent,
    cogs_increase_percent,
    base_price_elasticity,
    cross_elasticity,
    net_elasticity,
    competition,
    base_units,
    list_price,
    retailer_median_base_price,
    retailer_median_base_price_w_o_vat,
    on_inv_percent,
    off_inv_percent,
    tpr_percent,
    gmac_percent_lsv,
    product_group_weight_in_grams,
    mars_on_invoice,
    mars_nrv,
    tpr_budget,
    mars_net_invoice_price,
    mars_off_invoice,
    mars_nsv,
    retailer_mark_up,
    gmac_lsv_per_unit,
    mars_cogs_per_unit,
    total_rsv,
    total_rsv_w_o_vat,
    total_lsv,
    mars_total_on_invoice,
    mars_total_nrv,
    mars_total_net_invoice_price,
    mars_total_off_invoice,
    total_nsv,
    total_cogs,
    total_weight_in_tons,
    trade_expense,
    retailer_margin,
    retailer_margin_percent_of_rsp,
    mars_mac,
    mars_mac_percent_of_nsv,
    mars_percent_of_total_profit_pool,
    retailer_percent_of_total_profit_pool
  ) {
    this.category = category;

    this.product_group = product_group;
    this.retailer = retailer;

    this.year = year;

    this.date = date;

    this.lpi_percent = lpi_percent;

    this.rsp_increase_percent = rsp_increase_percent;

    this.cogs_increase_percent = cogs_increase_percent;

    this.base_price_elasticity = base_price_elasticity;

    this.cross_elasticity = cross_elasticity;

    this.net_elasticity = net_elasticity;

    this.competition = competition;
    this.base_units = base_units;

    this.list_price = list_price;

    this.retailer_median_base_price = retailer_median_base_price;

    this.retailer_median_base_price_w_o_vat = retailer_median_base_price_w_o_vat;

    this.on_inv_percent = on_inv_percent;

    this.off_inv_percent = off_inv_percent;

    this.tpr_percent = tpr_percent;

    this.gmac_percent_lsv = gmac_percent_lsv;

    this.product_group_weight_in_grams = product_group_weight_in_grams;

    this.mars_on_invoice = mars_on_invoice;

    this.mars_nrv = mars_nrv;

    this.tpr_budget = tpr_budget;

    this.mars_net_invoice_price = mars_net_invoice_price;

    this.mars_off_invoice = mars_off_invoice;

    this.mars_nsv = mars_nsv;

    this.retailer_mark_up = retailer_mark_up;

    this.gmac_lsv_per_unit = gmac_lsv_per_unit;

    this.mars_cogs_per_unit = mars_cogs_per_unit;

    this.total_rsv = total_rsv;

    this.total_rsv_w_o_vat =
      parseFloat(this.base_units.replace(/,/g, '')) *
      parseFloat(this.retailer_median_base_price_w_o_vat);

    this.total_lsv = total_lsv;

    this.mars_total_on_invoice = mars_total_on_invoice;

    this.mars_total_nrv = mars_total_nrv;

    this.mars_total_net_invoice_price = mars_total_net_invoice_price;

    this.mars_total_off_invoice = mars_total_off_invoice;
    this.total_nsv = total_nsv;
    this.total_cogs = total_cogs;

    this.total_weight_in_tons = total_weight_in_tons;

    this.trade_expense = trade_expense;

    this.retailer_margin = retailer_margin;

    this.retailer_margin_percent_of_rsp = retailer_margin_percent_of_rsp;

    this.mars_mac = mars_mac;

    this.mars_mac_percent_of_nsv = mars_mac_percent_of_nsv;

    this.mars_percent_of_total_profit_pool = mars_percent_of_total_profit_pool;

    this.retailer_percent_of_total_profit_pool = retailer_percent_of_total_profit_pool;
  }
}

export class NewUnit extends UnitModel {
  new_base_units: number;
  suggested_list_price: number;
  suggested_retailer_median_base_price_w_o_vat: number;
  on_inv_percent_new: number;
  off_inv_percent_new: number;
  tpr_percent_new: number;
  product_group_weight_in_grams_new: number;
  mars_on_invoice_new: number;
  mars_nrv_new: number;
  tpr_budget_new: number;
  mars_net_invoice_price_new: number;
  mars_off_invoice_new: number;
  mars_nsv_new: number;
  retailer_mark_up_new: number;
  mars_cogs_per_unit_new: number;
  total_rsv_w_o_vat_new: number;
  total_lsv_new: number;
  mars_total_on_invoice_new: number;
  mars_total_nrv_new: number;
  tpr_budget_new_nrv: number;
  mars_total_net_invoice_price_new: number;
  mars_total_off_invoice_new: number;
  total_nsv_new: number;
  total_cogs_new: number;
  total_weight_in_tons_new: number;
  trade_expense_new: number;
  retailer_margin_new: number;
  retailer_margin_percent_of_rsp_new: number;
  mars_mac_new: number;
  mars_mac_percent_of_nsv_new: number;
  mars_percent_of_total_profit_pool_new: number;
  retailer_percent_of_total_profit_pool_new: number;
  rsv_w_o_vat_$_chg: number;
  nsv_$_chg: number;
  cogs_$_chg: number;
  trade_expense_$_chg: number;
  retailer_margin_$_chg: number;
  mars_mac_$_chg: number;
  percent_rsv_w_o_vat_$_chg: number;
  percent_nsv_$_chg: number;
  percent_cogs_$_chg: number;
  percent_trade_expense_$_chg: number;
  percent_retailer_margin_$_chg: number;
  percent_mars_mac_$_chg: number;

  constructor(
    category,
    product_group,
    retailer,
    year,
    date,
    lpi_percent,
    rsp_increase_percent,
    cogs_increase_percent,
    base_price_elasticity,
    cross_elasticity,
    net_elasticity,
    competition,
    base_units,
    list_price,
    retailer_median_base_price,
    retailer_median_base_price_w_o_vat,
    on_inv_percent,
    off_inv_percent,
    tpr_percent,
    gmac_percent_lsv,
    product_group_weight_in_grams,
    mars_on_invoice,
    mars_nrv,
    tpr_budget,
    mars_net_invoice_price,
    mars_off_invoice,
    mars_nsv,
    retailer_mark_up,
    gmac_lsv_per_unit,
    mars_cogs_per_unit,
    total_rsv,
    total_rsv_w_o_vat,
    total_lsv,
    mars_total_on_invoice,
    mars_total_nrv,
    mars_total_net_invoice_price,
    mars_total_off_invoice,
    total_nsv,
    total_cogs,
    total_weight_in_tons,
    trade_expense,
    retailer_margin,
    retailer_margin_percent_of_rsp,
    mars_mac,
    mars_mac_percent_of_nsv,
    mars_percent_of_total_profit_pool,
    retailer_percent_of_total_profit_pool
  ) {
    super(
      category,
      product_group,
      retailer,
      year,
      date,
      lpi_percent,
      rsp_increase_percent,
      cogs_increase_percent,
      base_price_elasticity,
      cross_elasticity,
      net_elasticity,
      competition,
      base_units,
      list_price,
      retailer_median_base_price,
      retailer_median_base_price_w_o_vat,
      on_inv_percent,
      off_inv_percent,
      tpr_percent,
      gmac_percent_lsv,
      product_group_weight_in_grams,
      mars_on_invoice,
      mars_nrv,
      tpr_budget,
      mars_net_invoice_price,
      mars_off_invoice,
      mars_nsv,
      retailer_mark_up,
      gmac_lsv_per_unit,
      mars_cogs_per_unit,
      total_rsv,
      total_rsv_w_o_vat,
      total_lsv,
      mars_total_on_invoice,
      mars_total_nrv,
      mars_total_net_invoice_price,
      mars_total_off_invoice,
      total_nsv,
      total_cogs,
      total_weight_in_tons,
      trade_expense,
      retailer_margin,
      retailer_margin_percent_of_rsp,
      mars_mac,
      mars_mac_percent_of_nsv,
      mars_percent_of_total_profit_pool,
      retailer_percent_of_total_profit_pool
    );
    this.updateValues();
  }
  updateValues() {
    this.suggested_retailer_median_base_price_w_o_vat =
      parseFloat(this.retailer_median_base_price_w_o_vat) *
      (1 + parseFloat(this.rsp_increase_percent));
    this.new_base_units =
      parseFloat(this.base_units.replace(/,/g, '')) *
      (1 +
        parseFloat(this.base_price_elasticity) *
          ((this.suggested_retailer_median_base_price_w_o_vat -
            parseFloat(
              this.retailer_median_base_price_w_o_vat.replace(/,/g, '')
            )) /
            parseFloat(
              this.retailer_median_base_price_w_o_vat.replace(/,/g, '')
            )));
    // parseFloat(this.total_rsv_w_o_vat) * parseFloat(this.trade_expense);
    this.suggested_list_price =
      parseFloat(this.list_price) * (1 + parseFloat(this.lpi_percent));

    this.on_inv_percent_new = parseFloat(this.on_inv_percent);
    this.off_inv_percent_new = parseFloat(this.off_inv_percent);
    this.tpr_percent_new = parseFloat(this.tpr_percent);
    this.product_group_weight_in_grams_new = parseFloat(
      this.product_group_weight_in_grams
    );
    this.mars_on_invoice_new =
      (this.on_inv_percent_new / 100) * this.suggested_list_price;
    this.mars_nrv_new = this.suggested_list_price - this.mars_on_invoice_new;
    this.tpr_budget_new = this.mars_nrv_new * this.tpr_percent_new;
    this.mars_net_invoice_price_new =
      this.mars_nrv_new - this.mars_nrv_new * this.tpr_percent_new;
    this.mars_off_invoice_new =
      (this.off_inv_percent_new / 100) * this.mars_net_invoice_price_new;
    this.mars_nsv_new =
      this.mars_net_invoice_price_new - this.mars_off_invoice_new;
    this.retailer_mark_up_new =
      (this.suggested_retailer_median_base_price_w_o_vat / this.mars_nsv_new -
        1) *
      100;
    this.mars_cogs_per_unit_new =
      parseFloat(this.mars_cogs_per_unit) *
      (1 + parseFloat(this.cogs_increase_percent));
    this.total_rsv_w_o_vat_new =
      this.new_base_units * this.suggested_retailer_median_base_price_w_o_vat;
    this.total_lsv_new = this.new_base_units * this.suggested_list_price;
    this.mars_total_on_invoice_new =
      (this.on_inv_percent_new / 100) * this.total_lsv_new;
    this.mars_total_nrv_new =
      this.total_lsv_new - this.mars_total_on_invoice_new;
    this.tpr_budget_new_nrv = this.tpr_percent_new * this.mars_total_nrv_new;
    this.mars_total_net_invoice_price_new =
      this.mars_total_nrv_new - this.tpr_budget_new_nrv;
    this.mars_total_off_invoice_new =
      (this.mars_total_net_invoice_price_new * this.off_inv_percent_new) / 100;
    this.total_nsv_new =
      this.total_lsv_new -
      this.mars_total_on_invoice_new -
      this.tpr_budget_new_nrv -
      this.mars_total_off_invoice_new;
    this.total_cogs_new = this.mars_cogs_per_unit_new * this.new_base_units;
    this.total_weight_in_tons_new =
      (this.product_group_weight_in_grams_new * this.new_base_units) / 1000000;
    this.trade_expense_new =
      this.mars_total_on_invoice_new +
      this.tpr_budget_new_nrv +
      this.mars_total_off_invoice_new;
    this.retailer_margin_new = this.total_rsv_w_o_vat_new - this.total_nsv_new;
    this.retailer_margin_percent_of_rsp_new =
      (this.retailer_margin_new / this.total_rsv_w_o_vat_new) * 100;
    this.mars_mac_new = this.total_nsv_new - this.total_cogs_new;
    this.mars_mac_percent_of_nsv_new =
      (this.mars_mac_new / this.total_nsv_new) * 100;
    this.mars_percent_of_total_profit_pool_new =
      (this.mars_mac_new / (this.mars_mac_new + this.retailer_margin_new)) *
      100;
    this.retailer_percent_of_total_profit_pool_new =
      (this.retailer_margin_new /
        (this.retailer_margin_new + this.mars_mac_new)) *
      100;
    this.rsv_w_o_vat_$_chg =
      this.total_rsv_w_o_vat_new - this.total_rsv_w_o_vat;
    this.nsv_$_chg =
      this.total_nsv_new - parseFloat(this.total_nsv.replace(/,/g, ''));
    this.cogs_$_chg =
      this.total_cogs_new - parseFloat(this.total_cogs.replace(/,/g, ''));
    this.trade_expense_$_chg =
      this.trade_expense_new - parseFloat(this.trade_expense.replace(/,/g, ''));
    this.retailer_margin_$_chg =
      this.retailer_margin_new -
      parseFloat(this.retailer_margin.replace(/,/g, ''));
    this.mars_mac_$_chg =
      this.mars_mac_new - parseFloat(this.mars_mac.replace(/,/g, ''));
    this.percent_rsv_w_o_vat_$_chg =
      ((this.total_rsv_w_o_vat_new - this.total_rsv_w_o_vat) /
        this.total_rsv_w_o_vat) *
      100;
    this.percent_nsv_$_chg =
      ((this.total_nsv_new - parseFloat(this.total_nsv.replace(/,/g, ''))) /
        parseFloat(this.total_nsv.replace(/,/g, ''))) *
      100;
    this.percent_cogs_$_chg =
      ((this.total_cogs_new - parseFloat(this.total_cogs.replace(/,/g, ''))) /
        parseFloat(this.total_cogs.replace(/,/g, ''))) *
      100;
    this.percent_trade_expense_$_chg =
      ((this.trade_expense_new -
        parseFloat(this.trade_expense.replace(/,/g, ''))) /
        parseFloat(this.trade_expense.replace(/,/g, ''))) *
      100;
    this.percent_retailer_margin_$_chg =
      ((this.retailer_margin_new -
        parseFloat(this.retailer_margin.replace(/,/g, ''))) /
        parseFloat(this.retailer_margin.replace(/,/g, ''))) *
      100;
    this.percent_mars_mac_$_chg =
      ((this.mars_mac_new - parseFloat(this.mars_mac.replace(/,/g, ''))) /
        parseFloat(this.mars_mac.replace(/,/g, ''))) *
      100;
  }
}
