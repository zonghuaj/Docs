import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ellipsis',
})
export class EllipsisPipe implements PipeTransform {
  transform(value: string, maxLen = 10): any {
    if (value.length > maxLen) {
      return value.slice(0, maxLen) + '...';
    } else {
      return value;
    }
  }
}
