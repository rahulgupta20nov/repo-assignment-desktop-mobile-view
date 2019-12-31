import { Pipe, PipeTransform } from '@angular/core';
import { DateUtilsService } from '../utils/date.utils';

@Pipe({
  name: 'distanceDate'
})
export class DistanceDatePipe implements PipeTransform {

  constructor(private dateUtils: DateUtilsService) {}
  transform(aDate: number): string {
    return this.dateUtils.distanceInDays(aDate);
  }

}
