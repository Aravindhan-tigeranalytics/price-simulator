import { Pipe, PipeTransform } from '@angular/core';
import {
  SimulatorInput,
  SimulatedSummary,
  SimulatedArray,
} from './shared/models/input';
function valueMapping(metric, obj: SimulatedSummary) {
  
  switch (metric) {
    case metric = 'LSV': {
      return obj.lsv
    }

    case metric = 'NSV': {

      return obj.nsv
    }
    case metric = 'RSV': {

      return obj.rsv
    }
    case metric = 'Units': {

      return obj.units
    }
    case metric = 'TE': {

      return obj.te
    }
    case metric = 'Tonnes': {

      return obj.tonnes
    }
    case metric = 'NSV/Tons': {

      return obj.nsv_tonnes
    }
    case metric = 'TE,%LSV': {

      return obj.te_percent_lsv
    }
    case metric = 'TE/Units': {

      return obj.te_units
    }
    case metric = 'MAC': {

      return obj.mac
    }
    case metric = 'MAC,%NSV': {

      return obj.mac_percent_nsv
    }
    case metric = 'Customer Margin': {

      return obj.rp
    }
    case metric = 'Customer Margin,%RSV': {

      return obj.rp_percent_rsv
    }

    default: {
      return 0

    }
  }

}
function objectMapping(str , obj:SimulatedSummary) : SimulatedSummary{
  switch (str) {
    case str = 'total': {
      return obj
    }

    case str = 'per ton': {

      return obj.getTonnes()
    }
    case str = 'per unit': {
      return obj.getUnits()
    }
    default: {
      return obj

    }

}
}
@Pipe({
  name: 'comparePipe'
})

export class ComparePipePipe implements PipeTransform {

  transform(value: SimulatedArray, ...args: unknown[]): unknown {
    // console.log(value, "PIPE VALUE ")
    // console.log(args, "Aruments")
    let returns = 0;
    if (args[1] == "abs") {
      returns = valueMapping(args[0],  objectMapping(args[2],value.absolute_change))
    }
    else if(args[1] == "per"){
      returns = valueMapping(args[0], objectMapping(args[2],value.percent_change))

    }
    else if(args[1] == "curr"){
      returns = valueMapping(args[0], objectMapping(args[2],value.current))

    }
    else if(args[1] == "sim"){
      returns = valueMapping(args[0], objectMapping(args[2],value.simulated))


    }
    else{
      returns =0;
    }
    // console.log(returns, "returns")
    return returns

  }

}
