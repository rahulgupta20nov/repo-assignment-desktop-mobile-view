import { Injectable } from '@angular/core';
import { DataUtils } from '../utils/data.utils';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Log } from '../models/log.model';

@Injectable({
  providedIn: 'root'
})
export class SalesLogsService {
  subject: BehaviorSubject<boolean>;
  constructor(public dataUtils: DataUtils) {
    this.subject =  new BehaviorSubject<boolean>(true);
  }

  nextGetData() {
    this.subject.next(true);
  }

  getSalesLog(): Observable<Log[]> {
    return this.dataUtils.getLogs();
  }

  saveSalesLog(salesLog: Log): Observable<boolean> {
    return new Observable(observer => {
      this.getSalesLog().subscribe((logs) => {
        console.log(salesLog);
        let log: Log;
        if (!salesLog.id) {
          const getNewId = parseInt(logs[logs.length - 1].id, 10);
          log = { ...salesLog, id: (getNewId + 1).toString() };
          logs.push(log);
        } else {
          logs[logs.findIndex((taskLog) => taskLog.id === salesLog.id)] = salesLog;
        }
        this.dataUtils.setLogs(logs)
          .subscribe(result => observer.next(result));
      });
    });
  }

  processSalesLog(salesLog: Log): Observable<boolean> {
    return new Observable(observer => {
      console.log(salesLog);
      this.saveSalesLog(salesLog)
        .subscribe(result => {
          if (result) {
            this.nextGetData();
            observer.next(true);
          }
        });
    });
  }
}

