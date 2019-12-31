import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { Log } from '../models/log.model';
import logs from './data/logs';

@Injectable({
  providedIn: 'root',
})
export class DataUtils {
  private logs: Log[];
  constructor() { }

  public getLogs(): Observable<Log[]> {
    return new Observable((observer) => {
      this.logs = this.getLogsFromLocal();
      if (!this.logs) {
        this.logs = logs;
      }
      observer.next(this.logs);
    });
  }

  public setLogs(salesLog: Log[]): Observable<boolean> {
    return new Observable(observer => {
      this.setLogsInLocal(salesLog);
      observer.next(true);
    });
  }


  private setLogsInLocal(salesLogs: Log[]) {
    localStorage.setItem('logs', JSON.stringify(salesLogs));
  }

  private getLogsFromLocal(): Log[] {
    return JSON.parse(localStorage.getItem('logs'));
  }
}
