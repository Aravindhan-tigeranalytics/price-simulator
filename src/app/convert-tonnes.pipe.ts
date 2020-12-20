import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTonnes',
})
export class ConvertTonnesPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    console.log(args, 'ARRGGGG');
    if (args.length > 0) {
      if (args[0]) {
        return value;
      }
    }
    return value / 1000;
  }
}
