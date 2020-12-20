import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnder',
})
export class RemoveUnderPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value.split('_').join(' ');
  }
}
