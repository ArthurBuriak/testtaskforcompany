import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(arr: any[], property: string): any[] {
    // basic sort by property method
    return arr.sort((a, b) => b[property] - a[property]);
  }
}
