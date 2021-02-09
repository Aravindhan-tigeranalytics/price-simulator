import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTonnes',
})
export class ConvertTonnesPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    // console.log(value, 'ARRGGGG');
    // value = Number(value)
    if (args.length > 0) {
      if (args[0]) {
        return value;
      }
    }
    if(value){
      let str = value.toFixed(2).split(".")[0]
      let strlen = str.length
      let final = value
      let curr = ""
      if(strlen >=4 && strlen <=6){
        final = value / 1000;
        curr = "K"
  
      }
      else if (strlen >=7 && strlen <=9){
        final = value / 1000000
        curr = "M"
      }
      else if(strlen >= 10){
        final = value / 1000000000
        curr = "B"
      }
      // console.log(value , "ACTUAL")
      // console.log(strlen , "ACTUAL LEN")
      // console.log(final , "FINAL")
      return  final.toFixed(1) + curr

    }
    return 0
    
  }
}
