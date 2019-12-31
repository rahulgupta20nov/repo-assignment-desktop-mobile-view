import { Injectable } from '@angular/core';
import { Time } from '../models/date.model';

@Injectable({
  providedIn: 'root',
})

export class DateUtilsService {
  timestampInMilli: number = 24 * 60 * 60 * 1000;
  constructor(){}

  getMidnightDate(getTime: number): number {
    const date = new Date(getTime);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  isDateEqual(aDate: number, bDate: number): boolean {
    const prevDate = this.getMidnightDate(aDate);
    const currentDate = this.getMidnightDate(bDate);
    return prevDate !== currentDate;
  }

  distanceInDays(aDate: number): string {
    aDate = this.getMidnightDate(aDate);
    return this.caculateDaysFromToday(aDate);
  }

  addDateAndTime(date: Date, time: Time): number {
    const midNightTimeStamp = this.getMidnightDate(date.getTime());
    const timeInTimestamp = this.calculateTimeInTimestamp(time);
    return midNightTimeStamp + timeInTimestamp;
  }

  getTime(date): Time {
    const currentDate = new Date(date);
    const hourVal = currentDate.getHours();
    const minuteVal = currentDate.getMinutes();
    const hour: number | string = hourVal > 12 ? hourVal % 12 : hourVal;
    return { 
      hour: hour < 10 ? '0' + hour : hour.toString(), 
      minute: minuteVal < 10 ? '0' + minuteVal : minuteVal.toString(), 
      meridian: hourVal > 11 ? 'PM' : 'AM',
    };
  }

  private calculateTimeInTimestamp(time: Time): number {
    const { hour, minute, meridian } = time;
    const hours = parseInt(hour, 10) % 12;
    let totalSecond = 0;
    if(meridian === 'PM') {
      totalSecond += 12 * 60 * 60;
    }
    totalSecond += (hours * 60 * 60) + parseInt(minute, 10) * 60;
    return totalSecond * 1000;
  }

  private caculateDaysFromToday(aDate) {
    const todayMidnightTimestamp  = this.getMidnightDate(new Date().getTime());
    if(aDate === todayMidnightTimestamp) {
      return 'Today';
    }
    const calculateDays = Math.floor((aDate - todayMidnightTimestamp) / this.timestampInMilli);
    if(calculateDays < 0) {
      return `Dues from ${Math.abs(calculateDays)} Day${calculateDays < -1 ? 's' : ''}`;
    } else {
      return `In ${Math.abs(calculateDays)} Day${calculateDays < -1 ? 's' : ''}`;
    }
  }

}
