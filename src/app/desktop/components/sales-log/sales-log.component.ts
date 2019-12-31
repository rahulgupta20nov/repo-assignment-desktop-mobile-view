import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewTaskComponent } from './add-new-task/add-new-task.component';
import { Log } from '../../../models/log.model';
import { SalesLogsService } from '../../../services/sales-logs.service';
import { SalesTableComponent } from './sales-table/sales-table.component';

@Component({
  selector: 'app-sales-log',
  templateUrl: './sales-log.component.html',
  styleUrls: ['./sales-log.component.scss'],
})
export class SalesLogComponent implements OnInit, OnDestroy {
  salesLogs: Log[] = [];
  @ViewChild('salesTable') salesTable: SalesTableComponent;

  filterArray;
  constructor(public dialog: MatDialog, public salesLogService: SalesLogsService) { }

  ngOnInit() {
    this.getSalesLog();

    this.salesLogService.subject.subscribe(
      (data) => {
        if (data) {
          this.getSalesLog();
        }
      }
    )
  }

  getSalesLog() {
    this.salesLogService.getSalesLog()
      .subscribe(
        (response: Log[]) => {
          this.salesLogs = response;
        }
      );
  }

  openDialog() {
    this.dialog.open(AddNewTaskComponent, {
      width: '460px',
      maxHeight: '100vh'
    });
  }

  getFilteredArray(filterArray) {
    this.filterArray = filterArray;
  }

  clearFilter(index) {
    this.salesTable.clearFilter(this.filterArray[index]);
  }

  ngOnDestroy() {
    this.salesLogService.subject.unsubscribe();
  }
}
