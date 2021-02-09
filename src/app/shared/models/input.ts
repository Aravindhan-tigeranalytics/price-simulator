import * as utils from "../utils/utils"
export class SimulatedArray {
  key: string;
  cateory:Array<string>;
  retailer:Array<string>;
  current: SimulatedSummary;
  simulated: SimulatedSummary;
  absolute_change: SimulatedSummary;
  percent_change: SimulatedSummary;

  constructor(key,cateory,retailer, current, simulated, absolute_change, percent_change) {
    this.key = key;
    this.cateory = cateory;
    this.retailer = retailer;
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
  cogs : number
  nsv_tonnes: number;
  te: number;
  te_percent_lsv: number;
  te_units: number;
  mac: number;
  mac_percent_nsv: number;
  rp: number;
  rp_percent_rsv: number;
  constructor(units, tonnes, lsv, rsv, nsv,cogs, te, mac, rp ,te_percent_lsv?,mac_percent_nsv?,rp_percent_rsv?) {
    this.units = units;
    this.tonnes = tonnes;
    this.lsv = lsv;
    this.rsv = rsv;
    this.nsv = nsv;
    this.cogs = cogs

    this.nsv_tonnes = utils.NanCheck(this.nsv,this.tonnes);
    
    this.te = te;
    if(te_percent_lsv){
      this.te_percent_lsv = te_percent_lsv

    }
    else{
      this.te_percent_lsv = utils.NanCheck(this.te,this.lsv) * 100;

    }
    
    this.te_units = utils.NanCheck(this.te , units);
    this.mac = mac;
    if(mac_percent_nsv){
      this.mac_percent_nsv  = mac_percent_nsv

    }
    else{
      this.mac_percent_nsv = utils.NanCheck(this.mac ,this.nsv) * 100;

    }
   
    this.rp = rp;
    if(rp_percent_rsv){
      this.rp_percent_rsv = rp_percent_rsv

    }
    else{
      this.rp_percent_rsv = utils.NanCheck(this.rp , this.rsv) * 100;

    }
   
  }
  public getTonnes(){
    return new SimulatedSummary(
      this.units ,
       this.tonnes,
       utils.NanCheck(this.lsv,this.tonnes) ,
       utils.NanCheck(this.rsv ,this.tonnes),
        utils.NanCheck(this.nsv  ,this.tonnes),
          utils.NanCheck(this.cogs,this.tonnes),
            utils.NanCheck(this.te ,this.tonnes),
              utils.NanCheck(this.mac ,this.tonnes),
                utils.NanCheck(this.rp,this.tonnes),
      this.te_percent_lsv,
       this.mac_percent_nsv,
      this.rp_percent_rsv
    );
   

  }
  public getUnits(){
    return new SimulatedSummary(
      this.units ,
       this.tonnes,
       utils.NanCheck(this.lsv,this.units) ,
       utils.NanCheck(this.rsv ,this.units),
        utils.NanCheck(this.nsv  ,this.units),
          utils.NanCheck(this.cogs,this.units),
            utils.NanCheck(this.te ,this.units),
              utils.NanCheck(this.mac ,this.units),
                utils.NanCheck(this.rp,this.units),
      this.te_percent_lsv,
       this.mac_percent_nsv,
      this.rp_percent_rsv
    );
   

  }


  public get_absolute(obj: SimulatedSummary): SimulatedSummary {
    return new SimulatedSummary(
      obj.units - this.units,
       obj.tonnes - this.tonnes,
      obj.lsv - this.lsv ,
      obj.rsv - this.rsv ,
      obj.nsv - this.nsv  ,
      obj.cogs - this.cogs,
      obj.te - this.te ,
      obj.mac - this.mac ,
      obj.rp -  this.rp,
      obj.te_percent_lsv - this.te_percent_lsv,
      obj.mac_percent_nsv - this.mac_percent_nsv,
      obj.rp_percent_rsv - this.rp_percent_rsv
    );
  }
  public get_percent_change(final: SimulatedSummary): SimulatedSummary {
    return new SimulatedSummary(
      utils.NanCheck((final.units - this.units) , this.units) * 100,
      utils.NanCheck((final.tonnes - this.tonnes) , this.tonnes) * 100,
      utils.NanCheck((final.lsv - this.lsv) , this.lsv) * 100,
      utils.NanCheck((final.rsv - this.rsv) , this.rsv) * 100,
      utils.NanCheck((final.nsv - this.nsv) , this.nsv) * 100,
      utils.NanCheck((final.cogs - this.cogs) , this.cogs) * 100,
      utils.NanCheck((final.te - this.te) , this.te) * 100,
      utils.NanCheck((final.mac - this.mac) , this.mac) * 100,
      utils.NanCheck((final.rp - this.rp) , this.rp) * 100,
      utils.NanCheck((final.te_percent_lsv - this.te_percent_lsv) , this.te_percent_lsv) * 100,
      // final.te_percent_lsv - this.te_percent_lsv,
      utils.NanCheck((final.mac_percent_nsv - this.mac_percent_nsv) , this.mac_percent_nsv) * 100,
      // final.mac_percent_nsv - this.mac_percent_nsv,
      utils.NanCheck((final.rp_percent_rsv - this.rp_percent_rsv) , this.rp_percent_rsv) * 100,
      // final.rp_percent_rsv - this.rp_percent_rsv // chaneg form
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
  net_elasticity : number;
  base_price_elasticity_used: number;
  base_price_elasticity_manual: number;
  competition: number;
  tonnes:number;
  rsv:number;
  mac: number;
  nsv:number;
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
    net_elasticity,
    competition
  ) {
    this.retailer = retailer;
    this.category = category;
    this.product_group = product_group;
    this.ret_cat_prod = this.product_group;
    // + "-" + this.retailer + "-" + this.category
    this.cogs = cogs;
    this.base_price_elasticity_used = base_price_elasticity;
    this.base_price_elasticity_manual = base_price_elasticity;
    this.net_elasticity = net_elasticity;
    this.competition = competition;
    this.lp = lp;
    this.rsp = rsp;
  }
}
