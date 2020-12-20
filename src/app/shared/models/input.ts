export class SimulatedArray {
  key: string;
  current: SimulatedSummary;
  simulated: SimulatedSummary;
  absolute_change: SimulatedSummary;
  percent_change: SimulatedSummary;

  constructor(key, current, simulated, absolute_change, percent_change) {
    this.key = key;
    this.current = current;
    this.simulated = simulated;
    this.absolute_change = absolute_change;
    this.percent_change = percent_change;
  }
}

export class SimulatedSummary {
  units: number;
  tonnes: number;
  lsv: number;
  rsv: number;
  nsv: number;
  nsv_tonnes: number;
  te: number;
  te_percent_lsv: number;
  te_units: number;
  mac: number;
  mac_percent_nsv: number;
  rp: number;
  rp_percent_rsv: number;
  constructor(units, tonnes, lsv, rsv, nsv, te, mac, rp) {
    this.units = units;
    this.tonnes = tonnes;
    this.lsv = lsv;
    this.rsv = rsv;
    this.nsv = nsv;
    this.nsv_tonnes = this.nsv / this.tonnes;
    this.te = te;
    this.te_percent_lsv = (this.te / this.lsv) * 100;
    this.te_units = this.te / units;
    this.mac = mac;
    this.mac_percent_nsv = (this.mac / this.nsv) * 100;
    this.rp = rp;
    this.rp_percent_rsv = (this.rp / this.rsv) * 100;
  }

  public get_absolute(obj: SimulatedSummary): SimulatedSummary {
    return new SimulatedSummary(
      this.units - obj.units,
      this.tonnes - obj.tonnes,
      this.lsv - obj.lsv,
      this.rsv - obj.rsv,
      this.nsv - obj.nsv,

      this.te - obj.te,
      this.mac - obj.mac,
      this.rp - obj.rp
    );
  }
  public get_percent_change(final: SimulatedSummary): SimulatedSummary {
    return new SimulatedSummary(
      ((final.units - this.units) / this.units) * 100,
      ((final.tonnes - this.tonnes) / this.tonnes) * 100,
      ((final.lsv - this.lsv) / this.lsv) * 100,
      ((final.rsv - this.rsv) / this.rsv) * 100,
      ((final.nsv - this.nsv) / this.nsv) * 100,
      ((final.te - this.te) / this.te) * 100,
      ((final.mac - this.mac) / this.mac) * 100,
      ((final.rp - this.rp) / this.rp) * 100
    );
  }
}
export class ClassObj {
  id: number;
  constructor(id) {
    this.id = id;
  }
}
export class SimulatorInput {
  retailer: string;
  category: string;
  product_group: string;
  ret_cat_prod: string;
  cogs: number;
  lp: number;
  rsp: number;
  lpi_percent = 0;
  rsp_precent = 0;
  cogs_percent = 0;
  base_price_elasticity_used: number;
  base_price_elasticity_manual: number;
  competition: number;
  mac: number;
  rp: number;
  te: number;

  constructor(
    retailer,
    category,
    product_group,
    cogs,
    lp,
    rsp,
    base_price_elasticity,
    competition
  ) {
    this.retailer = retailer;
    this.category = category;
    this.product_group = product_group;
    this.ret_cat_prod = this.product_group;
    // + "-" + this.retailer + "-" + this.category
    this.cogs = cogs;
    this.base_price_elasticity_used = base_price_elasticity;
    this.competition = competition;
    this.lp = lp;
    this.rsp = rsp;
  }
}
