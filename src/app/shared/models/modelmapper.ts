export function mapJson(data , classs){
  return  new classs(
    data['Category'],
    data['Product Group'],
    data['Retailer'],
    data['Year'],
     data['Date'],
      data['%LPI'],
      data['% RSP Increase'],
     data['% COGS Increase'],
     data['Base Price Elasticity'],
     data['Cross Elasticity'],
     data['Net Elasticity'],
    data['Competition'],
      data['Base Units'],
    data['List Price'],
     data['Retailer Median Base Price'],
     data['Retailer Median Base Price  w\\o VAT'],
     data['On Inv. %'],
     data['Off Inv. %'],
    data['"TPR %'],
     data['GMAC%, LSV'],
     data['Product Group Weight (grams)'],
     data['Mars On-Invoice'],
     data['Mars NSV'],
    data['TPR Budget'],
     data['Mars Net Invoice Price'],
    data['Mars Off-Invoice'],
     data['Mars NSV'],
     data['Retailer mark-up'],
     data['GMAC, LSV Per Unit'],
     data['Mars COGS Per Unit'],
    data["Total RSV"],
      data['"Total RSV  w\\o VAT"'],
   data["Total LSV"],
    
    data['Mars Total On-Invoice '],
    
    data["Mars Total NRV"],
     data["Mars Total Net Invoice Price"],
     
     data["Mars Total Off-Invoice"],
    // @propertyMap("Total NSV")
    data["Total NSV"],
    // @propertyMap("Total COGS")
     data["Total COGS"],
    // @propertyMap()
      data["Total Weight (tons)"],
    // @propertyMap(" Trade Expense")
      data[" Trade Expense"],
    // @propertyMap("Retailer Margin")
      data["Retailer Margin"],
    // @propertyMap("Retailer Margin,% of RSP")
     data["Retailer Margin,% of RSP"],
    // @propertyMap("Mars MAC")
    data["Mars MAC"],
    // @propertyMap("Mars MAC,% of NSV")
    data["Mars MAC,% of NSV"],
    // @propertyMap("Mars,% of Total Profit Pool")
      data["Mars,% of Total Profit Pool"],
    // @propertyMap("Retailer ,% of Total Profit Pool")
      data["Retailer ,% of Total Profit Pool"]
  )

}


export class ModelMapper<T> {
    _propertyMapping: any;
    _target: any;
       constructor(type: { new(): T ;}){
          this._target = new type();
          this._propertyMapping = this._target.constructor._propertyMap;
        //       console.log(this._target , "TARGET")
        //    console.log(this._propertyMapping , "PROPERTY MAPPING")
       }
  
       map(source){
        //    console.log(source , "SOURCE")
        //    console.log(this._target , "TARGET")
        //    console.log(this._propertyMapping , "PROPERTY MAPPING")
         
           
         Object.keys(this._target).forEach((key) => {
            //  console.log(key , "KEYYY")
           const mappedKey = this._propertyMapping[key]
        //    console.log(mappedKey , " MAPPED KEYYY")
           if(mappedKey){
             this._target[key] = source[mappedKey];
            //  console.log(mappedKey , "source[mappedKey]")
           }
           else {
             this._target[key] = source[key];
            //  console.log(mappedKey , "source[key]")
           }
         });
         Object.keys(source).forEach((key)=>{
             
           const targetKeys = Object.keys(this._target);
           if(targetKeys.indexOf(key) === -1){
             this._target[key] = source[key];
           }
         });

        

        return this._target;
       }
  }