import { Component, OnInit, Input, OnChanges, DoCheck, IterableDiffers, IterableDiffer, Output, EventEmitter } from '@angular/core';
import { Sort, MatDialog } from '@angular/material';
import { DateUtilsService } from 'src/app/utils/date.utils';
import { Log } from 'src/app/models/log.model';
import { AddNewTaskComponent } from '../add-new-task/add-new-task.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../confirm-dialog/confirm-dialog.component';
import { SalesLogsService } from 'src/app/services/sales-logs.service';
import { Observable } from 'rxjs';

interface TaskType {
  name: string;
  icon: string;
  id: string;
  checked?: boolean;
  type?: string;
}

interface TaskStatus { 
  name: string;
  checked?: boolean;
  id: string;
  type?: string;
}

@Component({
  selector: 'app-sales-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.scss']
})
export class SalesTableComponent implements OnInit, DoCheck {
  @Input() salesLog: Log[];
  @Output() filteredArray = new EventEmitter<(TaskType|TaskStatus)[]>();
  sortedData: Log[];
  sort: Sort = {
    active: 'date',
    direction: 'asc',
  };
  statusCount;
  iterableDiffer: IterableDiffer<unknown>;
  salesLogSubscription: Observable<boolean>;
  taskTypes: TaskType[] = [{ name: 'Call', icon: 'phone', id: 'call' }, { name: 'Meeting', icon: 'my_location', id: 'meeting' }, { name: 'Video', icon: 'videocam', id: 'video' }];
  taskStatus: TaskStatus[] = [{ name: 'open', id: 'open' }, { name: 'closed', id: 'closed' }];

  constructor(
    private dateUtilsService: DateUtilsService,
    private iterableDiffers: IterableDiffers,
    public dialog: MatDialog,
    private salesLogService: SalesLogsService,
  ) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
    this.sortData(this.sort);
    this.statusCountByDate(this.sortedData);
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.salesLog);
    if (changes) {
      this.sortData(this.sort);
      this.statusCountByDate(this.sortedData);
    }
  }

  sortData(sort: Sort) {
    this.sort = sort;
    console.log();
    const data = this.salesLog.map(val => val);
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      if (sort.active === 'time') {
        const aTime = a.date - this.dateUtilsService.getMidnightDate(a.date);
        const bTime = b.date - this.dateUtilsService.getMidnightDate(b.date);
        return compare(aTime, bTime, isAsc);
      }
      return compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  getDate(epochDate: number): Date {
    return new Date(epochDate);
  }

  getTime(epochDate: number, time: number): Date {
    return new Date((epochDate + time * 60 * 1000));
  }

  isShowGroupedDate(index): boolean {
    if (!index) {
      return true;
    } else if (!this.sortedData[index].date) {
      return false;
    }
    return this.dateUtilsService.isDateEqual(this.sortedData[index - 1].date, this.sortedData[index].date);
  }

  statusCountByDate(sortedDate: Log[]): void {
    this.statusCount = {};
    this.sortedData.forEach((row) => {
      const midNightTimestamp = this.dateUtilsService.getMidnightDate(row.date);
      if (!this.statusCount[midNightTimestamp]) {
        this.statusCount[midNightTimestamp] = 0;
      }
      if (row.taskStatus === 'open') {
        this.statusCount[midNightTimestamp]++;
      }
    });
  }

  getStatusCount(date: number): number {
    const midNightTimestamp = this.dateUtilsService.getMidnightDate(date);
    return this.statusCount[midNightTimestamp];
  }

  editLog(index: number): void {
    this.dialog.open(AddNewTaskComponent, {
      width: '460px',
      maxHeight: '100vh',
      data: this.sortedData[index],
    });
  }

  createDuplicateLog(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel('Confirm Action', 'Are you want to create duplicate?')
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const salesLog: Log = { ...this.sortedData[index] };
        salesLog.taskStatus = 'open';
        delete salesLog.id;
        this.saveSalesLog(salesLog, () => {
          dialogRef.close(result);
        });
      }
    });
  }

  changeStatus(status: string, index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: new ConfirmDialogModel('Confirm Action', 'Are you want to close this task?')
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const salesLog: Log = this.sortedData[index];
        salesLog.taskStatus = 'closed';
        this.saveSalesLog(salesLog, () => {
          dialogRef.close(result);
        });
      }
    });
  }

  saveSalesLog(salesLog, callback?) {
    this.salesLogService.processSalesLog(salesLog).subscribe(
      (result) => {
        if (result && callback) {
          callback();
        }
      }
    );
  }

  createNewTask(index): void {
    const salesLog: Log = { ...this.sortedData[index] };
    salesLog.taskStatus = 'open';
    delete salesLog.id;
    this.saveSalesLog(salesLog);
  }

  closedFilterMenu() {
    this.sortData(this.sort);
    const taskTypeFilter = this.taskTypes
      .filter((val) => val.checked)
      .map((val) => {
        val['type'] = 'taskType';
        return val;
      });
    if (taskTypeFilter.length) {
      this.sortedData = this.sortedData.filter(
        (log) => taskTypeFilter.find(
          (type) => log.taskType === type.id,
        ),
      );
    }
    let filterArr: (TaskType | TaskStatus)[] = taskTypeFilter;
    const taskStatusFilter = this.taskStatus
      .filter((val) => val.checked)
      .map((val) => {
        val['type'] = 'taskStatus';
        return val;
      });
    if (taskStatusFilter.length) {
      this.sortedData = this.sortedData.filter(
        (log) => taskStatusFilter.find(
          (type) => log.taskStatus === type.id,
        ),
      );
    }
    filterArr = [...filterArr, ...taskStatusFilter];
    this.filteredArray.emit(filterArr);
  }

  clearFilter(elem: (TaskStatus | TaskType)) {
    console.log(elem.type);
    this[elem.type === 'taskType' ? 'taskTypes' : 'taskStatus'].forEach((val) => {
      if (val.id === elem.id) {
        val.checked = false;
      }
    });
    this.closedFilterMenu();
  }

  ngOnDestroy() {

  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
